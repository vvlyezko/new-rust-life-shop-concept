/* Cart: guest banner, items, summary; the empty state replaces everything when there are no lines */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.pages = NRL.pages || {};
  var c = NRL.c, t = c.t, esc = c.esc, txt = c.txt, S = NRL.state;

  /* Transient form state, kept while the user stays on the cart */
  var form = { promo: '', applied: false, error: false, method: 'card', agree: false };

  function lines() {
    return S.get('cart').map(function (l) {
      var p = c.product(l.slug);
      if (!p || !p.options[l.opt]) return null;
      return { l: l, p: p, o: p.options[l.opt] };
    }).filter(Boolean);
  }

  function meta(row) {
    var label = txt(row.o.label), price = c.money(row.o.price);
    if (row.p.tag === 'sale') return t('cart.metaSale', { per: txt(row.o.per).replace(/^\/\s*/, ''), price: price });
    return t(row.p.optionKind === 'duration' ? 'cart.meta' : 'cart.metaEach', { label: label.toLowerCase(), price: price });
  }

  function item(row) {
    var qty = row.l.qty;
    return '<li class="cart-item tex-card">' +
      '<span class="cart-badge">' + c.badge(row.p.cat) + '</span>' +
      '<div class="cart-info"><h2><a href="#/product/' + row.p.slug + '">' + esc(txt(row.p.title)) + '</a></h2>' +
        '<p class="cart-meta">' + esc(meta(row)) + '</p>' +
        '<button type="button" class="remove remove--info" data-action="remove-line" data-slug="' + row.p.slug + '" data-opt="' + row.l.opt + '">' + esc(t('cart.remove')) + '</button></div>' +
      '<div class="qty" role="group" aria-label="' + esc(txt(row.p.title)) + '">' +
        '<button type="button" data-action="qty" data-d="-1" data-slug="' + row.p.slug + '" data-opt="' + row.l.opt + '" aria-label="' + esc(t('cart.qtyMinus')) + '"' + (qty <= 1 ? ' aria-disabled="true"' : '') + '>−</button>' +
        '<span class="qty-value" aria-live="polite">' + qty + '</span>' +
        '<button type="button" data-action="qty" data-d="1" data-slug="' + row.p.slug + '" data-opt="' + row.l.opt + '" aria-label="' + esc(t('cart.qtyPlus')) + '">+</button></div>' +
      '<button type="button" class="remove remove--row" data-action="remove-line" data-slug="' + row.p.slug + '" data-opt="' + row.l.opt + '">' + esc(t('cart.remove')) + '</button>' +
      '<div class="line-total">' + (row.o.old ? '<s class="price-old">' + c.money(row.o.old * qty) + '</s>' : '') +
        '<span>' + c.money(row.o.price * qty) + '</span></div>' +
    '</li>';
  }

  function totals(rows) {
    var sub = rows.reduce(function (n, r) { return n + r.o.price * r.l.qty; }, 0);
    var disc = form.applied ? sub * 0.1 : 0;
    return { sub: sub, disc: disc, total: sub - disc };
  }

  function guestBanner() {
    return '<div class="steam-warning tex-card"><span class="warn-icon" aria-hidden="true">' + c.icon('warning') + '</span>' +
      '<div class="warn-text"><h2>' + esc(t('cart.warnTitle')) + '</h2><p>' + esc(t('cart.warnText')) + '</p></div>' +
      '<button type="button" class="btn" data-action="sign-in">' + esc(t('header.signIn')) + '</button></div>';
  }

  function after() {
    var steps = [['check', 's1'], ['check', 's2'], ['server', 's3']];
    var icons = ['check', 'check', 'server'];
    return '<section class="after" aria-labelledby="after-h"><h2 id="after-h">' + esc(t('cart.after')) + '</h2><ol class="after-steps">' +
      steps.map(function (s, i) {
        return '<li><span class="after-icon" aria-hidden="true">' + c.icon(icons[i]) + '</span><div><h3>' + esc(t('cart.' + s[1])) + '</h3><p>' + esc(t('cart.' + s[1] + 't')) + '</p></div></li>';
      }).join('') + '</ol><p class="after-help">' + esc(t('cart.stuck')) + '</p></section>';
  }

  function summary(rows) {
    var tt = totals(rows);
    var signed = S.get('signedIn');
    var ready = signed && form.agree;
    function method(key) {
      var on = form.method === key;
      return '<label class="method' + (on ? ' is-on' : '') + '"><input type="radio" name="method" value="' + key + '"' + (on ? ' checked' : '') + ' data-action="method">' +
        '<span class="radio" aria-hidden="true"></span><span><b>' + esc(t('cart.' + key)) + '</b><small>' + esc(t('cart.' + key + 'Note')) + '</small></span></label>';
    }
    return '<aside class="summary tex-card has-bloom" aria-labelledby="sum-h"><i class="bar" aria-hidden="true"></i><h2 id="sum-h">' + esc(t('cart.summary')) + '</h2>' +
      '<div class="field"><label class="label" for="promo">' + esc(t('cart.promo')) + '</label>' +
        '<input id="promo" class="input' + (form.error ? ' is-error' : '') + '" type="text" autocomplete="off" placeholder="' + esc(t('cart.promoPlaceholder')) + '" value="' + esc(form.promo) + '"' + (form.error ? ' aria-invalid="true" aria-describedby="promo-err"' : '') + '>' +
        (form.error ? '<p class="field-error" id="promo-err" role="alert">' + esc(t('cart.promoError')) + '</p>' : '') + '</div>' +
      '<button type="button" class="btn btn--secondary btn--block" data-action="apply-promo">' + esc(t('cart.apply')) + '</button>' +
      '<hr class="rule"><dl class="lines">' +
        '<div><dt>' + esc(t('cart.subtotal')) + '</dt><dd>' + c.money(tt.sub) + '</dd></div>' +
        '<div><dt>' + esc(t('cart.promo')) + '</dt><dd>−' + c.money(tt.disc) + '</dd></div></dl>' +
      '<hr class="rule"><div class="total"><span>' + esc(t('cart.total')) + '</span><strong>' + c.money(tt.total) + '</strong></div><hr class="rule">' +
      '<fieldset class="methods"><legend class="label">' + esc(t('cart.method')) + '</legend>' + method('card') + method('paypal') + '</fieldset>' +
      '<label class="agree"><input type="checkbox" data-action="agree"' + (form.agree ? ' checked' : '') + '><span class="box" aria-hidden="true">' + c.icon('check') + '</span><span>' + esc(t('cart.agree')) + '</span></label>' +
      '<button type="button" class="btn btn--block btn--lg" data-action="pay"' + (ready ? '' : ' disabled') + '>' + esc(t('cart.pay', { amount: c.money(tt.total) })) + '</button>' +
      '<p class="summary-note">' + esc(t(ready || signed ? 'cart.noteReady' : 'cart.noteLocked')) + '</p></aside>';
  }

  function empty() {
    return '<div class="container">' + c.crumbs([{ label: t('crumb.shop'), href: '#/shop' }, { label: t('cart.title') }]) +
      '<div class="empty">' +
        '<div class="empty-text"><p class="kicker">' + esc(t('empty.kicker')) + '</p><h1>' + esc(t('empty.title')) + '</h1>' +
          '<p class="empty-lead">' + esc(t('empty.text')) + '</p>' +
          '<div class="empty-cta"><a class="btn" href="#/shop">' + esc(t('empty.go')) + '</a>' +
          '<a class="btn btn--ghost" href="#/" data-scroll="popular" data-here>' + esc(t('empty.popular')) + '</a></div></div>' +
        '<div class="empty-art tex-card has-bloom" aria-hidden="true"><i class="orbit"></i><span class="empty-badge">' + c.badge('kits') + '</span></div>' +
      '</div></div>' +
      '<section class="section section--popular" id="popular" aria-labelledby="epop-h"><div class="container">' +
        '<header class="section-head"><div class="section-head-main"><i class="bar" aria-hidden="true"></i><h2 id="epop-h">' + esc(t('pop.title')) + '</h2></div></header></div>' +
        '<div class="container container--cards"><div class="card-row">' +
          ['gold-vip', 'starter-kit', 'resource-crate', 'hooded-skin-pack'].map(function (s) { return c.card(c.product(s)); }).join('') +
        '</div></div></section>';
  }

  NRL.cartForm = form;
  NRL.pages.cart = {
    render: function (root) {
      var rows = lines();
      if (!rows.length) { root.innerHTML = empty(); return; }
      var n = rows.length;
      root.innerHTML = '<div class="container">' + c.crumbs([{ label: t('crumb.shop'), href: '#/shop' }, { label: t('cart.title') }]) +
        '<div class="title-row title-row--cart"><h1>' + esc(t('cart.title')) + '</h1><p class="cart-count-label">' + esc(t('cart.count', { n: n })) + '</p></div>' +
        (S.get('signedIn') ? '' : guestBanner()) +
        '<div class="cart-body"><div class="cart-main"><ul class="cart-items">' + rows.map(item).join('') + '</ul>' +
          '<a class="btn btn--ghost" href="#/shop">' + esc(t('cart.continue')) + '</a>' + after() + '</div>' + summary(rows) + '</div></div>';
    }
  };
})();
