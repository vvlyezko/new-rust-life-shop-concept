/* Shared UI: header, mobile menu, footer, toasts, global event handling. Loaded last; it starts the app. */
(function () {
  'use strict';
  var NRL = window.NRL;
  var S = NRL.state;
  var t = NRL.i18n.t;
  var c = NRL.c;
  var esc = c.esc;

  var accountOpen = false;
  var menuOpen = false;

  /* ---------- Header ---------- */
  var NAV = [
    { key: 'shop',    href: '#/shop', routes: ['shop', 'product'] },
    { key: 'server',  href: '#/',     scroll: 'server' },
    { key: 'rules',   href: '#',      stub: true },
    { key: 'discord', href: '#/',     scroll: 'discord' }
  ];

  function navLinkAttrs(n, route) {
    var attrs = ' href="' + n.href + '"';
    if (n.routes && n.routes.indexOf(route) !== -1) attrs += ' aria-current="page"';
    if (n.scroll) attrs += ' data-scroll="' + n.scroll + '"';
    if (n.stub) attrs += ' data-stub';
    return attrs;
  }

  function navHTML() {
    var route = NRL.router.current().name;
    return NAV.map(function (n) {
      return '<li><a' + navLinkAttrs(n, route) + '>' + esc(t('nav.' + n.key)) + '</a></li>';
    }).join('');
  }

  function langButtons(suffix) {
    var lang = S.get('lang');
    return ['en', 'ru'].map(function (l) {
      return '<button type="button" class="lang-btn" lang="' + l + '" data-action="set-lang" data-lang="' + l +
        '" data-focus="lang-' + l + (suffix || '') + '" aria-pressed="' + (lang === l) + '" aria-label="' + (l === 'en' ? 'English' : 'Русский') + '">' +
        l.toUpperCase() + '</button>';
    }).join('');
  }

  function menuHTML() {
    var route = NRL.router.current().name;
    var signed = S.get('signedIn');
    return '<div class="mobile-menu" id="mobile-menu" role="dialog" aria-modal="true" aria-label="' + esc(t('nav.label')) + '">' +
      '<nav aria-label="' + esc(t('nav.label')) + '"><ul>' +
      NAV.map(function (n) {
        return '<li><a' + navLinkAttrs(n, route) + '><span>' + esc(t('nav.' + n.key)) + '</span><span class="menu-arrow" aria-hidden="true">→</span></a></li>';
      }).join('') + '</ul></nav>' +
      '<div class="menu-lang"><span class="label">' + esc(t('menu.language')) + '</span>' +
        '<div class="lang-switch lang-switch--menu" role="group" aria-label="' + esc(t('header.language')) + '">' + langButtons('-menu') + '</div></div>' +
      '<div class="menu-bottom">' +
        (signed
          ? '<button type="button" class="btn btn--secondary btn--block btn--lg" data-action="sign-out">' + esc(t('header.signOut')) + '</button>'
          : '<button type="button" class="btn btn--block btn--lg" data-action="sign-in">' + esc(t('header.signIn')) + '</button>') +
      '</div></div>';
  }

  function headerHTML() {
    var signed = S.get('signedIn');
    var count = S.cartCount();

    var balance = signed
      ? '<div class="balance"><span class="balance-label">' + esc(t('header.balance')) + '</span><span class="balance-value">$12.50</span></div>'
      : '';

    var account = signed
      ? '<div class="profile-wrap">' +
          '<button type="button" class="profile-btn" data-action="toggle-account" data-focus="account" aria-expanded="' + accountOpen + '" aria-controls="account-menu" aria-label="' + esc(t('header.account')) + ': Wastelander_77">' +
            '<span class="avatar" aria-hidden="true">W</span>' +
            '<span class="profile-text"><span class="profile-name">Wastelander_77</span><span class="profile-sub">' + esc(t('header.steamSignedIn')) + '</span></span>' +
            '<span class="chevron" aria-hidden="true"></span>' +
          '</button>' +
          (accountOpen
            ? '<div class="profile-menu" id="account-menu"><button type="button" data-action="sign-out" data-focus="sign-out">' + esc(t('header.signOut')) + '</button></div>'
            : '') +
        '</div>'
      : '<button type="button" class="btn signin-btn" data-action="sign-in" data-focus="sign-in">' + esc(t('header.signIn')) + '</button>';

    return '<header class="site-header' + (menuOpen ? ' is-menu-open' : '') + '"><div class="header-inner">' +
      '<div class="header-left">' +
        '<button type="button" class="icon-btn burger' + (menuOpen ? ' is-open' : '') + '" data-action="toggle-menu" data-focus="burger" aria-label="' + esc(t(menuOpen ? 'menu.close' : 'header.menu')) + '" aria-expanded="' + menuOpen + '" aria-controls="mobile-menu">' +
          (menuOpen ? c.closeIcon() : '<span></span><span></span><span></span>') + '</button>' +
        '<a class="logo" href="#/"><img class="logo-mark" src="assets/svg/mark.svg" alt="" width="52" height="52"><span class="logo-text"><span class="logo-new">NEW</span> RUST LIFE</span></a>' +
      '</div>' +
      '<nav class="main-nav" aria-label="' + esc(t('nav.label')) + '"><ul>' + navHTML() + '</ul></nav>' +
      '<div class="header-actions">' +
        '<div class="lang-switch" role="group" aria-label="' + esc(t('header.language')) + '">' + langButtons('') + '</div>' +
        balance +
        '<a class="cart-btn" href="#/cart" aria-label="' + esc(t('header.cart')) + (count ? ': ' + count : '') + '">' + c.cartIcon() +
          '<span class="cart-count" aria-hidden="true"' + (count ? '' : ' hidden') + '>' + count + '</span></a>' +
        account +
      '</div>' +
    '</div></header>' + (menuOpen ? menuHTML() : '');
  }

  /* ---------- Footer ---------- */
  var CATS = ['privileges', 'kits', 'resources', 'cosmetics', 'services'];

  function stubLink(key) {
    return '<li><a href="#" data-stub>' + esc(t(key)) + '</a></li>';
  }

  function footerHTML() {
    return '<footer class="site-footer"><div class="footer-inner">' +
      '<div class="footer-cols">' +
        '<div class="footer-brand">' +
          '<a class="footer-logo" href="#/"><img src="assets/svg/mark.svg" alt="" width="48" height="48"><span class="logo-text"><span class="logo-new">NEW</span> RUST LIFE</span></a>' +
          '<p class="footer-tagline">' + esc(t('footer.tagline')) + '</p>' +
        '</div>' +
        '<nav class="footer-col" aria-labelledby="f-shop"><h2 id="f-shop">' + esc(t('footer.shop')) + '</h2><ul class="footer-col">' +
          CATS.map(function (k) { return '<li><a href="#/shop?cat=' + k + '">' + esc(t('footer.cat.' + k)) + '</a></li>'; }).join('') +
        '</ul></nav>' +
        '<nav class="footer-col" aria-labelledby="f-info"><h2 id="f-info">' + esc(t('footer.info')) + '</h2><ul class="footer-col">' +
          stubLink('footer.payment') + stubLink('footer.storeRules') + stubLink('footer.privacy') + stubLink('footer.refunds') +
        '</ul></nav>' +
        '<div class="footer-col footer-col--contact"><h2>' + esc(t('footer.contact')) + '</h2><ul class="footer-col">' +
          '<li><a href="mailto:' + esc(t('footer.email')) + '">' + esc(t('footer.email')) + '</a></li>' +
          '<li class="footer-pair"><a href="#/" data-scroll="discord">' + esc(t('footer.discord')) + '</a><span class="sep" aria-hidden="true">·</span><a href="#" data-stub>' + esc(t('footer.serverRules')) + '</a></li>' +
        '</ul></div>' +
        '<div class="footer-col footer-col--pay"><h2>' + esc(t('footer.accept')) + '</h2>' +
          '<div class="pay-chips"><span class="pay-chip">' + esc(t('footer.card')) + '</span><span class="pay-chip">' + esc(t('footer.paypal')) + '</span></div>' +
          '<p class="footer-note">' + esc(t('footer.delivery')) + '</p>' +
        '</div>' +
      '</div>' +
      '<hr class="footer-rule">' +
      '<div class="footer-bottom"><p class="footer-legal">' + esc(t('footer.legal')) + '</p><p class="footer-credit">' + esc(t('footer.credit')) + '</p></div>' +
    '</div></footer>';
  }

  /* ---------- Rendering ---------- */
  function renderChrome() {
    var active = document.activeElement;
    var focusId = active && active.getAttribute && active.getAttribute('data-focus');
    document.getElementById('site-header').innerHTML = headerHTML();
    document.getElementById('site-footer').innerHTML = footerHTML();
    document.body.style.overflow = menuOpen ? 'hidden' : '';
    /* While the menu is open only the header and the menu are reachable */
    ['main', 'site-footer'].forEach(function (id) {
      var n = document.getElementById(id);
      if (menuOpen) n.setAttribute('inert', ''); else n.removeAttribute('inert');
    });
    if (focusId) {
      var el = document.querySelector('[data-focus="' + focusId + '"]');
      if (el) el.focus();
    }
  }

  function toast(msg) {
    var box = document.getElementById('toasts');
    var el = document.createElement('div');
    el.className = 'toast';
    el.textContent = msg;
    box.appendChild(el);
    window.setTimeout(function () { if (el.parentNode) el.parentNode.removeChild(el); }, 2600);
  }

  function announceCart() {
    document.getElementById('cart-live').textContent = t('header.cart') + ': ' + S.cartCount();
  }

  function closeMenu() {
    if (!menuOpen) return;
    menuOpen = false;
    renderChrome();
  }

  NRL.ui = { toast: toast, renderChrome: renderChrome, closeMenu: closeMenu };

  /* ---------- Events ---------- */
  document.addEventListener('click', function (e) {
    var skip = e.target.closest('#skip-link');
    if (skip) {
      e.preventDefault();
      var main = document.getElementById('main');
      main.focus();
      main.scrollIntoView({ block: 'start' });
      return;
    }

    var stub = e.target.closest('[data-stub]');
    if (stub) { e.preventDefault(); closeMenu(); toast(t('toast.stub')); return; }

    var scroller = e.target.closest('[data-scroll]');
    if (scroller) {
      e.preventDefault();
      var target = scroller.getAttribute('data-scroll');
      closeMenu();
      if (scroller.hasAttribute('data-here')) {
        var here = document.getElementById(target);
        if (here) here.scrollIntoView({ block: 'start' });
      } else {
        NRL.router.go('/', { scroll: target });
      }
      return;
    }

    var link = e.target.closest('#mobile-menu a');
    if (link) { closeMenu(); return; }

    var act = e.target.closest('[data-action]');
    if (act) {
      var name = act.getAttribute('data-action');
      if (name === 'set-lang') S.set('lang', act.getAttribute('data-lang'));
      else if (name === 'sign-in') S.set('signedIn', true);
      else if (name === 'sign-out') { accountOpen = false; menuOpen = false; S.set('signedIn', false); }
      else if (name === 'toggle-account') { accountOpen = !accountOpen; renderChrome(); }
      else if (name === 'toggle-menu') {
        menuOpen = !menuOpen;
        if (menuOpen) window.scrollTo(0, 0);
        renderChrome();
      }
      return;
    }

    if (accountOpen && !e.target.closest('.profile-wrap')) { accountOpen = false; renderChrome(); }
  });

  /* Focus trap: Tab cycles through the burger and the menu controls */
  function trapTab(e) {
    var items = Array.prototype.slice.call(document.querySelectorAll('[data-focus="burger"], #mobile-menu a, #mobile-menu button'));
    if (!items.length) return;
    var i = items.indexOf(document.activeElement);
    var next = e.shiftKey ? (i <= 0 ? items.length - 1 : i - 1) : (i === -1 || i === items.length - 1 ? 0 : i + 1);
    e.preventDefault();
    items[next].focus();
  }

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Tab' && menuOpen) { trapTab(e); return; }
    if (e.key !== 'Escape') return;
    if (menuOpen) {
      menuOpen = false;
      renderChrome();
      var burger = document.querySelector('[data-focus="burger"]');
      if (burger) burger.focus();
    } else if (accountOpen) {
      accountOpen = false;
      renderChrome();
      var btn = document.querySelector('[data-focus="account"]');
      if (btn) btn.focus();
    }
  });

  /* The menu only exists below 1200px: close it if the window grows past that */
  if (window.matchMedia) {
    window.matchMedia('(min-width: 1200px)').addEventListener('change', function (m) { if (m.matches) closeMenu(); });
  }

  S.subscribe(function (key) {
    if (key === 'lang') NRL.i18n.syncDocument();
    renderChrome();
    if (key === 'cart') announceCart();
    NRL.router.refresh();
  });

  NRL.router.onChange(function (route, changed) { if (changed) { menuOpen = false; renderChrome(); } });

  /* ---------- Start ---------- */
  NRL.i18n.syncDocument();
  renderChrome();
  NRL.router.start();
})();
