/* Interactions: cart, options, promo, payment demo, copy IP, shop sort / load more, live server status.
   One delegated listener per event type; pages only render markup with data-action attributes. */
(function () {
  'use strict';
  var NRL = window.NRL;
  var S = NRL.state;
  var c = NRL.c;
  var t = c.t;
  var IP = 'play.nrl.example:28015';
  var PROMO = 'WASTELAND10';
  var MAX_QTY = 99;

  function toast(key) { NRL.ui.toast(t(key)); }

  /* ---------- Cart ---------- */
  function addToCart(slug) {
    var p = c.product(slug);
    if (!p || c.inCart(slug)) return;
    S.set('cart', S.get('cart').concat([{ slug: slug, opt: c.optIndex(p), qty: 1 }]));
    toast('toast.added');
  }

  function removeFromCart(slug) {
    S.set('cart', S.get('cart').filter(function (l) { return l.slug !== slug; }));
    toast('toast.removed');
  }

  function removeLine(slug, opt) {
    S.set('cart', S.get('cart').filter(function (l) { return !(l.slug === slug && l.opt === opt); }));
  }

  function changeQty(slug, opt, d) {
    S.set('cart', S.get('cart').map(function (l) {
      if (l.slug !== slug || l.opt !== opt) return l;
      return { slug: l.slug, opt: l.opt, qty: Math.max(1, Math.min(MAX_QTY, l.qty + d)) };
    }));
  }

  /* Picking a term on a card that is already in the cart changes that cart line too, so card and cart never disagree */
  function chooseTerm(slug, opt) {
    c.setOpt(slug, opt);
    if (c.inCart(slug)) {
      S.set('cart', S.get('cart').map(function (l) { return l.slug === slug ? { slug: l.slug, opt: opt, qty: l.qty } : l; }));
    } else {
      NRL.router.refresh();
    }
  }

  /* ---------- Promo ---------- */
  function applyPromo() {
    var input = document.getElementById('promo');
    var form = NRL.cartForm;
    form.promo = input ? input.value.trim() : '';
    form.applied = form.promo.toUpperCase() === PROMO;
    form.error = !form.applied;
    NRL.router.refresh();
    if (form.applied) toast('toast.promoOk');
    if (form.error) { var f = document.getElementById('promo'); if (f) f.focus(); }
  }

  /* ---------- Copy IP ---------- */
  function copyFallback() {
    var ta = document.createElement('textarea');
    ta.value = IP;
    ta.setAttribute('readonly', '');
    ta.style.cssText = 'position:fixed;left:-9999px;top:0';
    document.body.appendChild(ta);
    ta.select();
    var ok = false;
    try { ok = document.execCommand('copy'); } catch (e) { ok = false; }
    document.body.removeChild(ta);
    return ok;
  }

  function copyIp() {
    var done = function () { toast('toast.ipCopied'); };
    if (navigator.clipboard && navigator.clipboard.writeText) {
      navigator.clipboard.writeText(IP).then(done, function () { if (copyFallback()) done(); });
    } else if (copyFallback()) {
      done();
    }
  }

  /* ---------- Order dialog (demo) ---------- */
  var dialog = null;

  function openDialog() {
    if (dialog) return;
    var overlay = document.createElement('div');
    overlay.className = 'overlay';
    overlay.innerHTML = '<div class="dialog" role="dialog" aria-modal="true" aria-labelledby="dlg-h" aria-describedby="dlg-t">' +
      '<h2 id="dlg-h">' + c.esc(t('dialog.title')) + '</h2><p id="dlg-t">' + c.esc(t('dialog.text')) + '</p>' +
      '<button type="button" class="btn btn--lg" data-action="dialog-ok">' + c.esc(t('dialog.ok')) + '</button></div>';
    document.body.appendChild(overlay);
    ['site-header', 'main', 'site-footer'].forEach(function (id) { document.getElementById(id).setAttribute('inert', ''); });
    dialog = overlay;
    overlay.querySelector('button').focus();
  }

  function closeDialog(goShop) {
    if (!dialog) return;
    document.body.removeChild(dialog);
    dialog = null;
    ['site-header', 'main', 'site-footer'].forEach(function (id) { document.getElementById(id).removeAttribute('inert'); });
    var form = NRL.cartForm;
    form.promo = ''; form.applied = false; form.error = false; form.agree = false;
    S.set('cart', []);
    if (goShop) {
      NRL.router.go('/shop');
    } else {
      var h1 = document.querySelector('#main h1');
      if (h1) { h1.setAttribute('tabindex', '-1'); h1.focus(); }
    }
  }

  /* ---------- Clicks ---------- */
  document.addEventListener('click', function (e) {
    var el = e.target.closest('[data-action]');
    if (!el) return;
    var a = el.getAttribute('data-action');
    var slug = el.getAttribute('data-slug');
    var opt = parseInt(el.getAttribute('data-opt'), 10);

    if (a === 'term') chooseTerm(slug, opt);
    else if (a === 'add') addToCart(slug);
    else if (a === 'remove') removeFromCart(slug);
    else if (a === 'remove-line') removeLine(slug, opt);
    else if (a === 'qty') { if (!(el.getAttribute('aria-disabled') === 'true' && el.getAttribute('data-d') === '-1')) changeQty(slug, opt, parseInt(el.getAttribute('data-d'), 10)); }
    else if (a === 'apply-promo') applyPromo();
    else if (a === 'pay') { if (!el.disabled) openDialog(); }
    else if (a === 'dialog-ok') closeDialog(true);
    else if (a === 'copy-ip' || a === 'connect') copyIp();
    else if (a === 'sort') { NRL.shop.setSort(el.getAttribute('data-sort')); NRL.router.refresh(); }
    else if (a === 'load-more') {
      var before = document.querySelectorAll('.grid-3 .card').length;
      NRL.shop.more();
      NRL.router.refresh();
      var cards = document.querySelectorAll('.grid-3 .card');
      var first = cards[before] && cards[before].querySelector('.card-title a');
      if (first) first.focus({ preventScroll: false });
    }
  });

  document.addEventListener('change', function (e) {
    var el = e.target;
    var a = el.getAttribute && el.getAttribute('data-action');
    if (a === 'agree') { NRL.cartForm.agree = el.checked; NRL.router.refresh(); }
    else if (a === 'method') { NRL.cartForm.method = el.value; NRL.router.refresh(); }
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Enter' && e.target && e.target.id === 'promo') { e.preventDefault(); applyPromo(); return; }
    if (!dialog) return;
    if (e.key === 'Escape') { e.preventDefault(); closeDialog(false); }
    else if (e.key === 'Tab') { e.preventDefault(); dialog.querySelector('button').focus(); } // one control: focus stays on it
  });

  /* ---------- Live server status (the bar animates only under no-preference, see blocks.css) ---------- */
  window.setInterval(function () { c.tickCountdown(); }, 60000);
  window.setInterval(function () { c.walkOnline(); }, 15000);
  document.addEventListener('visibilitychange', function () { if (!document.hidden) c.tickCountdown(); });
})();
