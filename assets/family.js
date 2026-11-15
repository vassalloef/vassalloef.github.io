(() => {
  'use strict';
  const viewport = document.querySelector('.tree-viewport');
  if (!viewport) return;
  const stage = document.querySelector('.tree-stage');
  const world = document.querySelector('.tree-world');
  const svg = document.querySelector('.tree-connectors');
  const count = document.querySelector('.tree-count');
  const zoomLevel = document.querySelector('.zoom-level');
  const branchButtons = [...document.querySelectorAll('[data-branch]')];
  const zoomOut = document.querySelector('[data-zoom="out"]');
  const zoomIn = document.querySelector('[data-zoom="in"]');
  const svgNS = 'http://www.w3.org/2000/svg';
  const cardWidth = 224;
  const gap = 24;
  const padding = 38;
  const maxGeneration = 7;
  let branch = 'all';
  let scale = 1;
  let width = 0;
  let height = 0;
  let offsetX = 0;
  let offsetY = 0;
  let activeNodes = [];
  let automaticView = true;

  function readTree(element) {
    const node = {element, card: element.querySelector(':scope > .person'), depth: Number(element.dataset.generation), side: element.dataset.side};
    node.parents = [...(element.querySelector(':scope > ol')?.children || [])].map(readTree);
    return node;
  }
  const root = readTree(document.querySelector('.ancestor-list > li'));

  // The names stay in semantic HTML; JavaScript only positions their cards.
  function measure(node) {
    activeNodes.push(node);
    node.visibleParents = node.parents.filter(parent => parent.depth <= maxGeneration && (branch === 'all' || parent.side === branch));
    const parentWidths = node.visibleParents.map(measure);
    const gutter = node.depth === 0 ? 56 : gap;
    node.width = Math.max(cardWidth, parentWidths.reduce((sum, size) => sum + size, 0) + Math.max(0, parentWidths.length - 1) * gutter);
    return node.width;
  }

  function position(node, left, rows) {
    node.x = left + node.width / 2;
    node.y = rows[node.depth];
    node.card.style.transform = `translate(${node.x - cardWidth / 2}px, ${node.y}px)`;
    let parentLeft = left;
    node.visibleParents.forEach(parent => {
      position(parent, parentLeft, rows);
      parentLeft += parent.width + (node.depth === 0 ? 56 : gap);
    });
  }

  function connector(child, parent) {
    const startX = parent.x;
    const startY = parent.y + parent.card.offsetHeight;
    const endX = child.x;
    const endY = child.y;
    const middleY = startY + (endY - startY) / 2;
    const radius = Math.min(16, Math.abs(endX - startX) / 2);
    const direction = Math.sign(endX - startX);
    const path = document.createElementNS(svgNS, 'path');
    // Rounded elbows stay legible when only one parent is known.
    path.setAttribute('d', radius === 0 ? `M${startX} ${startY}V${endY}` : `M${startX} ${startY}V${middleY - radius}Q${startX} ${middleY} ${startX + radius * direction} ${middleY}H${endX - radius * direction}Q${endX} ${middleY} ${endX} ${middleY + radius}V${endY}`);
    path.setAttribute('class', `edge-${parent.side}`);
    svg.append(path);
  }

  function layout() {
    activeNodes = [];
    width = measure(root) + padding * 2;
    document.querySelectorAll('.ancestor-branch').forEach(el => { el.hidden = !activeNodes.some(node => node.element === el); });
    const depth = Math.max(...activeNodes.map(node => node.depth));
    const rows = [];
    let top = padding;
    for (let generation = depth; generation >= 0; generation -= 1) {
      rows[generation] = top;
      top += Math.max(...activeNodes.filter(node => node.depth === generation).map(node => node.card.offsetHeight)) + 58;
    }
    height = top - 58 + padding;
    world.style.width = `${width}px`;
    world.style.height = `${height}px`;
    position(root, padding, rows);
    svg.replaceChildren();
    activeNodes.forEach(node => {
      node.visibleParents.forEach(parent => connector(node, parent));
      if (node.visibleParents.length) {
        const dot = document.createElementNS(svgNS, 'circle');
        dot.setAttribute('cx', node.x);
        dot.setAttribute('cy', node.y);
        dot.setAttribute('r', 4);
        svg.append(dot);
      }
    });
    // Count people, not ancestor positions, if two branches eventually overlap.
    const ancestors = new Set(activeNodes.map(node => node.element.dataset.person)).size - 1;
    count.textContent = `${ancestors} ${count.dataset.ancestorLabel} · ${depth + 1} ${count.dataset.generationLabel}`;
  }

  function applyScale(next, recenter = false) {
    const centerX = (viewport.scrollLeft + viewport.clientWidth / 2 - offsetX) / scale;
    const centerY = (viewport.scrollTop + viewport.clientHeight / 2 - offsetY) / scale;
    scale = Math.max(0.01, Math.min(1.6, next));
    const stageWidth = Math.max(viewport.clientWidth, width * scale);
    const stageHeight = Math.max(viewport.clientHeight, height * scale);
    offsetX = (stageWidth - width * scale) / 2;
    offsetY = (stageHeight - height * scale) / 2;
    stage.style.width = `${stageWidth}px`;
    stage.style.height = `${stageHeight}px`;
    world.style.transform = `translate(${offsetX}px, ${offsetY}px) scale(${scale})`;
    viewport.scrollLeft = recenter ? (stageWidth - viewport.clientWidth) / 2 : centerX * scale + offsetX - viewport.clientWidth / 2;
    viewport.scrollTop = recenter ? stageHeight - viewport.clientHeight : centerY * scale + offsetY - viewport.clientHeight / 2;
    zoomLevel.value = `${Math.round(scale * 100)}%`;
    zoomOut.disabled = scale <= 0.011;
    zoomIn.disabled = scale >= 1.599;
  }

  function fit() {
    applyScale(Math.min(1, (viewport.clientWidth - 24) / width, (viewport.clientHeight - 24) / height), true);
  }

  function initialView() {
    const fitted = Math.min(1, (viewport.clientWidth - 24) / width, (viewport.clientHeight - 24) / height);
    // Prefer readable cards on a phone and on larger trees; pan to see the rest.
    applyScale(Math.max(0.9, fitted), true);
  }

  branchButtons.forEach(button => button.addEventListener('click', () => {
    branch = button.dataset.branch;
    branchButtons.forEach(other => other.setAttribute('aria-pressed', String(other === button)));
    automaticView = true;
    layout();
    initialView();
  }));
  zoomOut.addEventListener('click', () => { automaticView = false; applyScale(scale - 0.15); });
  zoomIn.addEventListener('click', () => { automaticView = false; applyScale(scale + 0.15); });
  document.querySelector('.fit-tree').addEventListener('click', () => { automaticView = false; fit(); });

  // Touch uses native scrolling. Mouse dragging supplements scrollbars/trackpads.
  let drag = null;
  viewport.addEventListener('pointerdown', event => {
    if (event.pointerType !== 'mouse' || event.button !== 0 || event.target.closest('button, a')) return;
    viewport.focus({preventScroll: true});
    drag = {x: event.clientX, y: event.clientY, left: viewport.scrollLeft, top: viewport.scrollTop};
    viewport.setPointerCapture(event.pointerId);
    viewport.classList.add('is-dragging');
    event.preventDefault();
  });
  viewport.addEventListener('pointermove', event => {
    if (!drag) return;
    viewport.scrollLeft = drag.left - event.clientX + drag.x;
    viewport.scrollTop = drag.top - event.clientY + drag.y;
  });
  function endDrag() { drag = null; viewport.classList.remove('is-dragging'); }
  viewport.addEventListener('pointerup', endDrag);
  viewport.addEventListener('pointercancel', endDrag);
  viewport.addEventListener('lostpointercapture', endDrag);

  // Known countries use local SVGs, including when JavaScript is disabled.
  document.querySelectorAll('.birth-flag').forEach(flag => {
    const code = flag.dataset.country;
    if (flag.querySelector('img') || !/^[A-Z]{2}$/.test(code)) return;
    const country = new Intl.DisplayNames([document.documentElement.lang], {type: 'region'}).of(code);
    const emoji = document.createElement('span');
    emoji.className = 'country-emoji';
    emoji.textContent = [...code].map(letter => String.fromCodePoint(127397 + letter.charCodeAt(0))).join('');
    emoji.setAttribute('role', 'img');
    emoji.setAttribute('aria-label', country);
    emoji.title = country;
    flag.replaceChildren(emoji);
  });

  // Keep place names readable at every tree zoom level and on touchscreens.
  const placeTooltip = document.querySelector('.birthplace-tooltip');
  let placeFlag = null;
  let placePinned = false;
  let placeTimer;

  function hidePlace() {
    clearTimeout(placeTimer);
    if (placeFlag) placeFlag.setAttribute('aria-expanded', 'false');
    placeTooltip.hidden = true;
    placeFlag = null;
    placePinned = false;
  }

  function positionPlace() {
    if (!placeFlag) return;
    const anchor = placeFlag.getBoundingClientRect();
    const frame = viewport.getBoundingClientRect();
    if (anchor.bottom < frame.top || anchor.top > frame.bottom || anchor.right < frame.left || anchor.left > frame.right) {
      hidePlace();
      return;
    }
    const box = placeTooltip.getBoundingClientRect();
    const left = Math.max(12, Math.min(window.innerWidth - box.width - 12, anchor.right - box.width));
    const below = anchor.bottom + 10;
    const top = below + box.height <= window.innerHeight - 12 ? below : Math.max(12, anchor.top - box.height - 10);
    placeTooltip.style.left = `${left}px`;
    placeTooltip.style.top = `${top}px`;
  }

  function showPlace(flag) {
    clearTimeout(placeTimer);
    if (placeFlag !== flag) { hidePlace(); placeFlag = flag; }
    flag.setAttribute('aria-expanded', 'true');
    placeTooltip.querySelector('strong').textContent = flag.dataset.birthplace;
    placeTooltip.hidden = false;
    positionPlace();
  }

  function schedulePlaceHide() {
    if (!placePinned && document.activeElement !== placeFlag) placeTimer = setTimeout(hidePlace, 150);
  }

  document.querySelectorAll('.birth-flag').forEach(flag => {
    // Retain native title tooltips as a no-JavaScript fallback only.
    flag.removeAttribute('title');
    flag.addEventListener('pointerenter', event => { if (event.pointerType === 'mouse') showPlace(flag); });
    flag.addEventListener('pointerleave', schedulePlaceHide);
    flag.addEventListener('focus', () => showPlace(flag));
    flag.addEventListener('blur', () => { if (placeFlag === flag) hidePlace(); });
    flag.addEventListener('click', () => {
      if (placeFlag === flag && placePinned) { hidePlace(); return; }
      showPlace(flag);
      placePinned = true;
    });
  });
  placeTooltip.addEventListener('pointerenter', () => clearTimeout(placeTimer));
  placeTooltip.addEventListener('pointerleave', schedulePlaceHide);
  document.addEventListener('pointerdown', event => {
    if (placeFlag && !placeFlag.contains(event.target) && !placeTooltip.contains(event.target)) hidePlace();
  });
  document.addEventListener('keydown', event => { if (event.key === 'Escape') hidePlace(); });
  document.addEventListener('scroll', positionPlace, true);
  window.addEventListener('resize', hidePlace);

  document.querySelector('.tree-toolbar').hidden = false;
  document.querySelector('.tree-hint').hidden = false;
  document.body.classList.add('tree-ready');
  layout();
  initialView();
  document.fonts.ready.then(() => { layout(); if (automaticView) initialView(); else applyScale(scale); });
  let resizeFrame;
  new ResizeObserver(() => {
    cancelAnimationFrame(resizeFrame);
    resizeFrame = requestAnimationFrame(() => { if (automaticView) initialView(); else applyScale(scale); });
  }).observe(viewport);
})();
