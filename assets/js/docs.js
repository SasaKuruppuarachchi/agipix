/* Agipix — documentation viewer. Runs on doc pages and the "All docs" page.
   Headings & anchors, TOC + scrollspy, code blocks, tables, callouts, details,
   nav tree state, focus mode, copy-as-Markdown and print/PDF. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var agipix = window.agipix || {};
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var docBody = document.getElementById('doc-body');
  if (!docBody) return;

  var store = {
    get: function (k) { try { return localStorage.getItem(k); } catch (e) { return null; } },
    set: function (k, v) { try { localStorage.setItem(k, v); } catch (e) {} }
  };
  var toast = function (m) { if (agipix.toast) agipix.toast(m); };
  var icon = function (paths) { return '<svg class="icon" viewBox="0 0 24 24" aria-hidden="true">' + paths + '</svg>'; };
  var ICONS = {
    copy: icon('<rect x="9" y="9" width="12" height="12" rx="2"/><path d="M5 15H4a1 1 0 0 1-1-1V4a1 1 0 0 1 1-1h10a1 1 0 0 1 1 1v1"/>'),
    note: icon('<circle cx="12" cy="12" r="9"/><path d="M12 16v-4M12 8h.01"/>'),
    tip: icon('<path d="M9 18h6M10 22h4M12 2a7 7 0 0 0-4 12.7V17h8v-2.3A7 7 0 0 0 12 2Z"/>'),
    important: icon('<path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z"/><path d="M12 7v4M12 14h.01"/>'),
    warning: icon('<path d="M10.3 3.9 1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0Z"/><path d="M12 9v4M12 17h.01"/>'),
    caution: icon('<path d="M7.9 2h8.2L22 7.9v8.2L16.1 22H7.9L2 16.1V7.9z"/><path d="M12 8v4M12 16h.01"/>')
  };

  /* ---------- Headings: ids + "#" anchors that copy a link ---------- */
  var used = {};
  $$('[id]').forEach(function (el) { used[el.id] = true; });
  function slugify(s) {
    var base = s.toLowerCase().trim().replace(/[^\w\s-]/g, '').replace(/\s+/g, '-').replace(/-+/g, '-').slice(0, 64) || 'section';
    var id = base, n = 1;
    while (used[id]) id = base + '-' + (n++);
    used[id] = true;
    return id;
  }
  var headings = $$('h2, h3, h4', docBody).filter(function (h) { return !h.closest('.callout, .manual-cover'); });
  headings.forEach(function (h) {
    if (!h.id) h.id = slugify(h.textContent);
    var a = document.createElement('a');
    a.className = 'anchor';
    a.href = '#' + h.id;
    a.setAttribute('aria-label', 'Copy link to section: ' + h.textContent.trim());
    a.textContent = '#';
    h.insertBefore(a, h.firstChild);
  });
  docBody.addEventListener('click', function (e) {
    var a = e.target.closest('a.anchor');
    if (!a) return;
    e.preventDefault();
    var id = a.getAttribute('href').slice(1);
    var url = location.origin + location.pathname + '#' + id;
    history.replaceState(null, '', '#' + id);
    document.getElementById(id).scrollIntoView({ behavior: reduceMotion ? 'auto' : 'smooth', block: 'start' });
    (agipix.copy ? agipix.copy(url) : Promise.reject()).then(function () { toast('Link to section copied'); }, function () { toast('Link: ' + url); });
  });

  /* ---------- Code blocks: language label, copy, collapse long ones ---------- */
  var LONG = 25;
  var LANG = { sh: 'shell', shell: 'shell', bash: 'bash', console: 'console', zsh: 'zsh', plaintext: 'text', text: 'text', yml: 'yaml', py: 'python', cpp: 'c++', 'c++': 'c++', js: 'javascript' };
  var collapsibles = [];
  $$('pre', docBody).forEach(function (pre) {
    if (pre.closest('.code, .bibtex')) return;
    var host = pre.closest('div.highlighter-rouge, figure.highlight') || pre;
    // drop the trailing newline Rouge/kramdown leave inside <code> (it renders as an empty last line)
    var last = (pre.querySelector('code') || pre).lastChild;
    while (last && last.nodeType === 1 && last.lastChild) last = last.lastChild;
    if (last && last.nodeType === 3) last.nodeValue = last.nodeValue.replace(/\n+$/, '');
    var m = (host.className + ' ' + (pre.querySelector('code') || pre).className).match(/language-([\w+#-]+)/);
    var lang = m ? (LANG[m[1].toLowerCase()] || m[1].toLowerCase()) : 'text';
    var wrap = document.createElement('div');
    wrap.className = 'code';
    var bar = document.createElement('div');
    bar.className = 'code__bar';
    bar.innerHTML = '<span class="code__lang">' + lang + '</span><span class="code__actions"><button class="tool" type="button" data-code-copy aria-label="Copy code">' + ICONS.copy + '<span>Copy</span></button></span>';
    host.parentNode.insertBefore(wrap, host);
    wrap.appendChild(bar);
    wrap.appendChild(host);
    var lines = pre.textContent.replace(/\n$/, '').split('\n').length;
    if (lines > LONG) {
      wrap.classList.add('is-collapsed');
      var more = document.createElement('div');
      more.className = 'code__more';
      more.innerHTML = '<button class="tool" type="button" aria-expanded="false">Show all ' + lines + ' lines</button>';
      wrap.appendChild(more);
      var btn = more.firstChild;
      var setCode = function (open) {
        wrap.classList.toggle('is-collapsed', !open);
        btn.setAttribute('aria-expanded', String(open));
        btn.textContent = open ? 'Collapse' : 'Show all ' + lines + ' lines';
      };
      btn.addEventListener('click', function () {
        var open = wrap.classList.contains('is-collapsed');
        setCode(open);
        if (!open) wrap.scrollIntoView({ block: 'nearest', behavior: reduceMotion ? 'auto' : 'smooth' });
        layoutChanged();
      });
      collapsibles.push({ el: wrap, set: setCode });
    } else {
      wrap.classList.add('is-short');
    }
  });
  docBody.addEventListener('click', function (e) {
    var b = e.target.closest('[data-code-copy]');
    if (!b) return;
    var pre = b.closest('.code').querySelector('pre');
    var text = pre.innerText.replace(/\n$/, '');
    agipix.copy(text).then(function () { agipix.flashDone(b); }, function () { toast('Copy failed'); });
  });

  /* ---------- Tables: tall ones get their own scroll box (header stays visible) ---------- */
  $$('.table-wrap', docBody).forEach(function (w) {
    var t = w.querySelector('table');
    if (t && t.offsetHeight > 640) w.classList.add('is-tall');
  });

  /* ---------- Callouts: > [!NOTE] / [!TIP] / [!IMPORTANT] / [!WARNING] / [!CAUTION] ---------- */
  var KINDS = { note: 'Note', tip: 'Tip', important: 'Important', warning: 'Warning', caution: 'Caution' };
  $$('blockquote', docBody).forEach(function (bq) {
    var p = bq.firstElementChild;
    if (!p || p.tagName !== 'P') return;
    var kind = null;
    var txt = p.textContent.replace(/^\s+/, '');
    var m = txt.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
    if (m) {
      kind = m[1].toLowerCase();
      // drop the marker (and a line break right after it)
      var n = p.firstChild;
      while (n && n.nodeType === 3 && !n.nodeValue.trim()) n = n.nextSibling;
      if (n && n.nodeType === 3) n.nodeValue = n.nodeValue.replace(/^\s*\[![A-Za-z]+\]\s*/, '');
      if (p.firstElementChild && p.firstElementChild.tagName === 'BR' && !p.firstChild.nodeValue) p.firstElementChild.remove();
      if (!p.textContent.trim() && !p.querySelector('img, code')) p.remove();
    } else {
      // "> **Note:** text" or "> Note: text"
      var lead = p.firstElementChild;
      var label = (lead && lead === p.firstChild && /^(STRONG|B)$/.test(lead.tagName) ? lead.textContent : txt.slice(0, 12)).trim();
      var lm = label.match(/^(Note|Tip|Important|Warning|Caution)\s*:?\s*$/i) || (!lead && txt.match(/^(Note|Tip|Important|Warning|Caution):/i));
      if (lm) {
        kind = lm[1].toLowerCase();
        if (lead && lead === p.firstChild) {
          lead.remove();
          if (p.firstChild && p.firstChild.nodeType === 3) p.firstChild.nodeValue = p.firstChild.nodeValue.replace(/^\s*:?\s*/, '');
          if (!p.textContent.trim() && !p.querySelector('img, code, a')) p.remove();
        } else if (p.firstChild && p.firstChild.nodeType === 3) {
          p.firstChild.nodeValue = p.firstChild.nodeValue.replace(/^\s*\w+:\s*/, '');
        }
      }
    }
    if (!kind) return;
    var box = document.createElement('div');
    box.className = 'callout callout--' + kind;
    box.setAttribute('role', 'note');
    var title = document.createElement('p');
    title.className = 'callout__title';
    title.innerHTML = ICONS[kind] + '<span>' + KINDS[kind] + '</span>';
    box.appendChild(title);
    while (bq.firstChild) box.appendChild(bq.firstChild);
    bq.replaceWith(box);
  });

  /* ---------- Images: lightbox for diagrams/photos (not badges or linked images) ---------- */
  $$('img', docBody).forEach(function (img) {
    var src = img.getAttribute('src') || '';
    if (/shields\.io|badge/.test(src) || img.closest('.manual-cover')) return;
    var a = img.closest('a');
    if (a && !/\.(png|jpe?g|gif|webp|avif)(\?|$)/i.test(a.getAttribute('href') || '')) return;
    img.setAttribute('data-zoomable', '');
    img.tabIndex = 0;
    img.setAttribute('role', 'button');
    img.setAttribute('aria-label', 'View larger: ' + (img.alt || 'image'));
  });

  /* ---------- Print helpers: show external URLs, name embedded videos ---------- */
  $$('a[href^="http"]', docBody).forEach(function (a) {
    var href = a.getAttribute('href');
    var text = a.textContent.trim();
    if (!text || a.querySelector('img') || text === href || text.replace(/\/$/, '') === href.replace(/\/$/, '') || href.indexOf(location.host) !== -1) return;
    a.classList.add('ext-url');
  });
  $$('.video-container, .quick-start-video', docBody).forEach(function (v) {
    var f = v.querySelector('iframe');
    var m = f && (f.getAttribute('src') || '').match(/embed\/([\w-]{6,})/);
    if (m) v.setAttribute('data-video-url', 'https://youtu.be/' + m[1]);
  });

  /* ---------- Details: Expand all / Collapse all ---------- */
  var details = $$('details', docBody);
  var expandBtn = $('[data-expand-all]');
  if (expandBtn && (details.length || collapsibles.length)) {
    expandBtn.hidden = false;
    expandBtn.addEventListener('click', function () {
      var open = expandBtn.getAttribute('aria-pressed') !== 'true';
      details.forEach(function (d) { d.open = open; });
      collapsibles.forEach(function (c) { c.set(open); });
      expandBtn.setAttribute('aria-pressed', String(open));
      $('span', expandBtn).textContent = open ? 'Collapse all' : 'Expand all';
      layoutChanged();
    });
  }
  details.forEach(function (d) { d.addEventListener('toggle', layoutChanged); });

  /* ---------- Table of contents + scrollspy (cached offsets, no layout reads while scrolling) ---------- */
  var tocAside = $('.doc-toc');
  var tocList = tocAside && $('.toc__list', tocAside);
  var tocMobile = $('.toc-mobile');
  var tocTargets = $$('h2, h3', docBody).filter(function (h) { return h.id && !h.closest('.callout, details:not([open])'); });
  var tocLinks = [];
  var indicator = null;
  var tops = [];
  var linkBox = [];
  var active = -1;
  var progressBar = $('.read-progress span');
  var docTop = 0, docEnd = 1;

  function label(h) {
    var c = h.cloneNode(true);
    $$('.anchor', c).forEach(function (x) { x.remove(); });
    return c.textContent.trim();
  }
  if (tocTargets.length >= 2) {
    var build = function (ol, withIndicator) {
      var links = tocTargets.map(function (h) {
        var li = document.createElement('li');
        li.className = h.tagName === 'H3' ? 'toc-l3' : 'toc-l2';
        var a = document.createElement('a');
        a.href = '#' + h.id;
        a.textContent = label(h);
        li.appendChild(a);
        ol.appendChild(li);
        return a;
      });
      if (withIndicator) {
        indicator = document.createElement('span');
        indicator.className = 'toc__indicator';
        indicator.setAttribute('aria-hidden', 'true');
        ol.appendChild(indicator);
      }
      return links;
    };
    if (tocList) { tocLinks = build(tocList, true); tocAside.hidden = false; }
    if (tocMobile) {
      build($('.toc-mobile__list', tocMobile), false);
      tocMobile.hidden = false;
      tocMobile.addEventListener('click', function (e) { if (e.target.closest('a')) tocMobile.open = false; });
    }
  }

  function measure() {
    var y = window.scrollY || 0;
    tops = tocTargets.map(function (h) { return h.getBoundingClientRect().top + y; });
    linkBox = tocLinks.map(function (a) { return [a.offsetTop, a.offsetHeight]; });
    var r = docBody.getBoundingClientRect();
    docTop = r.top + y;
    docEnd = Math.max(1, r.bottom + y - window.innerHeight);
    active = -1;
    spy(y);
  }
  function spy(y) {
    if (progressBar) {
      var p = Math.min(1, Math.max(0, (y - docTop) / Math.max(1, docEnd - docTop)));
      progressBar.style.transform = 'scaleX(' + p.toFixed(4) + ')';
    }
    if (!tocLinks.length) return;
    var line = y + window.innerHeight * 0.28;
    var idx = 0;
    for (var i = 0; i < tops.length; i++) if (tops[i] <= line) idx = i;
    if (y + window.innerHeight >= document.documentElement.scrollHeight - 4) idx = tops.length - 1;
    if (idx === active) return;
    if (active > -1) { tocLinks[active].classList.remove('is-active'); tocLinks[active].removeAttribute('aria-current'); }
    active = idx;
    var a = tocLinks[idx];
    a.classList.add('is-active');
    a.setAttribute('aria-current', 'location');
    var box = linkBox[idx];
    if (indicator && box) {
      indicator.style.transform = 'translateY(' + box[0] + 'px) scaleY(' + box[1] + ')';
      indicator.style.opacity = '1';
      var lt = box[0], lb = lt + box[1];
      if (lt < tocList.scrollTop || lb > tocList.scrollTop + tocList.clientHeight) {
        tocList.scrollTo({ top: lt - tocList.clientHeight / 2, behavior: reduceMotion ? 'auto' : 'smooth' });
      }
    }
  }
  var pending = false;
  function layoutChanged() {
    if (pending) return;
    pending = true;
    requestAnimationFrame(function () { pending = false; measure(); });
  }
  if (agipix.onScroll) agipix.onScroll(spy); else window.addEventListener('scroll', function () { spy(window.scrollY); }, { passive: true });
  window.addEventListener('resize', layoutChanged, { passive: true });
  window.addEventListener('load', layoutChanged);
  if ('ResizeObserver' in window) new ResizeObserver(layoutChanged).observe(docBody);
  measure();

  /* ---------- Left nav tree: remembered open/closed sections, current page in view ---------- */
  var nav = document.getElementById('docs-nav');
  if (nav) {
    var saved = {};
    try { saved = JSON.parse(store.get('agipix.nav') || '{}') || {}; } catch (e) { saved = {}; }
    $$('details.nav-group', nav).forEach(function (d) {
      var key = d.getAttribute('data-key');
      if (d.hasAttribute('data-current')) d.open = true;
      else if (typeof saved[key] === 'boolean') d.open = saved[key];
      d.addEventListener('toggle', function () {
        saved[key] = d.open;
        store.set('agipix.nav', JSON.stringify(saved));
      });
    });
    var inner = $('.docs-nav__inner', nav);
    var cur = $('a[aria-current="page"]', nav);
    if (inner && cur) {
      var top = cur.offsetTop - inner.offsetTop;
      if (top > inner.clientHeight * 0.6) inner.scrollTop = top - inner.clientHeight / 3;
    }
    var menuBtn = $('.docs-menu-btn');
    if (menuBtn) {
      menuBtn.addEventListener('click', function () {
        var open = !nav.classList.contains('is-open');
        nav.classList.toggle('is-open', open);
        menuBtn.setAttribute('aria-expanded', String(open));
        layoutChanged();
      });
    }
  }

  /* ---------- Focus (wide reading) mode ---------- */
  var focusBtn = $('[data-focus-toggle]');
  function setFocus(on, announce) {
    root.classList.toggle('docs-focus', on);
    if (focusBtn) focusBtn.setAttribute('aria-pressed', String(on));
    store.set('agipix.focus', on ? '1' : '0');
    if (announce) toast(on ? 'Focus mode: sidebars hidden (press F to exit)' : 'Focus mode off');
    layoutChanged();
  }
  if (focusBtn) {
    focusBtn.setAttribute('aria-pressed', String(root.classList.contains('docs-focus')));
    focusBtn.addEventListener('click', function () { setFocus(!root.classList.contains('docs-focus'), true); });
    document.addEventListener('keydown', function (e) {
      var typing = /^(input|textarea|select)$/i.test(e.target.tagName || '') || e.target.isContentEditable;
      if (!typing && !e.metaKey && !e.ctrlKey && !e.altKey && (e.key === 'f' || e.key === 'F') && !document.querySelector('dialog[open]')) {
        setFocus(!root.classList.contains('docs-focus'), true);
      }
    });
  }

  /* ---------- Copy as Markdown (raw source from GitHub) ---------- */
  var mdBtn = $('[data-copy-md]');
  if (mdBtn) {
    var raw = mdBtn.getAttribute('data-raw');
    var mdPromise = null;
    var fetchMd = function () {
      if (!mdPromise) {
        mdPromise = fetch(raw, { mode: 'cors' }).then(function (r) {
          if (!r.ok) throw new Error(r.status);
          return r.text();
        }).then(function (t) {
          // strip front matter; add the page title and URL for context
          t = t.replace(/^﻿?---\r?\n[\s\S]*?\r?\n---\r?\n/, '');
          return t.replace(/^\s+/, '') + '\n\n<!-- Source: ' + location.origin + location.pathname + ' -->\n';
        });
        mdPromise.catch(function () { mdPromise = null; });
      }
      return mdPromise;
    };
    mdBtn.addEventListener('pointerenter', fetchMd, { once: true });
    mdBtn.addEventListener('focus', fetchMd, { once: true });
    mdBtn.addEventListener('click', function () {
      var p = fetchMd();
      var done = function () { agipix.flashDone(mdBtn, 'Copied'); toast('Markdown source copied'); };
      var fail = function () {
        toast('Could not reach GitHub. Opening the source instead.');
        window.open(mdBtn.getAttribute('data-source'), '_blank', 'noopener');
      };
      // ClipboardItem with a promise keeps the user gesture (Safari); fall back to writeText
      if (window.ClipboardItem && navigator.clipboard && navigator.clipboard.write) {
        try {
          var item = new ClipboardItem({ 'text/plain': p.then(function (t) { return new Blob([t], { type: 'text/plain' }); }) });
          navigator.clipboard.write([item]).then(done, function () { p.then(function (t) { return agipix.copy(t); }).then(done, fail); });
          return;
        } catch (e) { /* fall through */ }
      }
      p.then(function (t) { return agipix.copy(t); }).then(done, fail);
    });
  }

  /* ---------- Download as PDF (print with the print stylesheet) ---------- */
  var openedForPrint = [];
  function prepareForPrint() {
    openedForPrint = details.filter(function (d) { return !d.open; });
    openedForPrint.forEach(function (d) { d.open = true; });
    collapsibles.forEach(function (c) { if (c.el.classList.contains('is-collapsed')) { c.el.setAttribute('data-print-expanded', ''); c.set(true); } });
    return agipix.eagerImages ? agipix.eagerImages() : Promise.resolve();
  }
  function restoreAfterPrint() {
    openedForPrint.forEach(function (d) { d.open = false; });
    openedForPrint = [];
    collapsibles.forEach(function (c) { if (c.el.hasAttribute('data-print-expanded')) { c.el.removeAttribute('data-print-expanded'); c.set(false); } });
  }
  window.addEventListener('beforeprint', function () { if (!openedForPrint.length) prepareForPrint(); });
  window.addEventListener('afterprint', restoreAfterPrint);
  $$('[data-print]').forEach(function (b) {
    b.addEventListener('click', function () {
      toast('Preparing… choose “Save as PDF” as the printer');
      var timeout = new Promise(function (res) { setTimeout(res, 5000); });
      Promise.race([prepareForPrint(), timeout]).then(function () {
        var go = function () { window.print(); };
        if (window.MathJax && MathJax.startup && MathJax.startup.promise) MathJax.startup.promise.then(go, go); else go();
      });
    });
  });
})();
