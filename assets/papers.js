import { categoryNames } from './arxiv-categories.mjs';
import { loadLibrary, paperYear, selectPapers } from './papers-core.mjs';

(() => {
  const config = JSON.parse(document.getElementById('reading-config').textContent);
  const t = config.copy;
  const locale = config.lang === 'es' ? 'es-AR' : 'en-US';
  const $ = id => document.getElementById(id);
  const list = $('paper-list');
  const cacheKey = `reading-list:v1:${config.groupId}`;
  const search = $('paper-search'), sort = $('paper-sort'), days = $('paper-added'), year = $('paper-year');
  const refresh = $('refresh-papers');
  const dateFormat = new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', day: 'numeric', timeZone: 'UTC' });
  let cache = null, papers = [], loaded = false, loading = false, refreshAfter = 0, searchTimer;
  const format = (template, values) => template.replace(/\{(\w+)\}/g, (_, key) => values[key] ?? '');
  const state = { q: '', categories: [], labels: [], days: '', year: '', sort: 'added', abstracts: [] };

  function readState() {
    const params = new URLSearchParams(location.search);
    state.q = (params.get('q') || '').slice(0, 500);
    state.categories = [...new Set(params.getAll('category'))];
    state.labels = [...new Set(params.getAll('label'))];
    state.days = ['7', '30', '90'].includes(params.get('days')) ? params.get('days') : '';
    state.year = /^\d{4}$/.test(params.get('year') || '') ? params.get('year') : '';
    state.sort = ['added', 'newest', 'oldest', 'title'].includes(params.get('sort')) ? params.get('sort') : 'added';
    state.abstracts = [...new Set(params.getAll('abstract'))];
    search.value = state.q; sort.value = state.sort; days.value = state.days;
  }

  function writeState() {
    const url = new URL(location.href);
    for (const key of ['q', 'category', 'label', 'days', 'year', 'sort', 'abstracts', 'abstract']) url.searchParams.delete(key);
    if (state.q) url.searchParams.set('q', state.q);
    state.categories.forEach(value => url.searchParams.append('category', value));
    state.labels.forEach(value => url.searchParams.append('label', value));
    if (state.days) url.searchParams.set('days', state.days);
    if (state.year) url.searchParams.set('year', state.year);
    if (state.sort !== 'added') url.searchParams.set('sort', state.sort);
    state.abstracts.forEach(value => url.searchParams.append('abstract', value));
    history.replaceState(null, '', url);
  }

  function element(tag, className, value) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (value !== undefined) node.textContent = value;
    return node;
  }

  function dateText(value) {
    if (!value) return t.unknownDate;
    // A date without a day or month is displayed at its actual precision.
    if (/^\d{4}$/.test(value)) return value;
    if (/^\d{4}-\d{2}$/.test(value)) {
      const date = new Date(`${value}-01T00:00:00Z`);
      return Number.isNaN(date.valueOf()) ? value : new Intl.DateTimeFormat(locale, { year: 'numeric', month: 'short', timeZone: 'UTC' }).format(date);
    }
    const date = new Date(/^\d{4}-\d{2}-\d{2}$/.test(value) ? `${value}T00:00:00Z` : value);
    return Number.isNaN(date.valueOf()) ? value : dateFormat.format(date);
  }

  function options(container, values, selected, onChange, isCategory) {
    const fragment = document.createDocumentFragment();
    const all = [...new Set([...values.keys(), ...selected])].sort((a, b) => a.localeCompare(b));
    for (const value of all) {
      const label = element('label', 'filter-option');
      const input = document.createElement('input');
      input.type = 'checkbox'; input.checked = selected.includes(value); input.value = value;
      if (isCategory) label.title = categoryNames[value] || value;
      label.append(input, element('span', '', value), element('span', '', String(values.get(value) || 0)));
      input.addEventListener('change', () => {
        onChange([...container.querySelectorAll('input:checked')].map(node => node.value));
        writeState(); render();
      });
      fragment.append(label);
    }
    container.replaceChildren(fragment);
  }

  function populateFilters() {
    const counts = field => {
      const result = new Map();
      papers.forEach(paper => paper[field].forEach(value => result.set(value, (result.get(value) || 0) + 1)));
      return result;
    };
    options($('category-options'), counts('categories'), state.categories, values => { state.categories = values; }, true);
    const labels = counts('labels');
    $('label-hint').textContent = labels.size || state.labels.length ? t.labelHint : t.noLabels;
    options($('label-options'), labels, state.labels, values => { state.labels = values; }, false);
    const years = [...new Set([...papers.map(paperYear), state.year])].filter(Boolean).sort().reverse();
    year.replaceChildren(new Option(t.allYears, ''), ...years.map(value => new Option(value, value)));
    year.value = state.year;
  }

  function link(label, href, className = '') {
    const node = element('a', className, label);
    node.href = href;
    return node;
  }

  function renderPaper(paper) {
    const article = element('article', 'reading-paper');
    const paperId = paper.arxiv || paper.key;
    article.id = `paper-${paperId}`;
    article.tabIndex = -1;
    const title = element('h2');
    title.lang = 'en';
    title.append(paper.url ? link(paper.title, paper.url) : document.createTextNode(paper.title));
    article.append(title);
    if (paper.authors.length) article.append(element('p', 'reading-authors', paper.authors.join(', ')));
    const dates = element('p', 'reading-dates');
    for (const [label, value] of [[t.paperDate, paper.date], [t.dateAdded, paper.added]]) {
      if (!value) continue;
      const group = element('span');
      const time = element('time', '', dateText(value));
      time.dateTime = value;
      group.append(`${label}: `, time);
      dates.append(group);
    }
    article.append(dates);
    const abstract = element('p', 'reading-abstract', paper.abstract || t.noAbstract);
    abstract.id = `${article.id}-abstract`;
    if (paper.abstract) abstract.lang = 'en';
    abstract.hidden = !state.abstracts.includes(paperId);
    const footer = element('div', 'reading-paper-footer');
    const badges = element('div', 'reading-badges');
    paper.categories.forEach(value => {
      const badge = element('span', 'reading-category', value);
      badge.title = categoryNames[value] || value;
      badges.append(badge);
    });
    paper.labels.forEach(value => badges.append(element('span', 'reading-tag', value)));
    const links = element('div', 'reading-paper-links');
    const abstractToggle = element('button', 'abstract-toggle');
    abstractToggle.type = 'button';
    abstractToggle.setAttribute('aria-controls', abstract.id);
    const syncAbstractToggle = () => {
      abstractToggle.textContent = abstract.hidden ? t.showAbstract : t.hideAbstract;
      abstractToggle.setAttribute('aria-expanded', String(!abstract.hidden));
    };
    syncAbstractToggle();
    abstractToggle.addEventListener('click', () => {
      abstract.hidden = !abstract.hidden;
      state.abstracts = state.abstracts.filter(id => id !== paperId);
      if (!abstract.hidden) { state.abstracts.push(paperId); renderMath(abstract); }
      syncAbstractToggle(); writeState();
    });
    links.append(abstractToggle);
    if (paper.arxiv) {
      links.append(link(`arXiv:${paper.arxiv}`, paper.url));
      const pdf = link(t.pdf, `https://arxiv.org/pdf/${paper.arxiv}`);
      pdf.target = '_blank'; pdf.rel = 'noopener';
      links.append(pdf);
    } else if (paper.doi) links.append(link('DOI', `https://doi.org/${encodeURIComponent(paper.doi)}`));
    const permalink = link(t.paperLink, `#${article.id}`);
    permalink.setAttribute('aria-label', format(t.linkTo, { title: paper.title }));
    links.append(permalink);
    footer.append(badges, links); article.append(footer, abstract);
    // Zotero text is inserted as text, never as executable HTML. KaTeX is local.
    renderMath(title);
    if (!abstract.hidden) renderMath(abstract);
    return article;
  }

  function renderMath(node) {
    if (window.renderMathInElement) {
      const mathOptions = {
        delimiters: [{ left: '$$', right: '$$', display: true }, { left: '$', right: '$', display: false }, { left: '\\(', right: '\\)', display: false }, { left: '\\[', right: '\\]', display: true }],
        throwOnError: false, trust: false, strict: 'ignore', maxExpand: 1000, maxSize: 10
      };
      window.renderMathInElement(node, mathOptions);
    }
  }

  function render() {
    if (!loaded) return;
    const visible = selectPapers(papers, state);
    $('paper-count').textContent = visible.length === papers.length
      ? (papers.length === 1 ? t.onePaper : format(t.papers, { total: papers.length }))
      : format(t.count, { shown: visible.length, total: papers.length });
    list.replaceChildren(...visible.map(renderPaper));
    const empty = $('reading-empty');
    empty.hidden = visible.length > 0;
    empty.querySelector('h2').textContent = papers.length ? t.noMatch : t.empty;
    empty.querySelector('p').textContent = papers.length ? t.noMatchHint : '';
    $('empty-clear').hidden = papers.length === 0;
    $('clear-filters').disabled = !state.q && !state.categories.length && !state.labels.length && !state.year && !state.days;
  }

  function reset() {
    Object.assign(state, { q: '', categories: [], labels: [], days: '', year: '' });
    search.value = ''; days.value = ''; year.value = '';
    populateFilters(); writeState(); render(); search.focus({ preventScroll: true });
  }

  function jumpToEntry() {
    if (!location.hash.startsWith('#paper-')) return;
    let target;
    try { target = document.getElementById(decodeURIComponent(location.hash.slice(1))); } catch { return; }
    if (target) requestAnimationFrame(() => {
      target.scrollIntoView({ block: 'start' });
      target.focus({ preventScroll: true });
    });
  }

  function readCache() {
    try {
      const value = JSON.parse(localStorage.getItem(cacheKey));
      if (value?.schema === 1 && Array.isArray(value.papers) && value.papers.every(paper => typeof paper.title === 'string' && typeof paper.abstract === 'string' && typeof paper.date === 'string' && typeof paper.added === 'string' && Array.isArray(paper.authors) && Array.isArray(paper.labels) && Array.isArray(paper.categories))) return value;
    } catch { /* Private browsing or a corrupt cache must not prevent loading. */ }
    return null;
  }

  async function update() {
    if (loading || Date.now() < refreshAfter) return;
    loading = true; refresh.disabled = true;
    list.setAttribute('aria-busy', 'true');
    $('sync-status').parentElement.classList.remove('is-error');
    $('sync-status').textContent = loaded ? t.refreshing : t.loading;
    try {
      const result = await loadLibrary(config.groupId, { cached: cache });
      papers = result.papers;
      loaded = true;
      cache = { schema: 1, papers, version: result.version, checked: new Date().toISOString() };
      try { localStorage.setItem(cacheKey, JSON.stringify(cache)); } catch { /* Storage is optional. */ }
      refreshAfter = Date.now() + Math.max(2, result.backoff) * 1000;
      populateFilters(); render();
      $('sync-status').textContent = format(t.updated, { time: new Intl.DateTimeFormat(locale, { hour: 'numeric', minute: '2-digit' }).format(new Date()) });
    } catch (error) {
      refreshAfter = Date.now() + Math.max(5, error.retryAfter || 0) * 1000;
      $('sync-status').textContent = loaded ? t.stale : error.retryAfter ? t.busy : t.error;
      $('sync-status').parentElement.classList.add('is-error');
      if (!loaded) {
        $('paper-count').textContent = '—';
        $('reading-empty').hidden = false;
        $('reading-empty').querySelector('h2').textContent = t.error;
        $('reading-empty').querySelector('p').replaceChildren(link(t.library, config.libraryUrl));
        $('empty-clear').hidden = true;
      }
    } finally {
      loading = false; list.setAttribute('aria-busy', 'false');
      // A successful Backoff or failed Retry-After applies to the refresh button too.
      setTimeout(() => { refresh.disabled = false; }, Math.max(0, refreshAfter - Date.now()));
    }
  }

  readState();
  const header = document.querySelector('.site-header');
  const measureHeader = () => document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
  measureHeader(); new ResizeObserver(measureHeader).observe(header);
  const mobile = matchMedia('(max-width: 760px)');
  const filterPanel = document.querySelector('.reading-filters');
  filterPanel.open = !mobile.matches;
  mobile.addEventListener('change', () => { filterPanel.open = !mobile.matches; });
  search.addEventListener('input', () => {
    clearTimeout(searchTimer);
    searchTimer = setTimeout(() => { state.q = search.value.trim(); writeState(); render(); }, 150);
  });
  for (const [control, field] of [[sort, 'sort'], [days, 'days'], [year, 'year']]) control.addEventListener('change', () => {
    state[field] = control.value; writeState(); render();
  });
  $('clear-filters').addEventListener('click', reset); $('empty-clear').addEventListener('click', reset);
  refresh.addEventListener('click', update);
  window.addEventListener('hashchange', jumpToEntry);
  window.addEventListener('popstate', () => { readState(); populateFilters(); render(); jumpToEntry(); });
  cache = readCache();
  if (cache) {
    papers = cache.papers; loaded = true; populateFilters(); render();
    $('sync-status').textContent = t.cached;
  }
  update().then(jumpToEntry);
})();
