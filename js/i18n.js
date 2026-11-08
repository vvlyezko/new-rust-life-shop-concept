/* Dictionary lookup. Falls back to EN, then to the key itself. */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});

  /* A dictionary value may be { one, few, many, other }: the form is picked from vars.n (CLDR plural rules) */
  var rules = {};
  function pluralForm(lang, n) {
    if (!window.Intl || !Intl.PluralRules) return n === 1 ? 'one' : 'other';
    if (!rules[lang]) rules[lang] = new Intl.PluralRules(lang);
    return rules[lang].select(n);
  }

  function t(key, vars) {
    var lang = NRL.state.get('lang');
    var s = (NRL.dict[lang] || {})[key];
    if (s === undefined) s = (NRL.dict.en || {})[key];
    if (s === undefined) return key;
    if (typeof s === 'object') {
      s = s[pluralForm(lang, vars && vars.n)] || s.other || s.many || '';
    }
    if (vars) {
      s = s.replace(/\{(\w+)\}/g, function (m, k) { return vars[k] !== undefined ? vars[k] : m; });
    }
    return s;
  }

  /* Static markup: data-i18n="key" sets textContent; data-i18n-attr="aria-label:key;title:key2" sets attributes. */
  function apply(root) {
    (root || document).querySelectorAll('[data-i18n]').forEach(function (el) {
      el.textContent = t(el.getAttribute('data-i18n'));
    });
    (root || document).querySelectorAll('[data-i18n-attr]').forEach(function (el) {
      el.getAttribute('data-i18n-attr').split(';').forEach(function (pair) {
        var i = pair.indexOf(':');
        if (i > 0) el.setAttribute(pair.slice(0, i).trim(), t(pair.slice(i + 1).trim()));
      });
    });
  }

  /* <html lang>, document title, static strings */
  function syncDocument() {
    document.documentElement.lang = NRL.state.get('lang');
    document.title = t('meta.title');
    apply(document);
  }

  NRL.i18n = { t: t, apply: apply, syncDocument: syncDocument };
})();
