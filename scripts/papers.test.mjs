import test from 'node:test';
import assert from 'node:assert/strict';
import { arxivId, normalizeItems, selectPapers, loadLibrary } from '../assets/papers-core.mjs';

const item = (key, fields = {}) => ({ key: String(key), meta: {}, data: {
  itemType: 'preprint', title: `Paper ${key}`, abstractNote: 'An axion dark matter search.',
  archiveID: `arXiv:2601.${String(key).padStart(5, '0')}`,
  creators: [{ creatorType: 'author', firstName: 'José', lastName: 'García' }],
  tags: [], date: '2026-01-10', dateAdded: '2026-11-18T12:00:00Z', dateModified: '2026-11-18T12:00:00Z', ...fields
} });
const state = fields => ({ q: '', categories: [], labels: [], days: '', year: '', sort: 'added', ...fields });

test('identifiers handle URLs, versions, old arXiv IDs and DOI-only imports', () => {
  assert.equal(arxivId({ url: 'https://arxiv.org/pdf/2611.23374v2' }), '2611.23374');
  assert.equal(arxivId({ extra: 'arXiv:hep-ph/9709356v3 [hep-ph]' }), 'hep-ph/9709356');
  assert.equal(arxivId({ DOI: '10.48550/arXiv.2611.23374' }), '2611.23374');
});

test('category tags and primary categories are distinct from custom labels', () => {
  const [paper] = normalizeItems([item(1, { tags: [
    { tag: 'Astrophysics - Cosmology and Nongalactic Astrophysics', type: 1 },
    { tag: 'High Energy Physics - Phenomenology', type: 1 },
    { tag: 'axions' }, { tag: 'read' }
  ], extra: 'arXiv:2601.00001 [hep-th]' })]);
  assert.deepEqual(paper.categories, ['astro-ph.CO', 'hep-ph', 'hep-th']);
  assert.deepEqual(paper.labels, ['axions', 'read']);
  assert.equal(paper.url, 'https://arxiv.org/abs/2601.00001');
});

test('duplicate versions merge labels, keep first save date and latest metadata', () => {
  const papers = normalizeItems([item(1, { title: 'Original', tags: [{ tag: 'read' }] }),
    item(2, { archiveID: 'arXiv:2601.00001v3', title: 'Revised', tags: [{ tag: 'axions' }],
      dateAdded: '2026-11-19T12:00:00Z', dateModified: '2026-11-19T12:00:00Z' }),
    item(3, { itemType: 'note', note: 'Do not publish notes as papers' })]);
  assert.equal(papers.length, 1);
  assert.equal(papers[0].title, 'Revised');
  assert.equal(papers[0].added, '2026-11-18T12:00:00Z');
  assert.deepEqual(papers[0].labels, ['axions', 'read']);
});

test('combined search, category OR, label AND and date filters', () => {
  const papers = normalizeItems([item(1, { extra: '[hep-ph]', tags: [{ tag: 'axions' }, { tag: 'read' }] }),
    item(2, { extra: '[hep-ex]', tags: [{ tag: 'axions' }], dateAdded: '2025-01-01T00:00:00Z' })]);
  const selected = selectPapers(papers, state({ q: 'garcia dark', categories: ['hep-ph', 'hep-th'], labels: ['axions', 'read'], days: '7', year: '2026' }), Date.parse('2026-11-19T00:00:00Z'));
  assert.equal(selected.length, 1);
  assert.equal(selectPapers(papers, state({ q: 'no such paper' })).length, 0);
  assert.equal(selectPapers(papers, state({ categories: ['hep-th'] })).length, 0);
});

test('undated papers sort last; untrusted URL schemes are discarded', () => {
  const papers = normalizeItems([item(1, { date: '', archiveID: '', url: 'javascript:alert(1)' }), item(2)]);
  assert.equal(papers[0].url, '');
  for (const sort of ['newest', 'oldest']) assert.equal(selectPapers(papers, state({ sort })).at(-1).key, '1');
});

const response = (items, extra = {}, status = 200) => new Response(status === 304 ? null : JSON.stringify(items), {
  status, headers: { 'Last-Modified-Version': '12', ...extra }
});

test('loads every API page, including libraries larger than 100 papers', async () => {
  const starts = [];
  const result = await loadLibrary(6771640, { fetcher: async url => {
    const start = Number(new URL(url).searchParams.get('start')); starts.push(start);
    return response(Array.from({ length: start ? 3 : 100 }, (_, i) => item(start + i + 1)), { 'Total-Results': '103' });
  } });
  assert.equal(result.papers.length, 103);
  assert.deepEqual(starts, [0, 100]);
});

test('conditional refresh reuses cached data only on 304', async () => {
  const cached = { version: '12', papers: normalizeItems([item(1)]) };
  const result = await loadLibrary(6771640, { cached, fetcher: async (_, options) => {
    assert.equal(options.headers['If-Modified-Since-Version'], '12');
    assert.equal(options.credentials, 'omit');
    return response(null, {}, 304);
  } });
  assert.deepEqual(result.papers, cached.papers);
});

test('a fresh snapshot replaces removed papers rather than merging a stale cache', async () => {
  const result = await loadLibrary(6771640, {
    cached: { version: '11', papers: normalizeItems([item(1), item(2)]) },
    fetcher: async () => response([item(2)])
  });
  assert.equal(result.papers.length, 1);
  assert.equal(result.papers[0].key, '2');
});

test('rate limits carry Retry-After and successful responses carry Backoff', async () => {
  await assert.rejects(loadLibrary(6771640, { fetcher: async () => response({}, { 'Retry-After': '60' }, 429) }), error => error.retryAfter === 60);
  const result = await loadLibrary(6771640, { fetcher: async () => response([], { Backoff: '15' }) });
  assert.equal(result.backoff, 15);
});

test('does not cache a mixture of library versions during pagination', async () => {
  let request = 0;
  await assert.rejects(loadLibrary(6771640, { fetcher: async () => {
    request++;
    return response(Array.from({ length: 100 }, (_, i) => item(request * 100 + i)), {
      'Total-Results': '200', 'Last-Modified-Version': String(request)
    });
  } }), /changed during loading/);
});
