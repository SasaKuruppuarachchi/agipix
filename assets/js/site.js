/* Agipix — site interactions (every page). Vanilla JS, no dependencies. */
(function () {
  'use strict';

  var $ = function (s, r) { return (r || document).querySelector(s); };
  var $$ = function (s, r) { return Array.prototype.slice.call((r || document).querySelectorAll(s)); };
  var root = document.documentElement;
  var body = document.body;
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  var isMac = /Mac|iPhone|iPad/.test(navigator.platform || navigator.userAgent);

  var agipix = window.agipix = window.agipix || {};
  agipix.reduceMotion = reduceMotion;

  /* MathJax (loaded on pages with `math: true`) reads its config before it loads. */
  if (document.getElementById('MathJax-script') && !window.MathJax) {
    window.MathJax = {
      tex: { inlineMath: [['$', '$'], ['\\(', '\\)']], displayMath: [['$$', '$$'], ['\\[', '\\]']] },
      options: { skipHtmlTags: ['script', 'noscript', 'style', 'textarea', 'pre', 'code'] }
    };
  }

  /* ---------- Toast + clipboard helpers ---------- */
  var toastEl = $('.toast');
  var toastTimer = null;
  agipix.toast = function (msg) {
    if (!toastEl) return;
    toastEl.textContent = msg;
    toastEl.hidden = false;
    requestAnimationFrame(function () { toastEl.classList.add('is-shown'); });
    clearTimeout(toastTimer);
    toastTimer = setTimeout(function () {
      toastEl.classList.remove('is-shown');
      setTimeout(function () { toastEl.hidden = true; }, 400);
    }, 2200);
  };

  agipix.copy = function (text) {
    if (navigator.clipboard && window.isSecureContext) return navigator.clipboard.writeText(text);
    return new Promise(function (resolve, reject) {
      var ta = document.createElement('textarea');
      ta.value = text;
      ta.setAttribute('readonly', '');
      ta.style.cssText = 'position:fixed;top:-1000px;opacity:0';
      body.appendChild(ta);
      ta.select();
      try { document.execCommand('copy') ? resolve() : reject(new Error('copy failed')); } catch (e) { reject(e); }
      ta.remove();
    });
  };

  agipix.flashDone = function (btn, label) {
    var span = $('span', btn);
    var prev = span ? span.textContent : '';
    btn.classList.add('is-done');
    if (span) span.textContent = label || 'Copied';
    setTimeout(function () { btn.classList.remove('is-done'); if (span) span.textContent = prev; }, 1600);
  };

  /* Keyboard hint: ⌘K on Apple devices */
  if (isMac) $$('[data-kbd-mod]').forEach(function (k) { k.textContent = '⌘ K'; });

  /* ---------- Mobile navigation ---------- */
  var siteNav = $('.site-nav');
  var toggle = $('.nav-toggle');
  if (siteNav && toggle) {
    var setOpen = function (open) {
      siteNav.setAttribute('data-open', String(open));
      toggle.setAttribute('aria-expanded', String(open));
    };
    toggle.addEventListener('click', function () { setOpen(siteNav.getAttribute('data-open') !== 'true'); });
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && siteNav.getAttribute('data-open') === 'true') { setOpen(false); toggle.focus(); } });
    $$('.nav-link', siteNav).forEach(function (a) { a.addEventListener('click', function () { setOpen(false); }); });
  }

  /* ---------- One rAF-throttled scroll loop (reads scrollY only; writes classes/transforms) ---------- */
  var handlers = [];
  var ticking = false;
  var stuck = null;
  agipix.onScroll = function (fn) { handlers.push(fn); fn(window.scrollY || 0); };
  function frame() {
    ticking = false;
    var y = window.scrollY || window.pageYOffset;
    if (siteNav) {
      var s = y > 40;
      if (s !== stuck) { stuck = s; siteNav.classList.toggle('is-stuck', s); }
    }
    for (var i = 0; i < handlers.length; i++) handlers[i](y);
  }
  function onScroll() { if (!ticking) { ticking = true; requestAnimationFrame(frame); } }
  window.addEventListener('scroll', onScroll, { passive: true });
  frame();

  /* ---------- Reveal on scroll ---------- */
  var reveals = $$('.reveal');
  if (reveals.length) {
    if (!reduceMotion && 'IntersectionObserver' in window) {
      var revealIO = new IntersectionObserver(function (entries) {
        var shown = 0;
        entries.forEach(function (e) {
          if (!e.isIntersecting) return;
          e.target.style.setProperty('--d', Math.min(shown++, 5) * 0.07 + 's');
          e.target.classList.add('in');
          revealIO.unobserve(e.target);
        });
      }, { rootMargin: '0px 0px -8% 0px', threshold: 0.01 });
      reveals.forEach(function (el) { revealIO.observe(el); });
    } else {
      reveals.forEach(function (el) { el.classList.add('in'); });
    }
  }

  /* ---------- Lazy, autoplaying loop videos: <video data-lazy data-autoplay><source data-src> ---------- */
  var lazyVideos = $$('video[data-lazy]');
  if (lazyVideos.length) {
    var loadVideo = function (v) {
      $$('source[data-src]', v).forEach(function (s) { s.src = s.getAttribute('data-src'); s.removeAttribute('data-src'); });
      v.load();
    };
    var play = function (v) {
      if (reduceMotion || !v.hasAttribute('data-autoplay')) return;
      var p = v.play();
      if (p && p.catch) p.catch(function () {});
    };
    if ('IntersectionObserver' in window) {
      var vio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          var v = e.target;
          v._inView = e.isIntersecting;
          if (e.isIntersecting) {
            if (reduceMotion && v.hasAttribute('data-autoplay')) return; // poster only
            if ($('source[data-src]', v)) loadVideo(v);
            play(v);
          } else if (!v.paused) v.pause();
        });
      }, { rootMargin: '200px 0px' });
      lazyVideos.forEach(function (v) { vio.observe(v); });
      document.addEventListener('visibilitychange', function () {
        lazyVideos.forEach(function (v) { if (document.hidden) v.pause(); else if (v._inView) play(v); });
      });
    } else if (!reduceMotion) {
      lazyVideos.forEach(function (v) { loadVideo(v); play(v); });
    }
  }

  /* ---------- Lightbox (dialog): keyboard, swipe, full-resolution link ---------- */
  var lb = $('#lightbox');
  if (lb) {
    var stage = $('.lightbox__stage', lb);
    var caption = $('.lightbox__caption', lb);
    var count = $('.lightbox__count', lb);
    var full = $('.lightbox__full', lb);
    var prev = $('.lightbox__nav--prev', lb);
    var next = $('.lightbox__nav--next', lb);
    var gallery = [];
    var idx = 0;
    var opener = null;

    var zoomables = function (scope) { return $$('img[data-zoom], img[data-zoomable]', scope); };
    var itemFor = function (img) {
      var fig = img.closest('figure');
      var cap = fig && $('figcaption', fig);
      return {
        src: img.getAttribute('data-large') || img.currentSrc || img.src,
        full: img.getAttribute('data-full') || img.currentSrc || img.src,
        alt: img.alt || '',
        caption: cap ? cap.textContent.trim() : (img.alt || '')
      };
    };
    var show = function (i) {
      idx = (i + gallery.length) % gallery.length;
      var it = gallery[idx];
      var img = new Image();
      img.decoding = 'async';
      img.alt = it.alt;
      img.src = it.src;
      stage.replaceChildren(img);
      caption.textContent = it.caption;
      full.href = it.full;
      full.hidden = !it.full;
      var multi = gallery.length > 1;
      prev.hidden = next.hidden = !multi;
      count.textContent = multi ? (idx + 1) + ' / ' + gallery.length : '';
      if (img.animate && !reduceMotion) img.animate([{ opacity: 0, transform: 'scale(.985)' }, { opacity: 1, transform: 'none' }], { duration: 260, easing: 'ease-out' });
    };
    var open = function (img) {
      var scope = img.closest('.doc-body') || img.closest('main') || document;
      gallery = zoomables(scope).map(itemFor);
      opener = img;
      if (!lb.open) {
        if (lb.showModal) lb.showModal(); else lb.setAttribute('open', '');
        body.classList.add('lb-open');
      }
      show(Math.max(0, zoomables(scope).indexOf(img)));
    };
    var close = function () {
      if (!lb.open) return;
      lb.classList.add('is-closing');
      setTimeout(function () {
        lb.classList.remove('is-closing');
        if (lb.close) lb.close(); else lb.removeAttribute('open');
        stage.replaceChildren();
        body.classList.remove('lb-open');
        if (opener && opener.focus) opener.focus({ preventScroll: true });
      }, reduceMotion ? 0 : 200);
    };
    agipix.openLightbox = open;

    document.addEventListener('click', function (e) {
      var img = e.target.closest && e.target.closest('img[data-zoom], img[data-zoomable]');
      if (!img || e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey) return;
      e.preventDefault();
      open(img);
    });
    document.addEventListener('keydown', function (e) {
      var img = e.target.matches && e.target.matches('img[data-zoom], img[data-zoomable]') ? e.target : null;
      if (img && (e.key === 'Enter' || e.key === ' ')) { e.preventDefault(); open(img); }
    });
    lb.addEventListener('click', function (e) {
      var stepBtn = e.target.closest('[data-step]');
      if (stepBtn) { show(idx + parseInt(stepBtn.getAttribute('data-step'), 10)); return; }
      if (e.target.closest('[data-close]') || e.target === lb || e.target === stage) close();
    });
    lb.addEventListener('cancel', function (e) { e.preventDefault(); close(); });
    lb.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); if (gallery.length > 1) show(idx - 1); }
      if (e.key === 'ArrowRight') { e.preventDefault(); if (gallery.length > 1) show(idx + 1); }
    });
    var tx = null, ty = null;
    lb.addEventListener('touchstart', function (e) { if (e.touches.length === 1) { tx = e.touches[0].clientX; ty = e.touches[0].clientY; } }, { passive: true });
    lb.addEventListener('touchend', function (e) {
      if (tx === null) return;
      var dx = e.changedTouches[0].clientX - tx, dy = e.changedTouches[0].clientY - ty;
      if (Math.abs(dx) > 50 && Math.abs(dx) > Math.abs(dy) * 1.4 && gallery.length > 1) show(idx + (dx < 0 ? 1 : -1));
      else if (dy > 90 && Math.abs(dy) > Math.abs(dx) * 1.4) close();
      tx = ty = null;
    });
    // make zoomable images reachable by keyboard
    $$('img[data-zoom]').forEach(function (img) { img.tabIndex = 0; img.setAttribute('role', 'button'); img.setAttribute('aria-label', 'View larger: ' + (img.alt || 'image')); });
  }

  /* ---------- Home: image slider ---------- */
  var track = $('#homeSliderTrack');
  if (track) {
    var slides = $$('.emotions-slider__slide', track);
    var pagination = $('#homeSliderPagination');
    var prevBtn = $('#homeSliderPrev');
    var nextBtn = $('#homeSliderNext');
    var active = 0;
    var dots = slides.map(function (_, i) {
      var d = document.createElement('button');
      d.type = 'button';
      d.className = 'slider-pagination__item';
      d.setAttribute('aria-label', 'Go to slide ' + (i + 1));
      d.addEventListener('click', function () { go(i, true); });
      pagination.appendChild(d);
      return d;
    });
    var paint = function () {
      prevBtn.classList.toggle('disabled', active === 0);
      nextBtn.classList.toggle('disabled', active === slides.length - 1);
      prevBtn.setAttribute('aria-disabled', String(active === 0));
      nextBtn.setAttribute('aria-disabled', String(active === slides.length - 1));
      dots.forEach(function (d, i) { d.classList.toggle('active', i === active); d.setAttribute('aria-current', i === active ? 'true' : 'false'); });
    };
    var go = function (i, smooth) {
      active = Math.max(0, Math.min(i, slides.length - 1));
      paint();
      var s = slides[active];
      track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.clientWidth) / 2, behavior: smooth && !reduceMotion ? 'smooth' : 'auto' });
    };
    prevBtn.addEventListener('click', function () { if (active > 0) go(active - 1, true); });
    nextBtn.addEventListener('click', function () { if (active < slides.length - 1) go(active + 1, true); });
    track.addEventListener('keydown', function (e) {
      if (e.key === 'ArrowLeft') { e.preventDefault(); go(active - 1, true); }
      if (e.key === 'ArrowRight') { e.preventDefault(); go(active + 1, true); }
    });
    // track which slide is centred without reading layout on every scroll event
    if ('IntersectionObserver' in window) {
      var sio = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) {
          if (e.isIntersecting && e.intersectionRatio > 0.6) { active = slides.indexOf(e.target); paint(); }
        });
      }, { root: track, threshold: [0.6] });
      slides.forEach(function (s) { sio.observe(s); });
    }
    paint();
    requestAnimationFrame(function () { go(0, false); });
  }

  /* ---------- Docs version menu: same page in the other version ---------- */
  var versionSwitch = $('[data-version-switch]');
  if (versionSwitch) {
    versionSwitch.addEventListener('change', function () {
      var root = versionSwitch.getAttribute('data-current-root');
      var path = window.location.pathname;
      window.location.href = path.indexOf(root) === 0
        ? versionSwitch.value + path.slice(root.length) + window.location.hash
        : versionSwitch.value;
    });
    /* Back/forward restores the page: show its own version, not the last choice */
    window.addEventListener('pageshow', function () {
      Array.prototype.forEach.call(versionSwitch.options, function (o, i) {
        if (o.defaultSelected) versionSwitch.selectedIndex = i;
      });
    });
  }

  /* ---------- Home: collaboration form -> mailto ---------- */
  var form = $('#collabForm');
  if (form) {
    form.addEventListener('submit', function (e) {
      e.preventDefault();
      var v = function (id) { return ($('#' + id).value || '').trim(); };
      var subject = encodeURIComponent('Joining AgiPIX Project');
      var text = 'Name: ' + v('collabName') + '\nEmail: ' + v('collabEmail') + '\nAffiliation: ' + v('collabAffiliation') +
        '\nGitHub Username: ' + v('collabGithub') + '\n\nReason for Joining / Interest:\n' + v('collabInterest');
      window.location.href = 'mailto:' + form.getAttribute('data-mailto') + '?cc=' + form.getAttribute('data-cc') +
        '&subject=' + subject + '&body=' + encodeURIComponent(text);
    });
  }

  /* ---------- Copy buttons: <button data-copy="text"> ---------- */
  document.addEventListener('click', function (e) {
    var b = e.target.closest && e.target.closest('[data-copy]');
    if (!b) return;
    agipix.copy(b.getAttribute('data-copy')).then(function () { agipix.flashDone(b); agipix.toast('Copied to clipboard'); },
      function () { agipix.toast('Copy failed. Select the text and copy it manually.'); });
  });

  /* ---------- 404: show the requested path ---------- */
  var nf = $('.notfound__path');
  if (nf) { $('code', nf).textContent = location.pathname; nf.hidden = false; }

  /* ---------- Printing: make lazy images load ---------- */
  agipix.eagerImages = function () {
    var imgs = $$('img[loading="lazy"]');
    imgs.forEach(function (img) { img.loading = 'eager'; });
    return Promise.all(imgs.map(function (img) {
      if (img.complete) return null;
      return new Promise(function (res) { img.addEventListener('load', res, { once: true }); img.addEventListener('error', res, { once: true }); });
    }));
  };
  window.addEventListener('beforeprint', function () { agipix.eagerImages(); });
})();
