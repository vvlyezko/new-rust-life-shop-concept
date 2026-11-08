/* App state: language, signed-in flag, cart. Persists to localStorage (try/catch: the page works without it). */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});

  var KEY = 'nrl:v1';
  var data = { lang: 'en', signedIn: false, cart: [] }; // cart: [{ slug, opt, qty }]
  var listeners = [];

  function validLine(l) {
    return l && typeof l.slug === 'string' && Number.isInteger(l.opt) && Number.isInteger(l.qty) && l.qty > 0;
  }

  function load() {
    try {
      var raw = window.localStorage.getItem(KEY);
      if (!raw) return;
      var p = JSON.parse(raw);
      if (!p || typeof p !== 'object') return;
      if (p.lang === 'en' || p.lang === 'ru') data.lang = p.lang;
      data.signedIn = p.signedIn === true;
      if (Array.isArray(p.cart)) data.cart = p.cart.filter(validLine);
    } catch (e) { /* storage blocked or corrupt: start from defaults */ }
  }

  function save() {
    try { window.localStorage.setItem(KEY, JSON.stringify(data)); } catch (e) { /* ignore */ }
  }

  NRL.state = {
    get: function (key) { return data[key]; },
    set: function (key, value) {
      data[key] = value;
      save();
      listeners.slice().forEach(function (fn) { fn(key); });
    },
    subscribe: function (fn) { listeners.push(fn); },
    cartCount: function () {
      return data.cart.length; /* distinct lines, as in the Figma header and cart title */
    }
  };

  load();
})();
