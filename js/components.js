/* Shared building blocks used by several pages: badge, product card, status plate, icons, breadcrumbs.
   Everything returns an HTML string. All dynamic text goes through esc(). */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  var S = NRL.state;

  function t(key, vars) { return NRL.i18n.t(key, vars); }
  function esc(s) {
    return String(s).replace(/[&<>"']/g, function (ch) {
      return { '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[ch];
    });
  }
  /* Pick the current language from a { en, ru } object; fall back to EN */
  function txt(o) {
    if (o === undefined || o === null) return '';
    if (typeof o === 'string') return o;
    return o[S.get('lang')] || o.en || '';
  }
  function money(n) { return '$' + n.toFixed(2); }

  /* ---------- Icons (24×24, stroke 1.9, round caps) ---------- */
  var PATHS = {
    vip: 'M3 18h18M4 18L3 8l5 4 4-7 4 7 5-4-1 10',
    kit: 'M3 7l9-4 9 4v10l-9 4-9-4zM3 7l9 4 9-4M12 11v10',
    resources: 'M2 20l2.5-5h7L14 20zM10 20l2.5-5h7L22 20zM6 14l2.5-5h7L18 14z',
    cosmetics: 'M12 3c-4 0-7 3-7 7v11l3-3 2 3 2-3 2 3 2-3 3 3V10c0-4-3-7-7-7zM9.5 10h.01M14.5 10h.01',
    server: 'M3 5h18v6H3zM3 13h18v6H3zM7 8h.01M7 16h.01M11 8h6M11 16h6',
    queue: 'M4 7h16M4 12h12M4 17h8',
    tag: 'M3 12l9-9h8v8l-9 9zM16 8h.01',
    home: 'M3 11l9-8 9 8M5 10v10h14V10',
    chat: 'M4 5h16v11H9l-5 4z',
    warning: 'M12 3l10 18H2zM12 10v5M12 18h.01',
    check: 'M5 12l5 5 9-10',
    lock: 'M6 11h12v9H6zM8 11V8a4 4 0 0 1 8 0v3'
  };
  var SVG_OPEN = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.9" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false">';
  function icon(name) { return SVG_OPEN + '<path d="' + PATHS[name] + '"/></svg>'; }
  function cartIcon() {
    return SVG_OPEN + '<path d="M3 4h2.5l2 11h10.5l2-8H6.3"/>' +
      '<circle cx="9.5" cy="19.5" r="1.3" fill="currentColor" stroke="none"/>' +
      '<circle cx="17" cy="19.5" r="1.3" fill="currentColor" stroke="none"/></svg>';
  }
  function closeIcon() {
    return '<svg viewBox="0 0 20 20" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" aria-hidden="true" focusable="false"><path d="M4 4L16 16M16 4L4 16"/></svg>';
  }

  /* ---------- Badge: exported artwork, drawn at size `px` ---------- */
  function badge(cat, px) {
    return '<span class="badge"' + (px ? ' style="--s:' + px + 'px"' : '') + ' aria-hidden="true"><img src="assets/svg/badge-' +
      NRL.badgeFile[cat] + '.svg" alt="" width="180" height="180"></span>';
  }

  /* ---------- Catalogue helpers ---------- */
  function product(slug) {
    for (var i = 0; i < NRL.products.length; i++) if (NRL.products[i].slug === slug) return NRL.products[i];
    return null;
  }
  var chosen = {}; // option picked on a card or product page, per slug (not persisted)
  function optIndex(p) { return chosen[p.slug] !== undefined ? chosen[p.slug] : p.opt; }
  function setOpt(slug, i) { chosen[slug] = i; }
  function inCart(slug) { return S.get('cart').some(function (l) { return l.slug === slug; }); }
  function salePct(o) { return o.old ? Math.round(100 - (o.price / o.old) * 100) : 0; }
  function catStats(cat) {
    var min = Infinity, n = 0;
    NRL.products.forEach(function (p) {
      if (p.cat !== cat) return;
      n++;
      p.options.forEach(function (o) { if (o.price < min) min = o.price; });
    });
    return { n: n, from: min };
  }

  /* ---------- Tag chip ---------- */
  function tagHTML(p, cart) {
    var o = p.options[optIndex(p)];
    if (cart) return '<span class="tag tag--cart">' + esc(t('tag.inCart')) + '</span>';
    if (p.tag === 'hit') return '<span class="tag tag--hit">' + esc(t('tag.hit')) + '</span>';
    if (p.tag === 'sale') return '<span class="tag tag--sale">' + esc(t('tag.sale', { pct: salePct(o) })) + '</span>';
    return '';
  }

  function priceHTML(p, cls) {
    var o = p.options[optIndex(p)];
    return '<div class="' + (cls || 'card-price') + '"><span class="price">' + money(o.price) + '</span>' +
      (o.old ? '<s class="price-old">' + money(o.old) + '</s>' : '') +
      '<span class="price-per">' + esc(txt(o.per)) + '</span></div>';
  }

  /* ---------- Product card ---------- */
  function card(p) {
    var cart = inCart(p.slug);
    var sel = optIndex(p);
    var terms = p.options.map(function (o, i) {
      return '<button type="button" class="term" data-action="term" data-slug="' + p.slug + '" data-opt="' + i + '" aria-pressed="' + (i === sel) + '">' + esc(txt(o.label)) + '</button>';
    }).join('');
    return '<article class="card' + (cart ? ' card--in-cart' : '') + ' tex-card" data-slug="' + p.slug + '">' +
      '<div class="card-top"><a class="card-badge" href="#/product/' + p.slug + '" tabindex="-1" aria-hidden="true">' + badge(p.cat, 104) + '</a>' + tagHTML(p, cart) + '</div>' +
      '<h3 class="card-title"><a href="#/product/' + p.slug + '">' + esc(txt(p.title)) + '</a></h3>' +
      '<p class="card-desc">' + esc(txt(p.desc)) + '</p>' +
      '<div class="terms" role="group" aria-label="' + esc(t('card.option')) + '">' + terms + '</div>' +
      '<hr class="card-rule">' +
      priceHTML(p, 'card-price') +
      (cart
        ? '<button type="button" class="btn btn--secondary btn--block" data-action="remove" data-slug="' + p.slug + '">' + esc(t('card.inCart')) + '</button>'
        : '<button type="button" class="btn btn--block" data-action="add" data-slug="' + p.slug + '">' + esc(t('card.add')) + '</button>') +
    '</article>';
  }

  /* ---------- Breadcrumbs: [{ label, href? }], the last one is the current page ---------- */
  function crumbs(list) {
    return '<nav class="crumbs" aria-label="' + esc(t('crumb.label')) + '"><ol>' +
      list.map(function (c, i) {
        var last = i === list.length - 1;
        return '<li>' + (c.href && !last ? '<a href="' + c.href + '">' + esc(c.label) + '</a>' : '<span' + (last ? ' aria-current="page"' : '') + '>' + esc(c.label) + '</span>') + '</li>';
      }).join('') + '</ol></nav>';
  }

  /* ---------- Wipe schedule: first Thursday of the month, 19:00 UTC ---------- */
  function firstThursday(y, m) {
    var d = new Date(Date.UTC(y, m, 1, 19, 0, 0));
    d.setUTCDate(1 + ((4 - d.getUTCDay() + 7) % 7));
    return d;
  }
  function nextWipe(now) {
    var y = now.getUTCFullYear(), m = now.getUTCMonth();
    var w = firstThursday(y, m);
    if (w <= now) { m++; if (m > 11) { m = 0; y++; } w = firstThursday(y, m); }
    return w;
  }
  function lastWipe(now) {
    var y = now.getUTCFullYear(), m = now.getUTCMonth();
    var w = firstThursday(y, m);
    if (w > now) { m--; if (m < 0) { m = 11; y--; } w = firstThursday(y, m); }
    return w;
  }
  function dateLabel(d) {
    return t('date.fmt', { m: t('months').split(',')[d.getUTCMonth()], d: d.getUTCDate() }).toUpperCase();
  }
  function pad2(n) { return (n < 10 ? '0' : '') + n; }

  /* ---------- Server status plate ---------- */
  var online = 87, MAX_ONLINE = 150; // online players: a gentle random walk, kept while the page is open

  function countdown(now) {
    var ms = Math.max(0, nextWipe(now) - now);
    return { days: Math.floor(ms / 86400000), hrs: Math.floor(ms / 3600000) % 24, min: Math.floor(ms / 60000) % 60 };
  }

  /* Called every minute: update the numbers and dates in place, no re-render */
  function tickCountdown() {
    var plates = document.querySelectorAll('.status .cd-plate');
    if (plates.length !== 3) return;
    var now = new Date(), cd = countdown(now);
    plates[0].textContent = pad2(cd.days);
    plates[1].textContent = pad2(cd.hrs);
    plates[2].textContent = pad2(cd.min);
    var next = document.querySelector('.status .status-wipe .status-sub');
    if (next) next.textContent = dateLabel(nextWipe(now)) + ' · ' + t('status.time');
    var last = document.querySelector('.status .status-last .status-big');
    if (last) last.textContent = dateLabel(lastWipe(now));
  }

  /* Called every 15 s: ±2 players, clamped; the bar follows */
  function walkOnline() {
    online = Math.max(60, Math.min(MAX_ONLINE, online + Math.floor(Math.random() * 5) - 2));
    var big = document.querySelector('.status .status-big--lg');
    var bar = document.querySelector('.status .track');
    if (big) big.textContent = online + ' / ' + MAX_ONLINE;
    if (bar) {
      bar.setAttribute('aria-label', online + ' / ' + MAX_ONLINE);
      bar.firstElementChild.style.width = (online / MAX_ONLINE * 100).toFixed(1) + '%';
    }
  }

  function status() {
    var now = new Date();
    var next = nextWipe(now), last = lastWipe(now);
    var cd = countdown(now), days = cd.days, hrs = cd.hrs, min = cd.min, max = MAX_ONLINE;
    function unit(key, v) {
      return '<div class="cd-unit"><div class="cd-plate">' + v + '</div><span class="cd-label">' + esc(t('status.' + key)) + '</span></div>';
    }
    return '<section class="status tex-card has-bloom has-rivets" id="server" aria-label="' + esc(t('status.online')) + '">' +
      '<div class="status-wipe"><p class="label">' + esc(t('status.next')) + '</p>' +
        '<div class="countdown">' + unit('days', pad2(days)) + unit('hrs', pad2(hrs)) + unit('min', pad2(min)) + '</div>' +
        '<p class="status-sub">' + esc(dateLabel(next)) + ' · ' + esc(t('status.time')) + '</p></div>' +
      '<hr class="status-div">' +
      '<div class="status-online"><p class="label"><i class="dot" aria-hidden="true"></i>' + esc(t('status.online')) + '</p>' +
        '<p class="status-big status-big--lg">' + online + ' / ' + max + '</p>' +
        '<div class="track" role="img" aria-label="' + online + ' / ' + max + '"><i style="width:' + (online / max * 100).toFixed(1) + '%"></i></div></div>' +
      '<hr class="status-div">' +
      '<div class="status-map"><p class="label">' + esc(t('status.map')) + '</p><p class="status-big">' + esc(t('status.mapName')) + '</p><p class="status-sub">' + esc(t('status.mapSize')) + '</p></div>' +
      '<hr class="status-div status-div--mid">' +
      '<div class="status-last"><p class="label">' + esc(t('status.last')) + '</p><p class="status-big">' + esc(dateLabel(last)) + '</p><p class="status-sub">' + esc(t('status.time')) + '</p></div>' +
      '<hr class="status-div">' +
      '<div class="status-ip"><p class="label">' + esc(t('status.ip')) + '</p>' +
        '<div class="ip-row"><code class="ip">play.nrl.example:28015</code><button type="button" class="btn btn--secondary" data-action="copy-ip">' + esc(t('status.copy')) + '</button></div></div>' +
    '</section>';
  }

  /* ---------- Section head: accent bar + title (+ optional lead / aside) ---------- */
  function sectionHead(title, lead, aside) {
    return '<header class="section-head"><div class="section-head-main"><i class="bar" aria-hidden="true"></i>' +
      '<h2>' + esc(title) + '</h2></div>' +
      (lead ? '<p class="section-lead">' + esc(lead) + '</p>' : '') + (aside || '') + '</header>';
  }

  NRL.c = {
    t: t, esc: esc, txt: txt, money: money, icon: icon, cartIcon: cartIcon, closeIcon: closeIcon,
    badge: badge, product: product, optIndex: optIndex, setOpt: setOpt, inCart: inCart, salePct: salePct,
    catStats: catStats, tagHTML: tagHTML, priceHTML: priceHTML, card: card, crumbs: crumbs, status: status,
    sectionHead: sectionHead, tickCountdown: tickCountdown, walkOnline: walkOnline
  };
})();
