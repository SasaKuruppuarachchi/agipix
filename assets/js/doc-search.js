/* Agipix — documentation search: Ctrl/Cmd+K command palette over /search-docs.json
   (generated at build time), plus ?q= highlighting on the target page. */
(function () {
  'use strict';

  var dlg = document.getElementById('cmdk');
  if (!dlg) return;
  var input = document.getElementById('cmdk-input');
  var list = document.getElementById('cmdk-list');
  var indexUrl = dlg.getAttribute('data-index-url');
  var indexPromise = null;
  var pages = [];
  var results = [];
  var sel = 0;
  var lastFocus = null;
  var agipix = window.agipix || {};

  /* ---------- Index ---------- */
  var decoder = document.createElement('textarea');
  function decode(s) { decoder.innerHTML = s || ''; return decoder.value; }

  function load() {
    if (!indexPromise) {
      indexPromise = fetch(indexUrl, { credentials: 'same-origin' })
        .then(function (r) { if (!r.ok) throw new Error(r.status); return r.json(); })
        .then(function (data) {
          pages = data.map(function (p) {
            var page = { title: decode(p.title), url: p.url, section: p.section, text: decode(p.text) };
            page.sections = (p.h || []).map(function (h) { return { id: h[0], title: decode(h[1]), text: decode(h[2]) }; });
            page.hay = (page.title + ' ' + page.text).toLowerCase();
            page.sections.forEach(function (s) { s.hay = (s.title + ' ' + s.text).toLowerCase(); s.titleL = s.title.toLowerCase(); });
            page.titleL = page.title.toLowerCase();
            return page;
          });
          return pages;
        })
        .catch(function () { pages = []; return pages; });
    }
    return indexPromise;
  }

  /* ---------- Search ---------- */
  function tokenize(q) { return q.toLowerCase().split(/\s+/).filter(function (t) { return t.length > 0; }); }

  function search(q) {
    var tokens = tokenize(q);
    if (!tokens.length) return pages.map(function (p) { return { page: p, sec: null, score: 0 }; });
    var out = [];
    pages.forEach(function (p) {
      var pageAll = tokens.every(function (t) { return p.hay.indexOf(t) !== -1 || p.sections.some(function (s) { return s.hay.indexOf(t) !== -1; }); });
      if (!pageAll) return;
      var ps = 0;
      tokens.forEach(function (t) {
        if (p.titleL.indexOf(t) !== -1) ps += 12;
        if (p.titleL.indexOf(t) === 0) ps += 4;
        if (p.text.toLowerCase().indexOf(t) !== -1) ps += 1;
      });
      var secHits = [];
      p.sections.forEach(function (s) {
        if (!tokens.every(function (t) { return s.hay.indexOf(t) !== -1; })) return;
        var ss = 2;
        tokens.forEach(function (t) { if (s.titleL.indexOf(t) !== -1) ss += 9; ss += Math.min(3, s.hay.split(t).length - 1) * 0.5; });
        secHits.push({ page: p, sec: s, score: ss });
      });
      secHits.sort(function (a, b) { return b.score - a.score; });
      if (ps > 1 || !secHits.length) out.push({ page: p, sec: null, score: ps + (secHits[0] ? secHits[0].score * 0.3 : 0) });
      secHits.slice(0, 3).forEach(function (h) { out.push(h); });
    });
    out.sort(function (a, b) { return b.score - a.score; });
    return out.slice(0, 14);
  }

  /* ---------- Rendering ---------- */
  function esc(s) { return s.replace(/[&<>"']/g, function (c) { return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]; }); }
  function mark(text, tokens) {
    var html = esc(text);
    if (!tokens.length) return html;
    var re = new RegExp('(' + tokens.map(function (t) { return esc(t).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    return html.replace(re, '<mark>$1</mark>');
  }
  function snippet(text, tokens) {
    var t = (text || '').replace(/\s+/g, ' ').trim();
    if (!t) return '';
    var lower = t.toLowerCase();
    var at = -1;
    tokens.some(function (k) { at = lower.indexOf(k); return at !== -1; });
    var start = Math.max(0, at - 50);
    var s = t.slice(start, start + 170);
    return (start > 0 ? '… ' : '') + s + (start + 170 < t.length ? ' …' : '');
  }
  function hrefFor(r, q) {
    var u = r.page.url + (q ? '?q=' + encodeURIComponent(q) : '');
    return r.sec ? u + '#' + encodeURIComponent(r.sec.id) : u;
  }

  function render() {
    var q = input.value.trim();
    var tokens = tokenize(q);
    results = search(q);
    sel = 0;
    list.replaceChildren();
    if (!pages.length) {
      list.innerHTML = '<li class="cmdk__empty">Loading the index…</li>';
      return;
    }
    if (!results.length) {
      var li = document.createElement('li');
      li.className = 'cmdk__empty';
      li.textContent = 'No results for “' + q + '”. Try a part name, a command or a topic.';
      list.appendChild(li);
      return;
    }
    var lastGroup = null;
    results.forEach(function (r, i) {
      var group = q ? (i === 0 ? 'Best matches' : null) : r.page.section;
      if (group && group !== lastGroup) {
        var g = document.createElement('li');
        g.className = 'cmdk__group';
        g.setAttribute('role', 'presentation');
        g.textContent = group;
        list.appendChild(g);
        lastGroup = group;
      }
      var li = document.createElement('li');
      li.className = 'cmdk__item';
      li.id = 'cmdk-opt-' + i;
      li.setAttribute('role', 'option');
      li.setAttribute('aria-selected', String(i === 0));
      var title = r.sec ? r.sec.title : r.page.title;
      var path = r.page.section + ' › ' + r.page.title + (r.sec ? '' : '');
      var snip = q ? snippet(r.sec ? r.sec.text : r.page.text, tokens) : '';
      li.innerHTML = '<a href="' + esc(hrefFor(r, q)) + '" tabindex="-1">' +
        '<span class="cmdk__title">' + (r.sec ? '<span aria-hidden="true">#&nbsp;</span>' : '') + mark(title, tokens) + '</span>' +
        '<span class="cmdk__path">' + esc(path) + '</span>' +
        (snip ? '<span class="cmdk__snip">' + mark(snip, tokens) + '</span>' : '') + '</a>';
      li.addEventListener('mousemove', function () { if (sel !== i) select(i, false); });
      list.appendChild(li);
    });
    input.setAttribute('aria-activedescendant', 'cmdk-opt-0');
  }

  function select(i, scroll) {
    var items = list.querySelectorAll('.cmdk__item');
    if (!items.length) return;
    sel = (i + items.length) % items.length;
    items.forEach(function (el, k) { el.setAttribute('aria-selected', String(k === sel)); });
    input.setAttribute('aria-activedescendant', items[sel].id);
    if (scroll !== false) items[sel].scrollIntoView({ block: 'nearest' });
  }

  function go(i) {
    var item = list.querySelectorAll('.cmdk__item')[i];
    var a = item && item.querySelector('a');
    if (!a) return;
    var url = new URL(a.href, location.href);
    if (url.pathname === location.pathname) {
      close();
      history.replaceState(null, '', url.pathname + url.search + url.hash);
      highlight(url.searchParams.get('q'), url.hash);
    } else {
      location.href = a.href;
    }
  }

  /* ---------- Open / close ---------- */
  function open() {
    if (dlg.open) return;
    lastFocus = document.activeElement;
    if (dlg.showModal) dlg.showModal(); else dlg.setAttribute('open', '');
    document.body.classList.add('cmdk-open');
    input.select();
    load().then(render);
    if (!pages.length) render();
  }
  function close() {
    if (!dlg.open) return;
    if (dlg.close) dlg.close(); else dlg.removeAttribute('open');
    document.body.classList.remove('cmdk-open');
    if (lastFocus && lastFocus.focus) lastFocus.focus({ preventScroll: true });
  }
  window.agipix = agipix;
  agipix.openSearch = open;

  document.addEventListener('keydown', function (e) {
    var k = e.key && e.key.toLowerCase();
    var typing = /^(input|textarea|select)$/i.test((e.target.tagName || '')) || e.target.isContentEditable;
    if ((e.metaKey || e.ctrlKey) && k === 'k') { e.preventDefault(); dlg.open ? close() : open(); return; }
    if (k === '/' && !typing && !e.metaKey && !e.ctrlKey && !e.altKey && !dlg.open) { e.preventDefault(); open(); }
  });
  document.addEventListener('click', function (e) {
    if (e.target.closest && e.target.closest('[data-cmdk-open]')) { e.preventDefault(); open(); }
  });
  ['pointerenter', 'focusin'].forEach(function (ev) {
    document.addEventListener(ev, function (e) { if (e.target.closest && e.target.closest('[data-cmdk-open]')) load(); }, true);
  });
  dlg.addEventListener('click', function (e) { if (e.target === dlg) close(); });
  dlg.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
  list.addEventListener('click', function (e) {
    var item = e.target.closest('.cmdk__item');
    if (!item || e.metaKey || e.ctrlKey || e.shiftKey) return;
    e.preventDefault();
    go(Array.prototype.indexOf.call(list.querySelectorAll('.cmdk__item'), item));
  });
  var timer = null;
  input.addEventListener('input', function () { clearTimeout(timer); timer = setTimeout(render, 60); });
  input.addEventListener('keydown', function (e) {
    if (e.key === 'ArrowDown') { e.preventDefault(); select(sel + 1); }
    else if (e.key === 'ArrowUp') { e.preventDefault(); select(sel - 1); }
    else if (e.key === 'Enter') { e.preventDefault(); go(sel); }
    else if (e.key === 'Home' && e.ctrlKey) { e.preventDefault(); select(0); }
    else if (e.key === 'End' && e.ctrlKey) { e.preventDefault(); select(-1); }
  });

  /* ---------- Highlight ?q= matches on the page we landed on ---------- */
  function highlight(q, hash) {
    var bodyEl = document.getElementById('doc-body');
    if (!q || !bodyEl) return;
    document.querySelectorAll('mark.search-hit').forEach(function (m) { m.replaceWith(document.createTextNode(m.textContent)); });
    var tokens = tokenize(q).filter(function (t) { return t.length > 1; });
    if (!tokens.length) return;
    var re = new RegExp('(' + tokens.map(function (t) { return t.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); }).join('|') + ')', 'gi');
    var scope = bodyEl;
    if (hash) {
      var target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (target) scope = bodyEl;
    }
    var walker = document.createTreeWalker(scope, NodeFilter.SHOW_TEXT, {
      acceptNode: function (n) {
        if (!n.nodeValue.trim() || n.parentElement.closest('script, style, .code__bar, .anchor, mark')) return NodeFilter.FILTER_REJECT;
        re.lastIndex = 0;
        return re.test(n.nodeValue) ? NodeFilter.FILTER_ACCEPT : NodeFilter.FILTER_REJECT;
      }
    });
    var nodes = [];
    while (walker.nextNode() && nodes.length < 80) nodes.push(walker.currentNode);
    var first = null;
    nodes.forEach(function (n) {
      var frag = document.createDocumentFragment();
      n.nodeValue.split(re).forEach(function (part, i) {
        if (i % 2) { var m = document.createElement('mark'); m.className = 'search-hit'; m.textContent = part; frag.appendChild(m); first = first || m; }
        else if (part) frag.appendChild(document.createTextNode(part));
      });
      n.parentNode.replaceChild(frag, n);
    });
    var dest = hash && document.getElementById(decodeURIComponent(hash.slice(1)));
    if (dest) dest.scrollIntoView({ block: 'start' });
    else if (first) {
      var det = first.closest('details');
      if (det) det.open = true;
      first.scrollIntoView({ block: 'center' });
    }
    setTimeout(function () { document.querySelectorAll('mark.search-hit').forEach(function (m) { m.classList.add('is-fading'); }); }, 6000);
  }

  var params = new URLSearchParams(location.search);
  if (params.get('q')) {
    var q = params.get('q');
    var run = function () {
      highlight(q, location.hash);
      // keep the address clean (the hash stays)
      history.replaceState(null, '', location.pathname + location.hash);
    };
    if (document.readyState === 'complete') run(); else window.addEventListener('load', run, { once: true });
  }
})();
