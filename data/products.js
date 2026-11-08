/* Static catalogue. The first nine items come from the Figma catalogue frame in the same order;
   the other six are added in the same tone so "Load more" has something to load.
   Texts are { en, ru }: RU from the (RU) Figma frames, and for the six added items and the generic
   "what's included" lists written here in the same tone (marked "not in Figma").
   Prices are USD. `old` is the pre-sale price; the sale badge shows the real discount. */
(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});

  NRL.categories = ['privileges', 'kits', 'resources', 'cosmetics', 'services'];

  /* Which badge artwork each category uses */
  NRL.badgeFile = {
    privileges: 'vip', kits: 'kit', resources: 'resources', cosmetics: 'cosmetics', services: 'services'
  };

  function L(en, ru) { return { en: en, ru: ru }; }
  /* label and per are [en, ru] pairs */
  function opt(label, price, per, extra) {
    var o = { label: L(label[0], label[1]), price: price, per: L(per[0], per[1]) };
    if (extra) for (var k in extra) o[k] = extra[k];
    return o;
  }

  var D7 = ['7 days', '7 дней'], D30 = ['30 days', '30 дней'], D90 = ['90 days', '90 дней'];
  var P7 = ['/ 7 days', '/ 7 дней'], P30 = ['/ 30 days', '/ 30 дней'], P90 = ['/ 90 days', '/ 90 дней'];
  var K1 = ['1 kit', '1 набор'], K3 = ['3 kits', '3 набора'];
  var PK1 = ['/ 1 kit', '/ 1 набор'], PK3 = ['/ 3 kits', '/ 3 набора'];
  var S1 = ['1 pack', '1 набор'], S3 = ['3 packs', '3 набора'];
  var PS1 = ['/ 1 pack', '/ 1 набор'], PS3 = ['/ 3 packs', '/ 3 набора'];

  NRL.products = [
    {
      slug: 'gold-vip', cat: 'privileges', tag: 'hit', kind: L('VIP rank', 'VIP-ранг'), optionKind: 'duration', opt: 1,
      title: L('Gold VIP', 'Золотой VIP'),
      desc: L('Queue priority, a kit every 4 hours and a gold tag. Survival is still on you.',
              'Приоритет в очереди, набор каждые 4 часа и золотой тег. Выжить всё равно придётся самому.'),
      long: L('Skip the queue, collect a kit every four hours and wear a gold tag so everyone knows you paid. Survival is still on you; we only sell the head start.',
              'Пропускай очередь, получай набор каждые четыре часа и носи золотой тег, чтобы все знали: ты заплатил. Выживать всё равно тебе — мы продаём только фору.'),
      options: [opt(D7, 3.99, P7), opt(D30, 9.99, P30, { best: true }), opt(D90, 24.99, P90)],
      related: ['starter-kit', 'raider-kit', 'resource-crate', 'hooded-skin-pack'],
      included: [
        { icon: 'queue', title: L('Queue priority', 'Приоритет в очереди'), text: L('Skip the line. Up to three players ahead of you can wait.', 'Обгоняй очередь. Дождаться придётся максимум троих.') },
        { icon: 'kit',   title: L('Kit every 4 hours', 'Набор каждые 4 часа'), text: L('A rotating VIP kit: tools, medical supplies and ammo.', 'Меняющийся VIP-набор: инструменты, медицина и патроны.') },
        { icon: 'tag',   title: L('Gold chat tag', 'Золотой тег в чате'), text: L('A gold [VIP] tag next to your name. Vanity, but it counts.', 'Золотой [VIP] рядом с ником. Тщеславие, но оно считается.') },
        { icon: 'home',  title: L('3 extra home slots', '3 доп. слота /home'), text: L('More /home points for more places to hide.', 'Больше точек /home — больше мест, где спрятаться.') },
        { icon: 'chat',  title: L('Priority support', 'Приоритетная поддержка'), text: L('Your tickets go to the front of the queue on Discord.', 'Твои обращения в Discord идут вне очереди.') }
      ]
    },
    {
      slug: 'iron-vip', cat: 'privileges', tag: null, kind: L('VIP rank', 'VIP-ранг'), optionKind: 'duration', opt: 1,
      title: L('Iron VIP', 'Железный VIP'),
      desc: L('Entry-level privileges: a tag, a small kit and slightly shorter queues.',
              'Начальные привилегии: тег, небольшой набор и очередь чуть короче.'),
      options: [opt(D7, 1.99, P7), opt(D30, 4.99, P30, { best: true })]
    },
    {
      slug: 'starter-kit', cat: 'kits', tag: null, kind: L('Kit', 'Набор'), optionKind: 'quantity', opt: 0,
      title: L('Starter Kit', 'Стартовый набор'),
      desc: L('Armor, a rifle and enough bandages for one bad day.', 'Броня, винтовка и бинтов ровно на один плохой день.'),
      options: [opt(K1, 4.99, PK1), opt(K3, 12.99, PK3, { best: true })]
    },
    {
      slug: 'raider-kit', cat: 'kits', tag: null, kind: L('Kit', 'Набор'), optionKind: 'quantity', opt: 0,
      title: L('Raider Kit', 'Набор рейдера'),
      desc: L('Everything you need to ruin someone’s evening. Ethics not included.', 'Всё, чтобы испортить кому-то вечер. Совесть в комплект не входит.'),
      options: [opt(K1, 12.99, PK1), opt(K3, 34.99, PK3, { best: true })]
    },
    {
      slug: 'builder-kit', cat: 'kits', tag: null, kind: L('Kit', 'Набор'), optionKind: 'quantity', opt: 0,
      title: L('Builder Kit', 'Набор строителя'),
      desc: L('Tools and materials for a base that lasts until the first neighbour.', 'Инструменты и материалы для базы, которая простоит до первого соседа.'),
      options: [opt(K1, 7.99, PK1), opt(K3, 19.99, PK3, { best: true })]
    },
    {
      slug: 'resource-crate', cat: 'resources', tag: 'sale', kind: L('Crate', 'Ящик'), optionKind: 'quantity', opt: 0,
      title: L('Resource Crate', 'Ящик ресурсов'),
      desc: L('Wood, stone, metal and sulfur. The grind, skipped.', 'Дерево, камень, металл и сера. Гринд пропущен.'),
      options: [opt(['20K', '20K'], 6.99, ['/ 20k each', '/ по 20к'], { old: 9.99 }), opt(['50K', '50K'], 13.99, ['/ 50k each', '/ по 50к'], { old: 19.99, best: true })]
    },
    {
      slug: 'sulfur-pack', cat: 'resources', tag: null, kind: L('Pack', 'Пакет'), optionKind: 'quantity', opt: 0,
      title: L('Sulfur Pack', 'Набор серы'),
      desc: L('For people who always need more sulfur. That is everyone.', 'Для тех, кому вечно мало серы. То есть для всех.'),
      options: [opt(['10K', '10K'], 5.49, ['/ 10k', '/ 10к']), opt(['25K', '25K'], 11.99, ['/ 25k', '/ 25к'], { best: true })]
    },
    {
      slug: 'hooded-skin-pack', cat: 'cosmetics', tag: null, kind: L('Skin pack', 'Набор скинов'), optionKind: 'quantity', opt: 0,
      title: L('Hooded Skin Pack', 'Скины «Капюшон»'),
      desc: L('Three hoods for people who prefer not to be recognised.', 'Три капюшона для тех, кто не хочет, чтобы его узнавали.'),
      options: [opt(S1, 3.99, PS1), opt(S3, 9.99, PS3, { best: true })]
    },
    {
      slug: 'name-change', cat: 'services', tag: null, kind: L('Service', 'Услуга'), optionKind: 'quantity', opt: 0,
      title: L('Name Change', 'Смена ника'),
      desc: L('Fresh start, same loot. Your old name goes back in the pool.', 'Чистый лист, лут прежний. Старый ник вернётся в общий пул.'),
      options: [opt(['1x', '1X'], 1.99, ['/ once', '/ разово']), opt(['3x', '3X'], 4.99, ['/ 3 times', '/ 3 раза'], { best: true })]
    },

    /* Added for "Load more" (RU not in Figma) */
    {
      slug: 'silver-vip', cat: 'privileges', tag: null, kind: L('VIP rank', 'VIP-ранг'), optionKind: 'duration', opt: 1,
      title: L('Silver VIP', 'Серебряный VIP'),
      desc: L('The middle rank: shorter queues, a weekly kit and a silver tag.', 'Средний ранг: очередь короче, еженедельный набор и серебряный тег.'),
      options: [opt(D7, 2.99, P7), opt(D30, 6.99, P30, { best: true }), opt(D90, 17.99, P90)]
    },
    {
      slug: 'medic-kit', cat: 'kits', tag: null, kind: L('Kit', 'Набор'), optionKind: 'quantity', opt: 0,
      title: L('Medic Kit', 'Набор медика'),
      desc: L('Bandages, syringes and one very honest first-aid guide.', 'Бинты, шприцы и одна очень честная инструкция по первой помощи.'),
      options: [opt(K1, 3.49, PK1), opt(K3, 8.99, PK3, { best: true })]
    },
    {
      slug: 'farmer-kit', cat: 'kits', tag: null, kind: L('Kit', 'Набор'), optionKind: 'quantity', opt: 0,
      title: L('Farmer Kit', 'Набор фермера'),
      desc: L('Seeds, planters and the patience of someone about to be raided.', 'Семена, грядки и терпение человека, которого скоро разнесут.'),
      options: [opt(K1, 4.49, PK1), opt(K3, 11.99, PK3, { best: true })]
    },
    {
      slug: 'metal-pack', cat: 'resources', tag: null, kind: L('Pack', 'Пакет'), optionKind: 'quantity', opt: 0,
      title: L('Metal Pack', 'Набор металла'),
      desc: L('Metal fragments for walls that cost something to break.', 'Фрагменты металла для стен, которые не жалко ломать только врагу.'),
      options: [opt(['10K', '10K'], 4.99, ['/ 10k', '/ 10к']), opt(['25K', '25K'], 10.99, ['/ 25k', '/ 25к'], { best: true })]
    },
    {
      slug: 'camo-skin-pack', cat: 'cosmetics', tag: null, kind: L('Skin pack', 'Набор скинов'), optionKind: 'quantity', opt: 0,
      title: L('Camo Skin Pack', 'Скины «Камуфляж»'),
      desc: L('Three camo skins that make you hard to spot and easy to forget.', 'Три камуфляжных скина: тебя трудно заметить и легко забыть.'),
      options: [opt(S1, 2.99, PS1), opt(S3, 7.49, PS3, { best: true })]
    },
    {
      slug: 'reserved-slot', cat: 'services', tag: null, kind: L('Service', 'Услуга'), optionKind: 'duration', opt: 1,
      title: L('Reserved Slot', 'Резервный слот'),
      desc: L('A seat kept for you, even when the server is full.', 'Место, которое держат для тебя, даже когда сервер полон.'),
      options: [opt(D7, 2.49, P7), opt(D30, 5.99, P30, { best: true })]
    }
  ];

  /* What's included: per category, gold-vip has its own list above (RU here is not in Figma) */
  NRL.includedDefault = {
    privileges: [
      { icon: 'queue', title: L('Queue priority', 'Приоритет в очереди'), text: L('Skip the line when the server is full.', 'Проходи вперёд, когда сервер полон.') },
      { icon: 'tag',   title: L('Chat tag', 'Тег в чате'), text: L('A tag next to your name. Vanity, but it counts.', 'Тег рядом с ником. Тщеславие, но оно считается.') },
      { icon: 'kit',   title: L('Rank kit', 'Набор ранга'), text: L('A kit on a timer, delivered to your inventory.', 'Набор по таймеру, сразу в инвентарь.') }
    ],
    kits: [
      { icon: 'kit',    title: L('Ready-made loadout', 'Готовый комплект'), text: L('Everything in one drop. No crafting, no grinding.', 'Всё одним дропом. Без крафта и гринда.') },
      { icon: 'server', title: L('Instant delivery', 'Быстрая доставка'), text: L('It lands in your inventory within a minute of payment.', 'Падает в инвентарь в течение минуты после оплаты.') },
      { icon: 'check',  title: L('Stack it', 'Бери больше'), text: L('Buy more than one. They arrive one after another.', 'Можно купить несколько. Приходят один за другим.') }
    ],
    resources: [
      { icon: 'resources', title: L('Bulk materials', 'Материалы оптом'), text: L('Delivered in one go, ready to build with.', 'Всё сразу, можно строить.') },
      { icon: 'server',    title: L('Instant delivery', 'Быстрая доставка'), text: L('It lands in your inventory within a minute of payment.', 'Падает в инвентарь в течение минуты после оплаты.') },
      { icon: 'check',     title: L('No expiry', 'Без срока'), text: L('Keep it until you need it.', 'Храни, пока не понадобится.') }
    ],
    cosmetics: [
      { icon: 'cosmetics', title: L('Skin set', 'Набор скинов'), text: L('Applied to the matching items in your inventory.', 'Применяется к подходящим предметам в инвентаре.') },
      { icon: 'tag',       title: L('Cosmetic only', 'Только внешний вид'), text: L('No stats, no advantage. Just style.', 'Без характеристик и преимуществ. Только стиль.') },
      { icon: 'check',     title: L('Permanent', 'Навсегда'), text: L('It stays on your account after the wipe.', 'Остаётся на аккаунте и после вайпа.') }
    ],
    services: [
      { icon: 'chat',   title: L('Handled in-game', 'Всё в игре'), text: L('Applied automatically after payment.', 'Применяется автоматически после оплаты.') },
      { icon: 'server', title: L('No restart needed', 'Без перезапуска'), text: L('Done within a minute of payment.', 'Готово в течение минуты после оплаты.') },
      { icon: 'check',  title: L('One-time payment', 'Разовая оплата'), text: L('Pay once for the option you pick.', 'Платишь один раз за выбранный вариант.') }
    ]
  };

  /* Three decorative "loot" icons around the big badge on the product page */
  NRL.lootIcons = {
    privileges: ['queue', 'kit', 'tag'],
    kits: ['kit', 'server', 'home'],
    resources: ['resources', 'kit', 'tag'],
    cosmetics: ['cosmetics', 'tag', 'chat'],
    services: ['server', 'chat', 'tag']
  };

  /* "How to get it in game": the privileges steps are from Figma, the others follow them (RU not in Figma) */
  NRL.howSteps = {
    privileges: [
      L('Join the server at play.nrl.example:28015.', 'Зайди на сервер: play.nrl.example:28015.'),
      L('Your rank is applied automatically within a minute of payment.', 'Ранг применяется автоматически в течение минуты после оплаты.'),
      L('Type /kit in chat to open your kit menu. Offline? It waits for your next login.', 'Введи /kit в чате, чтобы открыть меню наборов. Не в сети? Набор дождётся следующего входа.')
    ],
    other: [
      L('Join the server at play.nrl.example:28015.', 'Зайди на сервер: play.nrl.example:28015.'),
      L('Your purchase is applied automatically within a minute of payment.', 'Покупка применяется автоматически в течение минуты после оплаты.'),
      L('Check your inventory. Offline? It waits for your next login.', 'Загляни в инвентарь. Не в сети? Всё дождётся следующего входа.')
    ]
  };
})();
