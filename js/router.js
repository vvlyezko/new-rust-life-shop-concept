/* Hash router: #/  #/shop  #/shop?cat=kits  #/product/gold-vip  #/cart
   Hashes that do not start with "#/" are ignored, so in-page anchors never trigger a route change. */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.pages = NRL.pages || {};

  var routes = [
    { name: 'home',    re: /^\/$/ },
    { name: 'shop',    re: /^\/shop$/ },
    { name: 'product', re: /^\/product\/([a-z0-9-]+)$/, keys: ['slug'] },
    { name: 'cart',    re: /^\/cart$/ }
  ];

  var current = { name: 'home', params: {}, query: {} };
  var listeners = [];
  var pendingScroll = null;

  function parse(hash) {
    if (!hash || hash === '#' || hash === '#/') return { path: '/', query: {} };
    if (hash.indexOf('#/') !== 0) return null;
    var q = hash.indexOf('?');
    var path = q === -1 ? hash.slice(1) : hash.slice(1, q);
    var query = {};
    if (q !== -1) {
      new URLSearchParams(hash.slice(q + 1)).forEach(function (v, k) { query[k] = v; });
    }
    return { path: path, query: query };
  }

  function match(path) {
    for (var i = 0; i < routes.length; i++) {
      var m = routes[i].re.exec(path);
      if (m) {
        var params = {};
        (routes[i].keys || []).forEach(function (k, j) { params[k] = m[j + 1]; });
        return { name: routes[i].name, params: params };
      }
    }
    return null;
  }

  function mount() {
    var page = NRL.pages[current.name];
    var root = document.getElementById('main');
    root.innerHTML = '';
    if (page) page.render(root, current);
  }

  /* A re-render replaces the page markup, so remember which control had focus and focus its twin afterwards */
  var KEY_ATTRS = ['data-action', 'data-slug', 'data-opt', 'data-d', 'data-sort', 'id', 'name', 'value'];
  function focusKey() {
    var a = document.activeElement, main = document.getElementById('main');
    if (!a || a === main || !main.contains(a)) return null;
    var sel = a.tagName.toLowerCase();
    KEY_ATTRS.forEach(function (n) { if (a.hasAttribute(n)) sel += '[' + n + '="' + a.getAttribute(n) + '"]'; });
    return { sel: sel, action: a.getAttribute('data-action'), slug: a.getAttribute('data-slug') };
  }
  function restoreFocus(key) {
    if (!key) return;
    var main = document.getElementById('main');
    var el = main.querySelector(key.sel);
    if (!el && key.slug && (key.action === 'add' || key.action === 'remove')) {
      /* add ↔ remove: the same card now shows the other button */
      el = main.querySelector('[data-action="' + (key.action === 'add' ? 'remove' : 'add') + '"][data-slug="' + key.slug + '"]');
    }
    if (el) el.focus({ preventScroll: true });
  }

  function scrollToTarget(id) {
    var el = id && document.getElementById(id);
    if (el) el.scrollIntoView({ block: 'start' });
    return !!el;
  }

  function resolve() {
    var loc = parse(window.location.hash);
    if (!loc) return; // plain anchor: not ours
    var m = match(loc.path);
    if (!m) { window.location.replace('#/'); return; } // unknown route → home
    var changed = m.name !== current.name || JSON.stringify(m.params) !== JSON.stringify(current.params);
    current = { name: m.name, params: m.params, query: loc.query };
    mount();
    listeners.forEach(function (fn) { fn(current, changed); });

    if (pendingScroll) {
      scrollToTarget(pendingScroll);
      pendingScroll = null;
    } else if (changed) {
      /* New page: back to the top and move focus to its heading. Same page with a new
         query (shop filter) keeps the scroll position and focus. */
      window.scrollTo(0, 0);
      var h1 = document.querySelector('#main h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus({ preventScroll: true }); }
    }
  }

  NRL.router = {
    current: function () { return current; },
    onChange: function (fn) { listeners.push(fn); },
    /* Re-render the current page (language or cart changed) without moving the scroll position */
    refresh: function () {
      var key = focusKey();
      mount();
      listeners.forEach(function (fn) { fn(current, false); });
      restoreFocus(key);
    },
    go: function (path, opts) {
      var target = '#' + path;
      pendingScroll = opts && opts.scroll ? opts.scroll : null;
      if (window.location.hash === target || (path === '/' && (window.location.hash === '' || window.location.hash === '#'))) {
        if (pendingScroll) { scrollToTarget(pendingScroll); pendingScroll = null; }
        else window.scrollTo(0, 0);
      } else {
        window.location.hash = target;
      }
    },
    start: function () {
      window.addEventListener('hashchange', resolve);
      resolve();
    }
  };
})();
