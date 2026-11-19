import { categoryNames } from './arxiv-categories.mjs';

const categoryCodes = new Map(Object.keys(categoryNames).map(code => [code.toLowerCase(), code]));
const namedCategories = new Map(Object.entries(categoryNames).map(([code, name]) => [name.toLowerCase(), code]));
const text = value => typeof value === 'string' ? value.trim() : '';
export const fold = value => text(value).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();

export function arxivId(data) {
  const candidates = [data.archiveID, data.url, data.DOI, data.extra, data.archiveLocation];
  for (const candidate of candidates) {
    const match = text(candidate).match(/(?:arxiv\s*:\s*|arxiv\.org\/(?:abs|pdf|html)\/|10\.48550\/arxiv\.)(\d{4}\.\d{4,5}|[a-z-]+(?:\.[A-Z]{2})?\/\d{7})(?:v\d+)?/i);
    if (match) return match[1].toLowerCase();
  }
  return '';
}

function categoryForTag(tag) {
  const value = text(tag).replace(/^arxiv\s*:\s*/i, '').toLowerCase();
  return categoryCodes.get(value) || namedCategories.get(value);
}

export function normalizeItems(items) {
  const unique = new Map();
  for (const item of items) {
    const data = item?.data;
    if (!data || ['attachment', 'note', 'annotation'].includes(data.itemType) || !text(data.title)) continue;
    const arxiv = arxivId(data);
    const categories = new Set();
    const labels = new Set();
    for (const entry of data.tags || []) {
      const tag = text(entry.tag);
      if (!tag) continue;
      const category = categoryForTag(tag);
      if (category) categories.add(category);
      else labels.add(tag);
    }
    // The primary category is retained in Extra even if automatic tags are off.
    for (const bracket of text(data.extra).matchAll(/\[([^\]]+)\]/g)) {
      for (const code of bracket[1].split(/[\s,;]+/)) {
        const category = categoryForTag(code);
        if (category) categories.add(category);
      }
    }
    const doi = text(data.DOI).replace(/^https?:\/\/(?:dx\.)?doi\.org\//i, '');
    let url = '';
    try {
      const candidate = new URL(text(data.url));
      if (['https:', 'http:'].includes(candidate.protocol)) url = candidate.href;
    } catch { /* An item can have no external URL. */ }
    const paper = {
      key: text(item.key || data.key), arxiv, doi,
      title: text(data.title), abstract: text(data.abstractNote),
      authors: (data.creators || []).filter(person => person.creatorType === 'author').map(person =>
        text(person.name) || [text(person.firstName), text(person.lastName)].filter(Boolean).join(' ')),
      date: text(item.meta?.parsedDate) || text(data.date),
      added: text(data.dateAdded), modified: text(data.dateModified),
      categories: [...categories].sort(), labels: [...labels].sort((a, b) => a.localeCompare(b)),
      url: arxiv ? `https://arxiv.org/abs/${arxiv}` : url || (doi ? `https://doi.org/${encodeURIComponent(doi)}` : '')
    };
    const identity = arxiv ? `arxiv:${arxiv}` : doi ? `doi:${doi.toLowerCase()}` : `key:${paper.key}`;
    const previous = unique.get(identity);
    if (previous) {
      const merged = paper.modified > previous.modified ? paper : previous;
      unique.set(identity, {
        ...merged,
        added: [previous.added, paper.added].filter(Boolean).sort()[0] || '',
        categories: [...new Set([...previous.categories, ...paper.categories])].sort(),
        labels: [...new Set([...previous.labels, ...paper.labels])].sort((a, b) => a.localeCompare(b))
      });
    } else unique.set(identity, paper);
  }
  return [...unique.values()];
}

const timestamp = value => Date.parse(value) || 0;
export const paperYear = paper => paper.date.match(/^\d{4}/)?.[0] || '';

export function selectPapers(papers, state, now = Date.now()) {
  const terms = fold(state.q || '').split(/\s+/).filter(Boolean);
  const filtered = papers.filter(paper => {
    if (state.categories.length && !state.categories.some(category => paper.categories.includes(category))) return false;
    if (!state.labels.every(label => paper.labels.includes(label))) return false;
    if (state.year && paperYear(paper) !== state.year) return false;
    if (state.days && timestamp(paper.added) < now - Number(state.days) * 86400000) return false;
    const haystack = fold([paper.title, paper.abstract, ...paper.authors, paper.arxiv, ...paper.labels, ...paper.categories].join(' '));
    return terms.every(term => haystack.includes(term));
  });
  return filtered.sort((a, b) => {
    if (state.sort === 'title') return a.title.localeCompare(b.title);
    // Undated papers stay at the bottom in both chronological directions.
    if (state.sort === 'newest' || state.sort === 'oldest') {
      const aDate = timestamp(a.date), bDate = timestamp(b.date);
      if (!aDate || !bDate) return aDate ? -1 : bDate ? 1 : a.title.localeCompare(b.title);
      return (state.sort === 'oldest' ? aDate - bDate : bDate - aDate) || a.title.localeCompare(b.title);
    }
    return timestamp(b.added) - timestamp(a.added) || a.title.localeCompare(b.title);
  });
}

export class LibraryError extends Error {
  constructor(message, retryAfter = 0) { super(message); this.retryAfter = retryAfter; }
}

function retrySeconds(value) {
  if (!value) return 0;
  if (/^\d+$/.test(value)) return Number(value);
  return Math.max(0, Math.ceil((Date.parse(value) - Date.now()) / 1000)) || 0;
}

export async function loadLibrary(groupId, { cached = null, fetcher = fetch } = {}) {
  const items = [];
  let version = '', backoff = 0, start = 0;
  const seen = new Set();
  while (true) {
    const url = new URL(`https://api.zotero.org/groups/${groupId}/items/top`);
    url.search = new URLSearchParams({ format: 'json', v: '3', limit: '100', sort: 'dateAdded', direction: 'desc', start: String(start) });
    const headers = {};
    if (!start && cached?.version) headers['If-Modified-Since-Version'] = cached.version;
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 20000);
    let response;
    try {
      response = await fetcher(url.href, { headers, signal: controller.signal, credentials: 'omit', cache: 'no-store' });
      backoff = Math.max(backoff, retrySeconds(response.headers.get('Backoff')));
      if (response.status === 304 && !start && cached) return { papers: cached.papers, version: cached.version, backoff };
      if (!response.ok) throw new LibraryError(`Zotero HTTP ${response.status}`, Math.max(backoff, retrySeconds(response.headers.get('Retry-After'))));
      const currentVersion = response.headers.get('Last-Modified-Version') || '';
      if (start && currentVersion !== version) throw new LibraryError('Library changed during loading; refresh to try again.', backoff);
      version = currentVersion;
      const page = await response.json();
      if (!Array.isArray(page)) throw new LibraryError('Unexpected library response.', backoff);
      const before = items.length;
      for (const item of page) {
        if (!seen.has(item.key)) { seen.add(item.key); items.push(item); }
      }
      const total = Number(response.headers.get('Total-Results'));
      const hasNext = /rel="next"/.test(response.headers.get('Link') || '');
      if (!page.length || (!hasNext && (page.length < 100 || (total > 0 && start + page.length >= total)))) break;
      if (items.length === before || start > 100000) throw new LibraryError('Unexpected pagination response.', backoff);
      start += page.length;
    } finally { clearTimeout(timeout); }
  }
  return { papers: normalizeItems(items), version, backoff };
}
