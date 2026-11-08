/* Shop: title band, category filter, sort, card grid, load more */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.pages = NRL.pages || {};
  var c = NRL.c, t = c.t, esc = c.esc;

  var PAGE = 9;
  /* Kept in memory while the user stays on the shop; resets when the category changes */
  var view = { cat: null, sort: 'popular', shown: PAGE };

  function listFor(cat) {
    var list = NRL.products.filter(function (p) { return !cat || p.cat === cat; });
    if (view.sort !== 'popular') {
      var dir = view.sort === 'price-up' ? 1 : -1;
      list = list.slice().sort(function (a, b) {
        return dir * (a.options[c.optIndex(a)].price - b.options[c.optIndex(b)].price);
      });
    }
    return list;
  }

  function filterItems(cat, mod) {
    var all = [{ key: null, label: t('shop.all'), n: NRL.products.length }].concat(
      NRL.categories.map(function (k) {
        return { key: k, label: t('cat.' + k), n: c.catStats(k).n };
      })
    );
    return all.map(function (f) {
      var active = (f.key || null) === (cat || null);
      var art = f.key
        ? c.badge(f.key)
        : '<span class="filter-all" aria-hidden="true">' + esc(t('shop.all').slice(0, 3)) + '</span>';
      if (mod === 'chip') art = '';
      return '<a class="filter-' + mod + (active ? ' is-active' : '') + '" href="#/shop' + (f.key ? '?cat=' + f.key : '') + '"' + (active ? ' aria-current="true"' : '') + '>' +
        art + '<span class="filter-label">' + esc(f.label) + '</span><span class="filter-count">' + f.n + '</span></a>';
    }).join('');
  }

  function sortControl() {
    var opts = [['popular', 'sort.popular'], ['price-up', 'sort.priceUp'], ['price-down', 'sort.priceDown']];
    return '<div class="sort"><span class="label">' + esc(t('shop.sortBy')) + '</span><div class="sort-control" role="group" aria-label="' + esc(t('shop.sortBy')) + '">' +
      opts.map(function (o) {
        return '<button type="button" class="sort-btn" data-action="sort" data-sort="' + o[0] + '" aria-pressed="' + (view.sort === o[0]) + '">' + esc(t(o[1])) + '</button>';
      }).join('') + '</div></div>';
  }

  function build(cat) {
    var list = listFor(cat);
    var shown = list.slice(0, view.shown);
    var more = shown.length < list.length;
    return '<div class="container">' +
      '<div class="title-band">' + c.crumbs([{ label: t('crumb.home'), href: '#/' }, { label: t('crumb.shop') }]) +
        '<div class="title-row"><h1>' + esc(t('shop.title')) + '</h1><p class="title-lead">' + esc(t('shop.lead')) + '</p></div></div>' +
      '<div class="shop-body">' +
        '<aside class="filter tex-card has-bloom" aria-label="' + esc(t('shop.categories')) + '"><h2 class="label">' + esc(t('shop.categories')) + '</h2>' +
          '<nav class="filter-list">' + filterItems(cat, 'item') + '</nav></aside>' +
        '<div class="shop-main">' +
          '<nav class="chips" aria-label="' + esc(t('shop.categories')) + '">' + filterItems(cat, 'chip') + '</nav>' +
          '<div class="toolbar"><p class="label" aria-live="polite">' + esc(t('shop.showing', { n: shown.length, total: list.length })) + '</p>' + sortControl() + '</div>' +
          '<h2 class="sr-only">' + esc(t(cat ? 'cat.' + cat : 'shop.all')) + '</h2>' +
          (shown.length
            ? '<div class="grid-3">' + shown.map(c.card).join('') + '</div>'
            : '<p class="shop-empty">' + esc(t('shop.empty')) + '</p>') +
          (list.length > PAGE
            ? '<div class="load-more">' + (more ? '<button type="button" class="btn btn--secondary" data-action="load-more">' + esc(t('shop.loadMore')) + '</button>' : '') +
              '<p class="shown">' + esc(t('shop.shown', { n: shown.length, total: list.length })) + '</p></div>'
            : '') +
        '</div></div></div>';
  }

  NRL.shop = {
    view: view,
    setSort: function (s) { view.sort = s; },
    more: function () { view.shown += PAGE; }
  };

  NRL.pages.shop = {
    render: function (root, ctx) {
      var cat = NRL.categories.indexOf(ctx.query.cat) !== -1 ? ctx.query.cat : null;
      if (cat !== view.cat) { view.cat = cat; view.shown = PAGE; }
      root.innerHTML = build(cat);
    }
  };
})();
