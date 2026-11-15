(() => {
  const details = [...document.querySelectorAll('.paper-details')];
  const sections = [...document.querySelectorAll('main > section[id], .guide-section[id]')];
  const anchors = [...document.querySelectorAll('main > section[id], .publication[id], .news-entry[id], .guide-section[id]')];
  const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)');
  let highlightTimer;
  // Keep anchor offsets accurate when readable navigation wraps on small screens.
  const header = document.querySelector('.site-header');
  const syncHeaderOffset = () => document.documentElement.style.setProperty('--header-offset', `${header.offsetHeight}px`);
  syncHeaderOffset();
  new ResizeObserver(syncHeaderOffset).observe(header);

  const reader = document.querySelector('.perspective-reader');
  const cards = [...document.querySelectorAll('.perspective-card')];
  let activePerspective = null;
  let readerReturnFocus = null;
  const canReadInDialog = reader && typeof reader.showModal === 'function';

  function hidePerspective() {
    if (!reader?.open) return;
    reader.close();
    document.documentElement.classList.remove('reader-is-open');
    activePerspective = null;
    const returnFocus = readerReturnFocus;
    requestAnimationFrame(() => returnFocus?.focus({ preventScroll: true }));
  }

  function showPerspective(card) {
    if (!canReadInDialog) return;
    if (!reader.open) {
      readerReturnFocus = card.contains(document.activeElement)
        ? document.activeElement : card.querySelector('.perspective-open');
      card.scrollIntoView({ block: 'nearest', behavior: 'instant' });
    }
    activePerspective = card.id;
    reader.querySelector('h2').textContent = card.querySelector('h3').textContent;
    reader.querySelector('.reader-art').replaceChildren(card.querySelector('svg').cloneNode(true));
    reader.querySelector('.reader-body').replaceChildren(card.querySelector('.perspective-full').cloneNode(true));
    reader.querySelector('.reader-status').textContent = '';
    const otherLanguage = reader.querySelector('.reader-language');
    const target = new URL(otherLanguage.href);
    target.hash = card.id;
    const openIds = details.filter(d => d.open).map(d => d.closest('.publication').id);
    target.search = '';
    if (openIds.length) target.searchParams.set('open', openIds.join(','));
    otherLanguage.href = target.href;
    document.documentElement.classList.add('reader-is-open');
    if (!reader.open) {
      reader.showModal();
      // Deep-link fragment focus can run after the initial dialog focus.
      requestAnimationFrame(() => reader.querySelector('.reader-close').focus({ preventScroll: true }));
    }
    reader.scrollTop = 0;
  }

  function dismissPerspective() {
    if (history.state?.perspective) history.back();
    else {
      history.replaceState(null, '', '#perspectives');
      navigateToHash();
    }
  }

  if (canReadInDialog) {
    document.documentElement.classList.add('perspectives-enhanced');
    cards.forEach(card => card.querySelectorAll('.perspective-open').forEach(link => {
      link.setAttribute('aria-haspopup', 'dialog');
      link.setAttribute('aria-controls', reader.id);
    }));
    reader.querySelector('.reader-close').addEventListener('click', dismissPerspective);
    reader.addEventListener('cancel', event => {
      event.preventDefault();
      dismissPerspective();
    });
    reader.addEventListener('keydown', event => {
      if (event.key !== 'Tab') return;
      const controls = [...reader.querySelectorAll('button, a[href]')];
      const first = controls[0];
      const last = controls.at(-1);
      if (event.shiftKey && (document.activeElement === first || document.activeElement === reader)) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    });
    // Only a complete click outside the panel dismisses it (not a drag from text).
    let beganOnBackdrop = false;
    const outside = event => {
      const r = reader.getBoundingClientRect();
      return event.clientX < r.left || event.clientX > r.right || event.clientY < r.top || event.clientY > r.bottom;
    };
    reader.addEventListener('pointerdown', event => { beganOnBackdrop = outside(event); });
    reader.addEventListener('click', event => {
      if (beganOnBackdrop && outside(event)) dismissPerspective();
      beganOnBackdrop = false;
    });
    reader.querySelector('.reader-copy').addEventListener('click', async event => {
      const button = event.currentTarget;
      const status = reader.querySelector('.reader-status');
      try {
        await navigator.clipboard.writeText(location.href);
        status.textContent = button.dataset.copied;
      } catch {
        status.textContent = button.dataset.failed;
      }
    });
  }

  function syncExpanded(detail) {
    detail.querySelector('summary').setAttribute('aria-expanded', String(detail.open));
  }
  details.forEach(detail => {
    syncExpanded(detail);
    detail.addEventListener('toggle', () => syncExpanded(detail));
  });

  function openPaper(target) {
    if (!target?.classList.contains('publication')) return;
    const detail = target?.querySelector('.paper-details');
    if (detail) {
      detail.open = true;
      syncExpanded(detail);
    }
  }

  function navigateToHash({ smooth = false, focus = false } = {}) {
    let id;
    try { id = decodeURIComponent(window.location.hash.slice(1)); } catch { return; }
    const target = document.getElementById(id);
    if (target?.classList.contains('perspective-card') && canReadInDialog) {
      showPerspective(target);
      return;
    }
    hidePerspective();
    if (!target) return;
    openPaper(target);
    if (target.classList.contains('news-entry')) {
      document.querySelectorAll('.is-highlighted').forEach(item => item.classList.remove('is-highlighted'));
      target.classList.add('is-highlighted');
      clearTimeout(highlightTimer);
      highlightTimer = setTimeout(() => target.classList.remove('is-highlighted'), 2400);
    }
    requestAnimationFrame(() => {
      target.scrollIntoView({ behavior: smooth && !reducedMotion.matches ? 'smooth' : 'instant', block: 'start' });
      if (focus) {
        if (!target.hasAttribute('tabindex')) target.setAttribute('tabindex', '-1');
        target.focus({ preventScroll: true });
      }
    });
  }

  // The URL carries open panels across languages, so several explanations can stay open.
  const requestedOpen = new URLSearchParams(location.search).get('open')?.split(',') || [];
  requestedOpen.forEach(id => openPaper(document.getElementById(id)));

  document.addEventListener('click', event => {
    if (event.defaultPrevented || event.button !== 0 || event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return;
    const link = event.target.closest('a[href^="#"]');
    if (!link) return;
    const hash = link.getAttribute('href');
    if (hash.length < 2 || !document.getElementById(hash.slice(1))) return;
    event.preventDefault();
    if (location.hash !== hash) {
      const isPerspective = document.getElementById(hash.slice(1)).classList.contains('perspective-card');
      history.pushState(isPerspective ? { perspective: true } : null, '', hash);
    }
    navigateToHash({ smooth: true, focus: true });
  });

  function currentAnchor() {
    if (activePerspective) return activePerspective;
    // Keep the selected guide chapter when switching translations.
    if (document.querySelector('.guide-page')) {
      const selected = document.getElementById(location.hash.slice(1));
      if (selected?.classList.contains('guide-section')) return selected.id;
    }
    const threshold = document.querySelector('.site-header').getBoundingClientRect().height + 100;
    return anchors.filter(el => el.getBoundingClientRect().top <= threshold).at(-1)?.id || (document.querySelector('.guide-page') ? '' : 'about');
  }

  document.querySelectorAll('.language-link:not(.is-current)').forEach(link => {
    // Refresh href for native clicks, keyboard activation, and opening in a new tab.
    const updateLink = () => {
      const target = new URL(link.getAttribute('href'), location.href);
      const openIds = details.filter(d => d.open).map(d => d.closest('.publication').id);
      target.search = '';
      if (openIds.length) target.searchParams.set('open', openIds.join(','));
      target.hash = currentAnchor();
      link.href = target.href;
    };
    link.addEventListener('pointerdown', updateLink);
    link.addEventListener('focus', updateLink);
    link.addEventListener('click', updateLink);
  });

  function updateNavigation() {
    const top = document.querySelector('.site-header').getBoundingClientRect().height + 110;
    const active = sections.filter(section => section.getBoundingClientRect().top <= top).at(-1) || sections[0];
    document.querySelectorAll('.main-nav a').forEach(link => {
      if (link.hash === `#${active.id}`) link.setAttribute('aria-current', 'location');
      else link.removeAttribute('aria-current');
    });
  }
  let scheduled = false;
  window.addEventListener('scroll', () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => { updateNavigation(); scheduled = false; });
  }, { passive: true });
  window.addEventListener('hashchange', () => navigateToHash());
  window.addEventListener('popstate', () => navigateToHash());
  navigateToHash();
  updateNavigation();
})();
