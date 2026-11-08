/* Home: hero, server status, categories, popular, how it works, Discord */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.pages = NRL.pages || {};
  var c = NRL.c, t = c.t, esc = c.esc;

  function hero() {
    return '<section class="hero" aria-labelledby="hero-h">' +
      '<div class="hero-bg" aria-hidden="true"><i class="hero-glow"></i><i class="hero-scratches"></i><i class="hero-vignette"></i></div>' +
      '<div class="hero-inner">' +
        '<h1 class="sr-only" id="hero-h">NEW RUST LIFE</h1>' +
        '<div class="hero-stage">' +
          '<div class="hero-left"><span class="hero-new" aria-hidden="true">NEW</span><span class="hero-word hero-rust" aria-hidden="true"><span class="grain-text">RUST</span></span></div>' +
          '<img class="hero-emblem" src="assets/svg/emblem.svg" alt="' + esc(t('hero.emblemAlt')) + '" width="470" height="470">' +
          '<div class="hero-right"><p class="eyebrow"><i aria-hidden="true"></i>' + esc(t('hero.eyebrow')) + '<i aria-hidden="true"></i></p>' +
            '<span class="hero-word hero-life" aria-hidden="true"><span class="grain-text">LIFE</span></span></div>' +
        '</div>' +
        '<div class="hero-copy">' +
          '<p class="hero-slogan">' + esc(t('hero.slogan')) + '</p>' +
          '<p class="hero-lead">' + esc(t('hero.lead')) + '</p>' +
          '<div class="hero-cta"><button type="button" class="btn" data-action="connect">' + esc(t('hero.connect')) + '</button>' +
            '<a class="btn btn--secondary" href="#/shop">' + esc(t('hero.toShop')) + '</a></div>' +
          '<p class="hero-hint">' + esc(t('hero.hint')) + '</p>' +
        '</div>' +
        c.status() +
      '</div></section>';
  }

  function categories() {
    function catCard(cat, mod) {
      var st = c.catStats(cat);
      return '<a class="cat-card cat-card--' + mod + ' tex-card has-bloom has-rivets" href="#/shop?cat=' + cat + '">' +
        c.badge(cat) +
        '<span class="cat-text"><h3>' + esc(t('cat.' + cat)) + '</h3>' +
        '<p class="cat-desc">' + esc(t('cat.' + cat + '.desc')) + '</p>' +
        '<span class="cat-from">' + esc(t('cat.from', { price: c.money(st.from), n: st.n })) + '</span></span></a>';
    }
    return '<section class="section section--cats" aria-labelledby="cats-h"><div class="container">' +
      '<header class="section-head"><div class="section-head-main"><i class="bar" aria-hidden="true"></i><h2 id="cats-h">' + esc(t('cat.title')) + '</h2></div>' +
      '<p class="section-lead">' + esc(t('cat.lead')) + '</p></header>' +
      '<div class="cat-grid">' +
        '<div class="cat-row cat-row--1">' + catCard('privileges', 'wide') + catCard('kits', 'mid') + '</div>' +
        '<div class="cat-row cat-row--2">' + catCard('resources', 'sm') + catCard('cosmetics', 'sm') + catCard('services', 'sm') + '</div>' +
      '</div></div></section>';
  }

  function popular() {
    var slugs = ['gold-vip', 'starter-kit', 'resource-crate', 'hooded-skin-pack'];
    return '<section class="section section--popular" aria-labelledby="pop-h"><div class="container">' +
      '<header class="section-head"><div class="section-head-main"><i class="bar" aria-hidden="true"></i><h2 id="pop-h">' + esc(t('pop.title')) + '</h2></div>' +
      '<a class="btn btn--ghost section-aside" href="#/shop">' + esc(t('pop.all')) + '</a></header></div>' +
      '<div class="container container--cards"><div class="card-row">' +
        slugs.map(function (s) { return c.card(c.product(s)); }).join('') +
      '</div></div></section>';
  }

  function how() {
    var items = [1, 2, 3].map(function (n) {
      return '<li class="step step--' + n + '"><span class="step-num" aria-hidden="true">0' + n + '</span>' +
        '<div class="step-text"><h3>' + esc(t('how.' + n + '.title')) + '</h3><p>' + esc(t('how.' + n + '.text')) + '</p></div></li>';
    }).join('');
    return '<section class="section section--how" aria-labelledby="how-h"><div class="container how-grid">' +
      '<div class="how-intro"><i class="bar" aria-hidden="true"></i><h2 id="how-h">' + esc(t('how.title')) + '</h2>' +
      '<p class="section-lead">' + esc(t('how.lead')) + '</p></div>' +
      '<ol class="steps">' + items + '</ol></div></section>';
  }

  function community() {
    return '<section class="section section--community" id="discord" aria-labelledby="com-h"><div class="container">' +
      '<div class="discord tex-card has-bloom">' +
        '<i class="discord-glow" aria-hidden="true"></i>' +
        '<img class="discord-emblem" src="assets/svg/emblem.svg" alt="" aria-hidden="true" width="440" height="440">' +
        '<div class="discord-text">' +
          '<p class="kicker">' + esc(t('com.kicker')) + '</p>' +
          '<h2 id="com-h">' + esc(t('com.title')) + '</h2>' +
          '<p class="discord-lead">' + esc(t('com.text')) + '</p>' +
          '<a class="btn" href="#" data-stub>' + esc(t('com.join')) + '</a>' +
        '</div></div></div></section>';
  }

  NRL.pages.home = {
    render: function (root) {
      root.innerHTML = hero() + categories() + popular() + how() + community();
    }
  };
})();
