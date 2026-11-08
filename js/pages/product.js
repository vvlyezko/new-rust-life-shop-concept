/* Product page: #/product/:slug */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.pages = NRL.pages || {};
  var c = NRL.c, t = c.t, esc = c.esc, txt = c.txt;

  function related(p) {
    var slugs = p.related;
    if (!slugs) {
      slugs = NRL.products
        .filter(function (q) { return q.slug !== p.slug && q.cat !== p.cat; })
        .slice(0, 4).map(function (q) { return q.slug; });
    }
    return slugs.map(c.product).filter(Boolean);
  }

  function illustration(p, cart) {
    var loot = (NRL.lootIcons[p.cat] || []).map(function (ic, i) {
      return '<span class="loot loot--' + (i + 1) + '">' + c.icon(ic) + '</span>';
    }).join('');
    return '<div class="illustration tex-scratches has-bloom has-rivets" aria-hidden="true">' +
      '<i class="orbit"></i><span class="illu-badge">' + c.badge(p.cat) + '</span>' + loot +
      (p.tag || cart ? '<span class="illu-tag">' + c.tagHTML(p, cart) + '</span>' : '') +
    '</div>';
  }

  /* "7 days" → big number plus small unit on mobile; labels without a space stay whole */
  function labelParts(label) {
    var i = label.indexOf(' ');
    if (i === -1) return '<span class="dur-num">' + esc(label) + '</span>';
    return '<span class="dur-num">' + esc(label.slice(0, i)) + '</span> <span class="dur-unit">' + esc(label.slice(i + 1)) + '</span>';
  }

  function options(p) {
    var sel = c.optIndex(p);
    var label = t(p.optionKind === 'duration' ? 'prod.chooseDuration' : 'prod.chooseQuantity');
    return '<p class="label" id="opt-label">' + esc(label) + '</p>' +
      '<div class="duration" role="group" aria-labelledby="opt-label">' +
      p.options.map(function (o, i) {
        return '<button type="button" class="dur-opt" data-action="term" data-slug="' + p.slug + '" data-opt="' + i + '" aria-pressed="' + (i === sel) + '">' +
          '<span class="dur-label">' + labelParts(txt(o.label)) + '</span>' +
          '<span class="dur-price">' + c.money(o.price) + '</span>' +
          '<span class="dur-note">' + (o.best ? esc(t('prod.bestValue')) : '&nbsp;') + '</span></button>';
      }).join('') + '</div>';
  }

  function included(p) {
    var list = p.included || NRL.includedDefault[p.cat] || [];
    return '<section class="panel tex-card has-bloom" aria-labelledby="inc-h"><i class="bar" aria-hidden="true"></i>' +
      '<h2 id="inc-h">' + esc(t('prod.included')) + '</h2><ul class="inc-list">' +
      list.map(function (it) {
        return '<li class="inc-item"><span class="icon-plate">' + c.icon(it.icon) + '</span><div><h3>' + esc(txt(it.title)) + '</h3><p>' + esc(txt(it.text)) + '</p></div></li>';
      }).join('') + '</ul></section>';
  }

  function how(p) {
    var steps = NRL.howSteps[p.cat === 'privileges' ? 'privileges' : 'other'];
    return '<section class="panel tex-card has-bloom" aria-labelledby="how-h"><i class="bar" aria-hidden="true"></i>' +
      '<h2 id="how-h">' + esc(t('prod.how')) + '</h2><ol class="how-list">' +
      steps.map(function (s, i) { return '<li><span class="how-n" aria-hidden="true">' + (i + 1) + '</span><p>' + esc(txt(s)) + '</p></li>'; }).join('') +
      '</ol></section>';
  }

  NRL.pages.product = {
    render: function (root, ctx) {
      var p = c.product(ctx.params.slug);
      if (!p) { window.location.replace('#/shop'); return; }
      var cart = c.inCart(p.slug);
      root.innerHTML =
        '<div class="container">' +
          c.crumbs([{ label: t('crumb.shop'), href: '#/shop' }, { label: t('cat.' + p.cat), href: '#/shop?cat=' + p.cat }, { label: txt(p.title) }]) +
          '<div class="product-top">' + illustration(p, cart) +
            '<div class="product-info">' +
              '<p class="kicker">' + esc(t('cat.' + p.cat)) + ' · ' + esc(txt(p.kind)) + '</p>' +
              '<h1>' + esc(txt(p.title)) + '</h1>' +
              '<p class="product-long">' + esc(txt(p.long || p.desc)) + '</p>' +
              '<hr class="rule">' + options(p) +
              c.priceHTML(p, 'product-price') +
              '<div class="product-cta">' +
                (cart
                  ? '<button type="button" class="btn btn--secondary btn--lg" data-action="remove" data-slug="' + p.slug + '">' + esc(t('card.inCart')) + '</button>'
                  : '<button type="button" class="btn btn--lg" data-action="add" data-slug="' + p.slug + '">' + esc(t('card.add')) + '</button>') +
                '<p class="product-note">' + esc(t('prod.delivered')) + '</p>' +
              '</div>' +
            '</div></div>' +
          '<div class="product-panels">' + included(p) + how(p) + '</div>' +
        '</div>' +
        '<section class="section section--related" aria-labelledby="rel-h"><div class="container">' +
          '<header class="section-head"><div class="section-head-main"><i class="bar" aria-hidden="true"></i><h2 id="rel-h">' + esc(t('prod.related')) + '</h2></div></header></div>' +
          '<div class="container container--cards"><div class="card-row">' + related(p).map(c.card).join('') + '</div></div></section>';
    }
  };
})();
