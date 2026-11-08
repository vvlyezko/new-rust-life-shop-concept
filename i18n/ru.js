(function () {
  'use strict';
  var NRL = (window.NRL = window.NRL || {});
  NRL.dict = NRL.dict || {};

  /* Source: the "(RU)" frames in Figma (05 · Desktop · RU, 06 · Mobile · RU). Strings marked "not in Figma"
     are system labels or states that no frame shows; they are written in the same tone and need the owner's OK.
     Counts use plural forms { one, few, many, other }. */
  NRL.dict.ru = {
    'meta.title': 'NEW RUST LIFE — магазин Rust-сервера',   // not in Figma
    'a11y.skip': 'К содержимому',                            // not in Figma
    'toast.stub': 'В демо этой страницы нет.',               // not in Figma
    'shop.empty': 'В этой категории пока пусто. Загляните в другую.',   // not in Figma
    'toast.added': 'Добавлено в корзину',                    // not in Figma
    'toast.removed': 'Убрано из корзины',                    // not in Figma
    'toast.ipCopied': 'IP скопирован',                       // not in Figma
    'toast.promoOk': 'Код применён: −10%',                   // not in Figma
    'dialog.title': 'Заказ оформлен',                        // not in Figma
    'dialog.text': 'Это демо, деньги не списаны.',           // not in Figma
    'dialog.ok': 'Вернуться в магазин',                      // not in Figma

    'nav.label': 'Главное меню',                             // not in Figma
    'nav.shop': 'Магазин',
    'nav.server': 'Сервер',
    'nav.rules': 'Правила',
    'nav.discord': 'Discord',

    'header.menu': 'Открыть меню',                           // not in Figma
    'header.language': 'Язык',                               // not in Figma
    'header.balance': 'Баланс',
    'header.cart': 'Корзина',                                // not in Figma
    'header.signIn': 'Войти через Steam',
    'header.steamSignedIn': 'Steam · вход выполнен',
    'header.account': 'Аккаунт',                             // not in Figma
    'header.signOut': 'Выйти',                               // not in Figma

    'footer.tagline': 'Rust-сервер для тех, кто читает график вайпов и всё равно получает рейд в три часа ночи.',
    'footer.shop': 'Магазин',
    'footer.cat.privileges': 'Привилегии',
    'footer.cat.kits': 'Наборы',
    'footer.cat.resources': 'Ресурсы',
    'footer.cat.cosmetics': 'Косметика',
    'footer.cat.services': 'Услуги',
    'footer.info': 'Информация',
    'footer.payment': 'Оплата и доставка',
    'footer.storeRules': 'Правила магазина',
    'footer.privacy': 'Политика конфиденциальности',
    'footer.refunds': 'Возвраты',
    'footer.contact': 'Контакты',
    'footer.email': 'support@nrl.example',
    'footer.discord': 'Discord',
    'footer.serverRules': 'Правила сервера',
    'footer.accept': 'Принимаем',
    'footer.card': 'Карта',
    'footer.paypal': 'PayPal',
    'footer.delivery': 'Доставка в игре в течение минуты после оплаты.',
    'footer.legal': '© 2026 NEW RUST LIFE. Фан-концепт магазина сервера. Не связан с Facepunch Studios и Rust.',
    'footer.credit': 'Design: Vlyezko Studio',

    /* Home: hero */
    'hero.eyebrow': 'Сервер Rust · Магазин',
    'hero.slogan': 'Остров добрым не будет. Твой набор — может.',
    'hero.lead': 'Привилегии, наборы и ресурсы — прямо в инвентарь. Заплатил один раз, забрал в игре.',
    'hero.connect': 'Подключиться',
    'hero.toShop': 'В магазин',
    'hero.hint': '«Подключиться» копирует play.nrl.example:28015 в буфер обмена.',
    'hero.emblemAlt': 'Эмблема NEW RUST LIFE',                // not in Figma

    /* Server status */
    'status.next': 'До вайпа',
    'status.days': 'Дней',
    'status.hrs': 'Час',
    'status.min': 'Мин',
    'status.online': 'Онлайн',
    'status.map': 'Карта',
    'status.mapName': 'Процедурная',
    'status.mapSize': 'размер 3500',
    'status.last': 'Прошлый вайп',
    'status.ip': 'IP сервера',
    'status.copy': 'Копировать IP',
    'status.time': '19:00 UTC',
    'months': 'янв,фев,мар,апр,мая,июн,июл,авг,сен,окт,ноя,дек',
    'date.fmt': '{d} {m}',

    /* Home: sections */
    'cat.title': 'Категории',
    'cat.lead': 'Пять способов потратить деньги в игре, где ты всё равно всё потеряешь.',
    'cat.privileges': 'Привилегии',
    'cat.kits': 'Наборы',
    'cat.resources': 'Ресурсы',
    'cat.cosmetics': 'Косметика',
    'cat.services': 'Услуги',
    'cat.privileges.desc': 'VIP-ранги. Очередь без очереди, ежедневный набор и тег, который выдаёт, что ты заплатил.',
    'cat.kits.desc': 'Готовые комплекты. Крафтить один и тот же костюм дважды — пустая трата жизни.',
    'cat.resources.desc': 'Дерево, камень, металл, сера. Скучная часть — с доставкой.',
    'cat.cosmetics.desc': 'Скины пули не остановят, зато красиво смотрятся, пока ты не умер.',
    'cat.services.desc': 'Смена ника, доп. слоты и другие мелкие дела.',
    'cat.from': {
      one: 'От {price} · {n} товар', few: 'От {price} · {n} товара',
      many: 'От {price} · {n} товаров', other: 'От {price} · {n} товара'
    },
    'pop.title': 'Сейчас покупают',
    'pop.all': 'Смотреть всё →',
    'how.title': 'Как это работает',
    'how.lead': 'Три шага. Вики читать не нужно, обучающего острова не будет.',
    'how.1.title': 'Войди через Steam',
    'how.1.text': 'Один клик. Мы получаем только твой Steam ID — пароль никогда.',
    'how.2.title': 'Оплати',
    'how.2.text': 'Картой или через PayPal — как больше доверяешь. Цены в долларах США.',
    'how.3.title': 'Забери в игре',
    'how.3.text': 'Покупка падает в инвентарь в течение минуты. Что с ней делать дальше — твоя проблема.',
    'com.kicker': 'Сообщество',
    'com.title': 'Заходи в Discord',
    'com.text': 'Новости вайпов, розыгрыши и место, где можно пожаловаться на рейдеров. 2,4 тыс. участников, 310 сейчас онлайн.',
    'com.join': 'Вступить в Discord',

    /* Shop */
    'crumb.label': 'Навигационная цепочка',                  // not in Figma
    'crumb.home': 'Главная',
    'crumb.shop': 'Магазин',
    'shop.title': 'Магазин',
    'shop.lead': 'Всё, что остров не отдаёт бесплатно. Доставка в игре — обычно раньше, чем ты закончишь ругаться.',
    'shop.categories': 'Категории',
    'shop.all': 'Все товары',
    'shop.showing': 'Показано {n} из {total}',
    'shop.sortBy': 'Сортировка',
    'sort.popular': 'Популярные',
    'sort.priceUp': 'Цена ↑',
    'sort.priceDown': 'Цена ↓',
    'shop.loadMore': 'Показать ещё',
    'shop.shown': 'Показано {n} из {total}',

    /* Product card */
    'card.add': 'В корзину',
    'card.inCart': 'В корзине · Убрать',
    'card.option': 'Выбери вариант',                         // not in Figma
    'tag.hit': 'Хит',
    'tag.sale': 'Скидка −{pct}%',
    'tag.inCart': 'В корзине',

    /* Product page */
    'prod.chooseDuration': 'Выбери срок',
    'prod.chooseQuantity': 'Выбери количество',              // not in Figma
    'prod.bestValue': 'Выгодно',
    'prod.delivered': 'Доставка в игре в течение минуты.',
    'prod.included': 'Что входит',
    'prod.how': 'Как получить в игре',
    'prod.related': 'Ещё может пригодиться',

    /* Cart */
    'cart.title': 'Корзина',
    'cart.count': {
      one: '{n} товар', few: '{n} товара', many: '{n} товаров', other: '{n} товара'
    },
    'cart.warnTitle': 'Ты не вошёл через Steam.',
    'cart.warnText': 'Нам нужен твой Steam ID, чтобы доставить товар. Сначала вход, потом оплата.',
    'cart.remove': 'Удалить',
    'cart.qtyMinus': 'Уменьшить количество',                 // not in Figma
    'cart.qtyPlus': 'Увеличить количество',                  // not in Figma
    'cart.continue': '← Продолжить покупки',
    'cart.meta': '{label} · {price}',
    'cart.metaEach': '{label} · {price} за шт.',
    'cart.metaSale': '{per} · со скидкой {price}',
    'cart.after': 'Что будет после оплаты',
    'cart.s1': 'Проверяем Steam ID',
    'cart.s1t': 'Привязываем заказ к твоему аккаунту.',
    'cart.s2': 'Оплата подтверждена',
    'cart.s2t': 'Картой или PayPal — обычно мгновенно.',
    'cart.s3': 'Товары в игре',
    'cart.s3t': 'В инвентаре в течение минуты.',
    'cart.stuck': 'Что-то застряло? Пиши на support@nrl.example или в канал #support в Discord.',
    'cart.summary': 'Ваш заказ',
    'cart.promo': 'Промокод',
    'cart.promoPlaceholder': 'Введи промокод',
    'cart.apply': 'Применить',
    'cart.subtotal': 'Сумма',
    'cart.total': 'Итого',
    'cart.method': 'Способ оплаты',
    'cart.card': 'Карта',
    'cart.cardNote': 'Дебетовая или кредитная карта',
    'cart.paypal': 'PayPal',
    'cart.paypalNote': 'Оплата с баланса PayPal',
    'cart.agree': 'Я согласен с правилами магазина и политикой возвратов.',
    'cart.pay': 'Оплатить {amount}',
    'cart.promoError': 'Код не найден. Даже ящик с лутом пожимает плечами.',   // not in Figma
    'cart.noteLocked': 'Войди через Steam и согласись с правилами, чтобы оплатить.',
    'cart.noteReady': 'Доставим Wastelander_77 в течение минуты. Безопасная оплата, данные карты мы не храним.',
    'empty.kicker': '0 товаров',
    'empty.title': 'Корзина пуста',
    'empty.text': 'Пусто. Даже на острове лута больше. Выбери что-нибудь, пока вайп не выбрал за тебя.',
    'empty.go': 'В магазин',
    'empty.popular': 'Популярное ↓',

    /* Mobile menu */
    'menu.language': 'Язык',
    'menu.close': 'Закрыть меню'                             // not in Figma
  };
})();
