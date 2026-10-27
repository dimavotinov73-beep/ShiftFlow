/* OctoStore — витрина: роутинг, каталог, карточка товара, корзина. */
(function () {
  "use strict";

  const DATA = window.OCTO_CATALOG || { products: [] };
  const ART = window.OctoArt;
  const ORDER_URL = "https://t.me/VotinovDM"; // контакт для заказов
  const ORDER_USER = ORDER_URL.split("/").pop();
  const SOCIALS = { instagram: "https://www.instagram.com/octostore46", tiktok: "https://www.tiktok.com/@octostore46" };
  const PRODUCTS = DATA.products;
  const BY_ID = new Map(PRODUCTS.map((p) => [p.id, p]));
  const ADDRESS = "Москва, Багратионовский проезд, 7к3";
  const PAGE = 36;
  const darkMQ = window.matchMedia("(prefers-color-scheme: dark)");

  // ------------------------------------------------------------------
  // Категории сайта. hero — линейка, чьё фото показывается на плитке категории.
  // ------------------------------------------------------------------
  const CATS = [
    { id: "iphone", title: "iPhone", desc: "iPhone 18 Pro, 17 Pro, Air, 17e и предыдущие поколения — с eSIM и с физической SIM.", art: { kind: "phone", color: "Orange" }, hero: "iPhone 17 Pro Max" },
    { id: "samsung", title: "Samsung Galaxy", short: "Samsung", desc: "Флагманы Galaxy S26 и S25, складные Z Fold и Z Flip, Galaxy A.", art: { kind: "fold", color: "Cobalt Violet" }, hero: "Galaxy S26 Ultra" },
    { id: "android", title: "Android-смартфоны", short: "Android", desc: "Google Pixel, Xiaomi, REDMI, POCO, OnePlus, Nothing, HONOR, Huawei и другие.", art: { kind: "phone", color: "Sage" }, hero: "Google Pixel" },
    { id: "mac", title: "Mac и ноутбуки", short: "Mac", desc: "MacBook Air и Pro, MacBook Neo, iMac, Mac mini, Mac Studio и мониторы.", art: { kind: "laptop", color: "Sky Blue" }, hero: "MacBook Air 13" },
    { id: "tablets", title: "Планшеты", desc: "iPad Pro, iPad Air, iPad mini и iPad, Galaxy Tab, Xiaomi Pad и электронные книги.", art: { kind: "tablet", color: "Purple" }, hero: "iPad Air 11" },
    { id: "watch", title: "Часы и браслеты", short: "Часы", desc: "Apple Watch Ultra, Series и SE, Galaxy Watch, Pixel Watch, Garmin, фитнес-браслеты и умные кольца.", art: { kind: "watch", color: "Orange" }, hero: "Apple Watch Ultra" },
    { id: "audio", title: "Аудио и ТВ", short: "Аудио", desc: "AirPods, Beats, Galaxy Buds, наушники, колонки, умные колонки, телевизоры и медиаплееры.", art: { kind: "headphones", color: "Sky Blue" }, hero: "AirPods Pro" },
    { id: "gaming", title: "Игры и консоли", short: "Консоли", desc: "Игровые приставки и портативные консоли, геймпады, игры, VR и аксессуары.", art: { kind: "gamepad", color: "Cosmic Red" }, hero: "Приставки" },
    { id: "dyson", title: "Dyson", desc: "Стайлеры, фены, выпрямители, пылесосы, очистители воздуха и аксессуары Dyson.", art: { kind: "styler", color: "Ceramic Pink" }, hero: "Стайлеры" },
    { id: "home", title: "Для дома", desc: "Роботы-пылесосы, умный дом, свет, климат, кухня, красота и здоровье.", art: { kind: "vacuum", color: "White" }, hero: "Роботы-пылесосы" },
    { id: "gadgets", title: "Фото и гаджеты", short: "Гаджеты", desc: "Камеры моментальной печати, экшн-камеры, DJI, умные очки, трекеры, накопители и другие гаджеты.", art: { kind: "instant", color: "Candy Pink" }, hero: "Моментальная печать" },
    { id: "accessories", title: "Аксессуары", desc: "Чехлы и стёкла, зарядки и аккумуляторы, кабели, клавиатуры и мыши, MagSafe.", art: { kind: "charger", color: "White" }, hero: "Для iPhone" },
  ];
  const CAT = Object.fromEntries(CATS.map((c) => [c.id, c]));
  const SUBS = {};
  // Иллюстрация на случай, если у товара нет фото.
  const KIND = { iphone: "phone", samsung: "phone", android: "phone", mac: "laptop", tablets: "tablet", watch: "watch", audio: "headphones", gaming: "gamepad", dyson: "styler", home: "vacuum", gadgets: "camera", accessories: "accessory" };

  // Порядок линеек: новые модели — первыми.
  function subRank(cat, sub) {
    if (cat === "iphone") {
      if (sub === "iPhone Air") return -170 + 2;
      if (sub === "iPhone Duo") return -180 + 2;
      const m = /iPhone (\d+)(e?)\s*(.*)/.exec(sub) || [];
      const tier = m[2] ? 5 : { "Pro Max": 0, Pro: 1, Plus: 3, "": 4, mini: 5 }[(m[3] || "").trim()] ?? 6;
      return m[1] ? -(+m[1]) * 10 + tier : 0;
    }
    if (cat === "samsung") {
      const m = /Galaxy (S|Z Fold|Z Flip|A)(\d*)\s*(.*)/.exec(sub) || [];
      const fam = { S: 0, "Z Fold": 1, "Z Flip": 2, A: 3 }[m[1]] ?? 4;
      const tier = { Ultra: 0, "+": 1, Edge: 1, "": 2, FE: 3 }[(m[3] || "").trim()] ?? 4;
      return fam * 1000 - (+m[2] || 0) * 10 + tier;
    }
    return null;
  }

  // ------------------------------------------------------------------
  // Утилиты
  // ------------------------------------------------------------------
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => Array.from(r.querySelectorAll(s));
  const esc = (s) => String(s ?? "").replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const rub = (n) => n.toLocaleString("ru-RU").replace(/\s/g, " ") + " ₽";
  const plural = (n, a, b, c) => { const m10 = n % 10, m100 = n % 100; return m10 === 1 && m100 !== 11 ? a : m10 >= 2 && m10 <= 4 && (m100 < 10 || m100 >= 20) ? b : c; };
  const icon = (id, cls = "i") => `<svg class="${cls}"><use href="#i-${id}"/></svg>`;
  const updatedDate = DATA.updated ? new Date(DATA.updated + "T12:00:00") : null;
  const updatedText = updatedDate ? updatedDate.toLocaleDateString("ru-RU", { day: "numeric", month: "long", year: "numeric" }).replace(/\s?г\.$/, "") : "";
  const updatedShort = updatedDate ? updatedDate.toLocaleDateString("ru-RU") : "";
  const imgSrc = (p) => `assets/img/p/${p.img}`;
  // Дополнительные фото из галереи грузятся напрямую с CDN поставщика.
  const cdn = (path, size) => `https://images.biggeek.ru/1/${size}/${path}.webp`;

  function norm(s) {
    return String(s).toLowerCase().replace(/ё/g, "е").replace(/[«»"()]/g, " ").replace(/\s+/g, " ").trim();
  }

  // Синонимы для поиска: кириллица → как в названиях товаров.
  const SYN = [
    [/айфон|афон/g, "iphone"], [/макбук|макбук/g, "macbook"], [/аймак/g, "imac"], [/айпад/g, "ipad"], [/эйрподс|аирподс|airpods|подсы/g, "airpods"],
    [/эпл вотч|эппл вотч|вотч/g, "watch"], [/самсунг|галакси/g, "galaxy"], [/дайсон/g, "dyson"], [/плейстейшн|пс5|ps 5/g, "ps5"], [/плойк\S*/g, "стайлер"], [/эйр|эир/g, "air"], [/нео(\s|$)/g, "neo$1"],
    [/иксбокс|хбокс/g, "xbox"], [/нинтендо|свитч/g, "switch"], [/инстакс/g, "instax"], [/маршал+/g, "marshall"], [/алиса|яндекс/g, "яндекс"],
    [/стайлер\S*|эйрвреп\S*|airwrap/g, "стайлер"], [/фен\S*/g, "фен"], [/пылесос/g, "пылесос"], [/джойстик/g, "геймпад"], [/пиксел\S*|пиксель/g, "pixel"], [/сяоми|ксиоми/g, "xiaomi"], [/гармин/g, "garmin"],
    [/ про макс| promax| pro max/g, " pro max"], [/ про(\s|$)/g, " pro$1"], [/ макс(\s|$)/g, " max$1"],
  ];
  function searchTokens(q) {
    let s = " " + norm(q) + " ";
    for (const [re, to] of SYN) s = s.replace(re, to);
    return s.split(" ").filter(Boolean).map((t) => t.replace(/^(\d+)(gb|гб)$/, "$1 гб").replace(/^(\d+)(tb|тб)$/, "$1 тб").replace(/^(gb)$/, "гб").replace(/^(tb)$/, "тб")).flatMap((t) => t.split(" "));
  }
  const matches = (p, tokens) => tokens.every((t) => p._search.includes(t));
  function search(q, list = PRODUCTS) {
    const tokens = searchTokens(q);
    if (!tokens.length) return [];
    const nameScore = (p) => {
      const n = norm(p.name);
      let s = 0;
      const sub = norm(p.sub || "");
      tokens.forEach((t) => { if (n.startsWith(t)) s -= 3; if (n.includes(" " + t + " ") || n.endsWith(" " + t)) s -= 1; if (sub.includes(t)) s -= 2; });
      if (!/max/i.test(q) && /pro max/i.test(p.sub || "")) s += 1;
      return s;
    };
    return list.filter((p) => matches(p, tokens)).sort((a, b) => nameScore(a) - nameScore(b) || a._ord - b._ord);
  }

  // «Конфигурация» — название без линейки и цвета: «256 ГБ», «M5, 16 ГБ, 512 ГБ».
  function cfgOf(p) {
    let n = p.name;
    if (p.color && n.endsWith(p.color)) n = n.slice(0, -p.color.length);
    const sub = p.sub.replace(/^Apple /, "");
    const i = n.indexOf(sub);
    if (i >= 0 && i < 12) n = n.slice(i + sub.length);
    return n.replace(/^[\s,"″”-]+|[\s,]+$/g, "").replace(/\s+/g, " ") || p.name;
  }

  const FAMILIES = {
    black: ["Чёрный", "#1b1b1e"], white: ["Белый", "#f3f3f1"], silver: ["Серебристый / серый", "#c5c8ce"], blue: ["Синий / голубой", "#5a8ed8"],
    green: ["Зелёный", "#6fb987"], pink: ["Розовый", "#f4b6c6"], purple: ["Фиолетовый", "#9b7fd6"], gold: ["Золотой / бежевый", "#dcc08f"],
    orange: ["Оранжевый / жёлтый", "#f0a03a"], red: ["Красный", "#c8303a"],
  };
  const FAMILY_KW = [
    ["jet black", "black"], ["black", "black"], ["midnight", "black"], ["graphite", "black"], ["графит", "black"], ["черн", "black"], ["чёрн", "black"],
    ["red velvet", "red"], ["burgundy", "red"], ["малин", "red"], ["red", "red"],
    ["rose gold", "pink"], ["pink", "pink"], ["blush", "pink"], ["розов", "pink"], ["корал", "pink"],
    ["purple", "purple"], ["violet", "purple"], ["lavender", "purple"], ["lavander", "purple"], ["plum", "purple"], ["indigo", "purple"], ["фиолет", "purple"], ["лилов", "purple"],
    ["blue", "blue"], ["navy", "blue"], ["ultramarine", "blue"], ["glacier", "blue"], ["topaz", "blue"], ["син", "blue"],
    ["green", "green"], ["sage", "green"], ["mint", "green"], ["teal", "green"], ["pistachio", "green"], ["olive", "green"], ["зелен", "green"], ["мятн", "green"], ["изумруд", "green"], ["бирюз", "green"],
    ["orange", "orange"], ["yellow", "orange"], ["citrus", "orange"], ["оранж", "orange"],
    ["gold", "gold"], ["sand", "gold"], ["desert", "gold"], ["natural", "gold"], ["copper", "gold"], ["bronze", "gold"], ["apricot", "gold"], ["amber", "gold"], ["бежев", "gold"],
    ["white", "white"], ["starlight", "white"], ["cream", "white"], ["pearl", "white"], ["бел", "white"],
    ["silver", "silver"], ["gray", "silver"], ["grey", "silver"], ["nickel", "silver"], ["iron", "silver"], ["сер", "silver"], ["серебр", "silver"],
  ];
  function colorFamily(color) {
    if (!color) return null;
    const s = String(color).split("/")[0].toLowerCase();
    for (const [k, f] of FAMILY_KW) if (s.includes(k)) return f;
    return null;
  }

  // Индексы для поиска, фильтров и сортировки.
  function indexCatalog() {
    PRODUCTS.forEach((p, i) => {
      p._i = i;
      p.kind = KIND[p.cat];
      p._cfg = cfgOf(p);
      p._ver = p.ver || "";
      p._fam = colorFamily(p.colorEn) || colorFamily(p.color);
      p._search = norm([p.name, p.sub, p.brand, CAT[p.cat] && CAT[p.cat].title, p.color, p.colorEn, p.mem, p.ver].filter(Boolean).join(" "));
    });

    for (const p of PRODUCTS) {
      const list = (SUBS[p.cat] = SUBS[p.cat] || []);
      let s = list.find((x) => x.name === p.sub);
      if (!s) list.push((s = { name: p.sub, count: 0, min: Infinity, first: p._i }));
      s.count++;
      if (p.price != null) s.min = Math.min(s.min, p.price);
    }
    for (const [cat, list] of Object.entries(SUBS)) {
      // Линейки идут в порядке разделов источника, «Другое» — в конце.
      list.forEach((s) => (s.rank = subRank(cat, s.name) ?? s.first + (s.name === "Другое" ? 1e6 : 0)));
      list.sort((a, b) => a.rank - b.rank);
      list.forEach((s, i) => (s.order = i));
    }
    const subOrder = (p) => (SUBS[p.cat].find((s) => s.name === p.sub) || { order: 0 }).order;
    const catOrder = (p) => CATS.findIndex((c) => c.id === p.cat);
    // По умолчанию: категория → линейка → цена по возрастанию (позиции без цены — в конце линейки).
    const byPrice = PRODUCTS.slice().sort((a, b) => (a.price ?? 1e12) - (b.price ?? 1e12) || a._i - b._i);
    byPrice.forEach((p, i) => (p._pr = i));
    PRODUCTS.forEach((p) => (p._ord = catOrder(p) * 1e7 + subOrder(p) * 1e4 + p._pr));
  }

  // ------------------------------------------------------------------
  // Корзина
  // ------------------------------------------------------------------
  const store = {
    get(key, def) { try { const v = localStorage.getItem(key); return v ? JSON.parse(v) : def; } catch (e) { return def; } },
    set(key, val) { try { localStorage.setItem(key, JSON.stringify(val)); } catch (e) { /* приватный режим */ } },
  };
  let cart = store.get("octo-cart", {});
  for (const id of Object.keys(cart)) if (!BY_ID.has(id) || !(cart[id] > 0)) delete cart[id];

  const cartItems = () => Object.entries(cart).map(([id, qty]) => ({ p: BY_ID.get(id), qty }));
  const cartCount = () => Object.values(cart).reduce((a, b) => a + b, 0);
  const cartSum = () => cartItems().reduce((s, { p, qty }) => s + (p.price || 0) * qty, 0);

  function setQty(id, qty) {
    if (qty > 0) cart[id] = Math.min(qty, 99); else delete cart[id];
    store.set("octo-cart", cart);
    syncCart(id);
  }
  function syncCart(id) {
    const n = cartCount();
    $$("[data-cart-count]").forEach((el) => { el.textContent = n; el.hidden = !n; });
    $$("[data-cart-sum]").forEach((el) => (el.textContent = n ? rub(cartSum()) : "Корзина"));
    if (id) $$(`[data-buy="${CSS.escape(id)}"]`).forEach((el) => (el.innerHTML = buyInner(BY_ID.get(id), el.dataset.size)));
    if (route.name === "cart") renderCart();
  }

  // ------------------------------------------------------------------
  // Telegram
  // ------------------------------------------------------------------
  function productLine(p) {
    return p.name + (p.ver ? ` (${p.ver})` : "");
  }
  function tgLink(text) {
    return `${ORDER_URL}?text=${encodeURIComponent(text)}`;
  }
  function askText(p) {
    return `Здравствуйте! Интересует ${productLine(p)}${p.price != null ? ` — ${p.from ? "от " : ""}${rub(p.price)}` : ""}. Есть в наличии?`;
  }
  // Синхронное копирование — чтобы сразу после него открыть Telegram в том же жесте пользователя.
  function copySync(text) {
    const t = document.createElement("textarea");
    t.value = text; t.setAttribute("readonly", ""); t.style.position = "fixed"; t.style.opacity = "0";
    document.body.appendChild(t); t.select();
    let ok = false;
    try { ok = document.execCommand("copy"); } catch (e) { /* нет доступа к буферу */ }
    t.remove();
    return ok;
  }
  async function copy(text) {
    if (copySync(text)) return true;
    try { await navigator.clipboard.writeText(text); return true; } catch (e) { return false; }
  }

  // ------------------------------------------------------------------
  // Компоненты
  // ------------------------------------------------------------------
  const isDark = () => darkMQ.matches;
  function tileBg(p) { const [a, b] = ART.tint(p, isDark()); return `background:linear-gradient(160deg,${a},${b})`; }
  // Фото товара или (если фото нет) иллюстрация.
  function photo(p, opts = {}) {
    if (!p.img) return ART.art(p, opts);
    return `<img class="photo" src="${imgSrc(p)}" alt="${opts.label ? esc(opts.label) : ""}" loading="${opts.eager ? "eager" : "lazy"}" decoding="async">`;
  }
  const mediaStyle = (p) => (p.img ? "" : tileBg(p));

  function badges(p) {
    return p.ver && p.cat !== "accessories" ? `<span class="tag">${esc(shortVer(p.ver))}</span>` : "";
  }
  const shortVer = (v) => v.replace(/^SIM-карта:\s*/i, "").replace(/nano-SIM и eSIM/i, "SIM + eSIM").replace(/2 nano-SIM/i, "2 SIM");
  function chips(p) {
    const out = [];
    const sw = ART.resolve(p.colorEn) || ART.resolve(p.color);
    if (p.mem && p.cat !== "watch") out.push(`<span class="chip">${esc(p.mem)}</span>`);
    if (p.color && out.length < 2) out.push(`<span class="chip">${sw ? `<i class="swatch" style="background:${sw}"></i>` : ""}${esc(p.color.length > 18 ? p.color.slice(0, 17) + "…" : p.color)}</span>`);
    return out.join("");
  }
  function priceHtml(p) {
    return p.price != null ? `<span class="price">${p.from ? "<small>от</small> " : ""}${rub(p.price)}</span>` : `<span class="price price--ask">Цена по запросу</span>`;
  }
  function buyInner(p, size) {
    if (p.price == null) {
      return `<a class="${size === "lg" ? "btn btn--tg" : "add"}" href="${tgLink(askText(p))}" target="_blank" rel="noopener" title="Уточнить цену">${icon("telegram")}<span>${size === "lg" ? "Узнать цену" : "Цена"}</span></a>`;
    }
    const q = cart[p.id] || 0;
    if (q) {
      return `<span class="stepper${size === "lg" ? " stepper--lg" : ""}"><button type="button" data-dec="${esc(p.id)}" aria-label="Убрать одну штуку">${icon("minus")}</button><span>${q}</span><button type="button" data-inc="${esc(p.id)}" aria-label="Добавить ещё">${icon("plus")}</button></span>`;
    }
    return size === "lg"
      ? `<button type="button" class="btn btn--brand btn--block" data-add="${esc(p.id)}">${icon("cart")}В корзину</button>`
      : `<button type="button" class="add" data-add="${esc(p.id)}" aria-label="В корзину: ${esc(p.name)}">${icon("cart")}<span>Купить</span></button>`;
  }
  const buy = (p, size = "") => `<span class="buy" data-buy="${esc(p.id)}" data-size="${size}">${buyInner(p, size)}</span>`;

  function card(p) {
    return `<article class="pcard">
      <a class="pcard__media" href="#/product/${encodeURIComponent(p.id)}" style="${mediaStyle(p)}" tabindex="-1" aria-hidden="true">
        <span class="pcard__badges">${badges(p)}</span>${photo(p)}
      </a>
      <div class="pcard__body">
        <span class="pcard__sub">${esc(p.sub)}</span>
        <a class="pcard__name" href="#/product/${encodeURIComponent(p.id)}">${esc(p.name)}</a>
        <div class="chips">${chips(p)}</div>
        <div class="pcard__foot">${priceHtml(p)}${buy(p)}</div>
      </div>
    </article>`;
  }

  const crumbs = (items) => `<nav class="crumbs" aria-label="Навигация"><a href="#/">Главная</a>${items.map(([href, t]) => `${icon("chev")}${href ? `<a href="${href}">${esc(t)}</a>` : `<span>${esc(t)}</span>`}`).join("")}</nav>`;
  const minPrice = (list) => list.reduce((m, p) => (p.price != null && p.price < m ? p.price : m), Infinity);
  const catHref = (cat, sub) => `#/catalog/${cat}${sub ? "?sub=" + encodeURIComponent(sub) : ""}`;

  // ------------------------------------------------------------------
  // Шапка: категории, мега-меню, поиск
  // ------------------------------------------------------------------
  function initChrome() {
    $(".catnav__in").innerHTML = CATS.map((c) => `<a href="${catHref(c.id)}" data-cat="${c.id}">${esc(c.short || c.title)}</a>`).join("");
    $("#footerCats").innerHTML = CATS.map((c) => `<li><a href="${catHref(c.id)}">${esc(c.title)}</a></li>`).join("");
    $("#year").textContent = new Date().getFullYear();
    if (updatedText) $("#priceStamp").textContent = `Цены обновлены ${updatedText}. Наличие и стоимость уточняйте у менеджера.`;
    $$("[data-order-link], #tgOrder").forEach((a) => (a.href = ORDER_URL));

    // Мега-меню
    const mega = $("#mega"), btn = $("#catalogBtn");
    $("#megaCats").innerHTML =
      `<button class="icon-btn mega__close" type="button" data-close-mega aria-label="Закрыть">${icon("close")}</button>` +
      CATS.map((c) => {
        const n = PRODUCTS.filter((p) => p.cat === c.id).length;
        const h = catPhoto(c);
        return `<a class="mega__cat" href="${catHref(c.id)}" data-mega="${c.id}"><span class="ico">${h ? `<img src="${imgSrc(h)}" alt="" loading="lazy">` : ART.art(c.art)}</span><span>${esc(c.title)}</span><span>${n}</span></a>`;
      }).join("") +
      `<a class="mega__cat" href="#/catalog"><span class="ico">${icon("grid")}</span><span>Все товары</span><span>${PRODUCTS.length}</span></a>`;
    const showSubs = (id) => {
      const c = CAT[id];
      $$(".mega__cat").forEach((el) => el.classList.toggle("is-active", el.dataset.mega === id));
      const tops = SUBS[id].slice(0, 4).map((x) => [x.name, pickCheapest(x.name)]).filter((x) => x[1]);
      $("#megaSubs").innerHTML = `<h3>${esc(c.title)}</h3><p class="muted">${esc(c.desc)}</p>
        <div class="mega__grid">${SUBS[id].map((s) => `<a href="${catHref(id, s.name)}"><span>${esc(s.name)}</span><small>${s.count}</small></a>`).join("")}</div>
        ${tops.length ? `<div class="mega__photos">${tops.map(([n, p]) => `<a href="${catHref(id, n)}" title="${esc(n)}"><img src="${imgSrc(p)}" alt="${esc(n)}" loading="lazy"></a>`).join("")}</div>` : ""}`;
    };
    showSubs(CATS[0].id);
    $("#megaCats").addEventListener("mouseover", (e) => { const a = e.target.closest("[data-mega]"); if (a) showSubs(a.dataset.mega); });
    const toggle = (open) => {
      mega.hidden = !open;
      btn.setAttribute("aria-expanded", String(open));
      document.body.style.overflow = open && window.innerWidth <= 720 ? "hidden" : "";
    };
    btn.addEventListener("click", () => toggle(mega.hidden));
    mega.addEventListener("click", (e) => { if (e.target.closest("[data-close-mega], a")) toggle(false); });
    document.addEventListener("keydown", (e) => { if (e.key === "Escape") { toggle(false); closeSuggest(); closeFilters(); } });
    window.addEventListener("hashchange", () => toggle(false));

    // Поиск с подсказками
    const input = $("#searchInput"), box = $("#suggest");
    let active = -1, timer;
    const closeSuggest = () => { box.hidden = true; active = -1; };
    window.closeSuggest = closeSuggest;
    const renderSuggest = () => {
      const q = input.value.trim();
      if (q.length < 2) return closeSuggest();
      const found = search(q);
      const cats = CATS.filter((c) => searchTokens(q).every((t) => norm(c.title + " " + (c.short || "") + " " + c.desc).includes(t))).slice(0, 3);
      if (!found.length && !cats.length) {
        box.innerHTML = `<div class="suggest__empty">Ничего не нашли по запросу «${esc(q)}». <a href="${tgLink("Здравствуйте! Ищу: " + q)}" target="_blank" rel="noopener" style="color:var(--brand);font-weight:700">Спросить менеджера</a></div>`;
      } else {
        box.innerHTML =
          (cats.length ? `<div class="suggest__head">Категории</div>` + cats.map((c) => `<a class="suggest__item" href="${catHref(c.id)}"><span class="suggest__thumb" style="background:var(--surface-2)">${ART.art(c.art)}</span><span class="suggest__name">${esc(c.title)}<small>${PRODUCTS.filter((p) => p.cat === c.id).length} товаров</small></span></a>`).join("") : "") +
          (found.length ? `<div class="suggest__head">Товары</div>` + found.slice(0, 6).map((p) => `<a class="suggest__item" href="#/product/${encodeURIComponent(p.id)}"><span class="suggest__thumb" style="${mediaStyle(p)}">${photo(p)}</span><span class="suggest__name">${esc(p.name)}<small>${esc(p.ver ? shortVer(p.ver) : p.sub)}</small></span><span class="suggest__price">${p.price != null ? (p.from ? "от " : "") + rub(p.price) : "—"}</span></a>`).join("") : "") +
          (found.length > 6 ? `<a class="suggest__all" href="#/search?q=${encodeURIComponent(q)}">Показать все ${found.length} ${plural(found.length, "товар", "товара", "товаров")}</a>` : "");
      }
      box.hidden = false;
      active = -1;
    };
    input.addEventListener("input", () => { clearTimeout(timer); timer = setTimeout(renderSuggest, 120); });
    input.addEventListener("focus", () => input.value.trim().length >= 2 && renderSuggest());
    input.addEventListener("keydown", (e) => {
      const items = $$(".suggest__item, .suggest__all", box);
      if (box.hidden || !items.length || !["ArrowDown", "ArrowUp"].includes(e.key)) return;
      e.preventDefault();
      active = (active + (e.key === "ArrowDown" ? 1 : -1) + items.length) % items.length;
      items.forEach((el, i) => el.classList.toggle("is-active", i === active));
      items[active].scrollIntoView({ block: "nearest" });
    });
    $("#searchForm").addEventListener("submit", (e) => {
      e.preventDefault();
      const items = $$(".suggest__item, .suggest__all", box);
      if (!box.hidden && active >= 0 && items[active]) { location.hash = items[active].getAttribute("href"); }
      else if (input.value.trim()) location.hash = `#/search?q=${encodeURIComponent(input.value.trim())}`;
      closeSuggest();
      input.blur();
    });
    document.addEventListener("click", (e) => { if (!e.target.closest("#searchForm")) closeSuggest(); });
    box.addEventListener("click", (e) => { if (e.target.closest("a")) closeSuggest(); });
  }

  // ------------------------------------------------------------------
  // Роутер
  // ------------------------------------------------------------------
  let route = { name: "" };
  const app = $("#app");

  function parseHash() {
    const raw = location.hash.slice(1) || "/";
    const [pathAnchor, qs] = raw.split("?");
    const [path, anchor] = pathAnchor.split("#");
    return { parts: path.split("/").filter(Boolean), q: new URLSearchParams(qs || ""), anchor };
  }

  function render() {
    const { parts, q, anchor } = parseHash();
    const [a, b] = parts;
    let title = "OctoStore — техника Apple, Samsung, Dyson и Sony на Горбушке";
    closeFilters();
    if (!a) { route = { name: "home" }; renderHome(); }
    else if (a === "catalog" || a === "search") {
      const cat = a === "catalog" && b && CAT[b] ? b : null;
      route = { name: "catalog", cat, q, limit: PAGE };
      renderCatalog();
      title = (cat ? CAT[cat].title : q.get("q") ? `Поиск: ${q.get("q")}` : "Каталог") + " — OctoStore";
    } else if (a === "product" && BY_ID.has(decodeURIComponent(b || ""))) {
      const p = BY_ID.get(decodeURIComponent(b));
      route = { name: "product", p };
      renderProduct(p);
      title = `${p.name} — купить в OctoStore`;
    } else if (a === "cart") { route = { name: "cart" }; renderCart(); title = "Корзина — OctoStore"; }
    else if (INFO[a]) { route = { name: a }; app.innerHTML = INFO[a](); title = INFO_TITLES[a] + " — OctoStore"; }
    else { route = { name: "404" }; renderNotFound(); }
    document.title = title;
    const si = $("#searchInput");
    if (document.activeElement !== si) si.value = a === "search" ? q.get("q") || "" : "";
    $$(".catnav a").forEach((el) => el.classList.toggle("is-active", !!(route.cat === el.dataset.cat || (route.p && route.p.cat === el.dataset.cat))));
    $$(".tabbar a").forEach((el) => el.classList.toggle("is-active", el.dataset.tab === (route.name === "home" ? "home" : route.name === "catalog" || route.name === "product" ? "catalog" : route.name)));
    if (anchor && document.getElementById(anchor)) document.getElementById(anchor).scrollIntoView();
    else window.scrollTo(0, 0);
  }

  // ------------------------------------------------------------------
  // Главная
  // ------------------------------------------------------------------
  function pickCheapest(sub, filter) {
    return PRODUCTS.filter((p) => p.sub === sub && p.price != null && p.img && (!filter || filter(p))).sort((a, b) => a.price - b.price)[0];
  }
  // Один товар на линейку — чтобы подборки не состояли из вариантов одной модели.
  const picks = (list) => {
    const seen = new Set();
    return list.map(([s, f]) => pickCheapest(s, f)).filter((p) => p && !seen.has(p.sub + p.name.split(",")[0]) && seen.add(p.sub + p.name.split(",")[0]));
  };

  function renderHome() {
    const fresh = picks([
      ["iPhone 18 Pro Max"], ["iPhone 17 Pro"], ["iPhone Air"], ["Galaxy S26 Ultra"], ["Galaxy Z Fold8"], ["MacBook Neo"],
      ["MacBook Air 13"], ["iPad Pro 13"], ["Apple Watch Ultra"], ["AirPods Pro"], ["Google Pixel"], ["Стайлеры"],
    ]);
    const cheap = (p) => p.price <= 15000;
    const gifts = picks([
      ["AirPods", (p) => cheap(p) && /^Беспроводные наушники/.test(p.name)], ["Моментальная печать", (p) => cheap(p) && /камер|фотоаппарат/i.test(p.name)],
      ["Умные колонки", cheap], ["Геймпады", (p) => cheap(p) && /геймпад|контроллер/i.test(p.name)],
      ["Трекеры", cheap], ["Колонки", cheap], ["Galaxy Buds", cheap], ["Фитнес-браслеты", cheap], ["Беспроводные наушники", cheap],
      ["Клавиатуры и мыши", cheap], ["MagSafe", cheap], ["Электронные книги", cheap],
    ]);

    // Плитки-витрины рядом с главным блоком: самая доступная модель линейки.
    // Берём первую линейку из списка, у которой есть фото.
    const feature = (subs, cls, label) => {
      const sub = subs.find((x) => pickCheapest(x));
      const p = sub && pickCheapest(sub);
      if (!p) return "";
      const m = minPrice(PRODUCTS.filter((x) => x.sub === sub));
      return `<a class="btile ${cls}" href="${catHref(p.cat, sub)}"><small>${label}</small><h3>${esc(sub)}</h3><span class="price-from">от ${rub(m)}${icon("arrow")}</span><img src="${imgSrc(p)}" alt="${esc(sub)}" loading="eager"></a>`;
    };

    app.innerHTML = `
      <section class="hero"><div class="wrap"><div class="bento">
        <div class="bento__main">
          <div>
            <span class="hero__chip"><b>${updatedShort || "Новинки"}</b>Цены обновляются каждый день</span>
            <h1>Техника, которую <em>хочется</em></h1>
            <p class="hero__lead">iPhone, Mac, Samsung, Dyson и ещё тысячи гаджетов — в павильоне на Горбушке и с доставкой по Москве за 2 часа.</p>
            <div class="hero__cta">
              <a class="btn btn--light" href="#/catalog">${icon("grid")}Каталог</a>
              <a class="btn btn--glass" href="${ORDER_URL}" target="_blank" rel="noopener">${icon("telegram")}Написать менеджеру</a>
            </div>
          </div>
          <div class="hero__stats">
            <div><b>${PRODUCTS.length.toLocaleString("ru-RU")}</b><span>${plural(PRODUCTS.length, "товар", "товара", "товаров")} в каталоге</span></div>
            <div><b>2 часа</b><span>доставка по Москве</span></div>
            <div><b>12 мес.</b><span>гарантия на Apple</span></div>
          </div>
        </div>
        ${feature(["iPhone 18 Pro Max", "iPhone 18 Pro", "iPhone 17 Pro Max", "iPhone 17 Pro"], "btile--violet", "Новинка")}
        <div class="btile__row">
          ${feature(["MacBook Air 13", "MacBook Neo", "MacBook Air 15"], "btile--mint", "Ноутбуки")}
          ${feature(["AirPods Pro", "AirPods", "AirPods Max"], "btile--sand", "Аудио")}
        </div>
      </div></div></section>

      <section class="section"><div class="wrap">
        <div class="section__head"><div><h2 class="section__title">Категории</h2></div><a class="link-more" href="#/catalog">Все товары${icon("chev")}</a></div>
        <div class="shelf">
          ${CATS.map((c) => { const h = catPhoto(c); const n = PRODUCTS.filter((p) => p.cat === c.id).length; return `<a class="shelf__item" href="${catHref(c.id)}"><span class="shelf__img">${h ? `<img src="${imgSrc(h)}" alt="" loading="lazy">` : ART.art(c.art)}</span><span>${esc(c.short || c.title)}<small>${n.toLocaleString("ru-RU")}</small></span></a>`; }).join("")}
          <a class="shelf__item shelf__all" href="#/catalog"><span class="shelf__img">${icon("arrow")}</span><span>Все товары<small>${PRODUCTS.length.toLocaleString("ru-RU")}</small></span></a>
        </div>
      </div></section>

      <section class="section"><div class="wrap">
        <div class="section__head"><div><span class="eyebrow">${icon("spark")}Новинки</span><h2 class="section__title">Свежие модели</h2></div><a class="link-more" href="#/catalog">Смотреть всё${icon("chev")}</a></div>
        <div class="rail">${fresh.map(card).join("")}</div>
      </div></section>

      <section class="section" style="padding-top:8px"><div class="wrap"><div class="perks">
        ${perk("truck", "Доставка за 2 часа", "Курьером по Москве и области")}
        ${perk("plane", "Отправка в регионы", "СДЭК, Boxberry, Яндекс.Доставка")}
        ${perk("swap", "Trade-in", "Старое устройство в зачёт нового")}
        ${perk("wrench", "Ремонт", "Любой сложности — решим задачу")}
      </div></div></section>

      <section class="section"><div class="wrap">
        <div class="section__head"><div><span class="eyebrow">${icon("box")}Идеи для подарка</span><h2 class="section__title">До 15 000 ₽</h2></div><a class="link-more" href="#/catalog?max=15000">Все до 15 000 ₽${icon("chev")}</a></div>
        <div class="rail">${gifts.map(card).join("")}</div>
      </div></section>

      <section class="section"><div class="wrap duo">
        <div class="promo promo--trade">
          <div><span class="eyebrow">${icon("swap")}Trade-in</span><h3 style="margin-top:10px">Обновляйте технику с выгодой</h3><p>Сдайте своё устройство и получите его стоимость в зачёт новой покупки. Предварительно оценим по фото в Telegram.</p></div>
          <div><a class="btn btn--light" href="#/services">Как это работает${icon("arrow")}</a></div>
          <svg class="promo__ico"><use href="#i-swap"/></svg>
        </div>
        <div class="promo promo--repair">
          <div><span class="eyebrow">${icon("wrench")}Сервис</span><h3 style="margin-top:10px">Ремонт любой сложности</h3><p>Не включается, разбит экран или барахлит батарея — опишите проблему, и мы подскажем решение.</p></div>
          <div><a class="btn btn--glass" href="#/services#repair">Подробнее${icon("arrow")}</a></div>
          <svg class="promo__ico"><use href="#i-wrench"/></svg>
        </div>
      </div></section>

      <section class="section"><div class="wrap">
        <div class="section__head"><div><h2 class="section__title">Как сделать заказ</h2><p class="section__sub">Без регистрации — заказ уходит менеджеру в Telegram</p></div></div>
        <div class="steps steps--row">
          <div class="step"><div><b>Выберите товар</b><span>Найдите нужную модель, память и цвет в каталоге и добавьте в корзину.</span></div></div>
          <div class="step"><div><b>Отправьте заказ</b><span>Укажите способ получения — корзина сформирует сообщение для менеджера в Telegram.</span></div></div>
          <div class="step"><div><b>Подтвердим наличие</b><span>Менеджер сверит наличие и актуальную цену — они могут меняться в течение дня.</span></div></div>
          <div class="step"><div><b>Получите покупку</b><span>Самовывоз с Горбушки, курьер по Москве за 2 часа или отправка в регион.</span></div></div>
        </div>
      </div></section>

      <section class="section"><div class="wrap">${storeBlock()}</div></section>

      <section class="section"><div class="wrap">
        <div class="section__head"><h2 class="section__title">Частые вопросы</h2></div>
        ${faq()}
      </div></section>`;
  }

  // Фото для плитки категории: самый недорогой товар «главной» линейки.
  function catPhoto(c) {
    return pickCheapest(c.hero) || PRODUCTS.find((p) => p.cat === c.id && p.img);
  }

  const perk = (ico, title, text) => `<div class="perk"><span class="perk__ico">${icon(ico)}</span><div><b>${title}</b><span>${text}</span></div></div>`;

  function mapFrame() {
    return `<div class="map__ph">${icon("pin")}<b>Горбушкин Двор</b><span>Багратионовский проезд, 7к3</span></div><iframe src="https://yandex.ru/map-widget/v1/?mode=search&text=${encodeURIComponent(ADDRESS)}&z=16" title="OctoStore на карте" loading="lazy" allowfullscreen></iframe>`;
  }
  function mapLinks() {
    const q = encodeURIComponent(ADDRESS + ", Горбушкин Двор");
    return `<div class="map__links">
      <a class="btn btn--ghost btn--sm" href="https://yandex.ru/maps/?text=${q}" target="_blank" rel="noopener">${icon("pin")}Яндекс Карты</a>
      <a class="btn btn--ghost btn--sm" href="https://2gis.ru/moscow/search/${q}" target="_blank" rel="noopener">${icon("pin")}2ГИС</a>
      <a class="btn btn--ghost btn--sm" href="https://www.google.com/maps/search/?api=1&query=${q}" target="_blank" rel="noopener">${icon("pin")}Google Maps</a>
    </div>`;
  }
  function storeBlock() {
    return `<div class="store">
      <div class="store__text">
        <span class="eyebrow">${icon("store")}Магазин</span>
        <h2>Ждём в павильоне на Горбушке</h2>
        <div class="contact-row">${icon("pin")}<div><b>Багратионовский проезд, 7к3</b><span>ТК «Горбушкин Двор», 2 этаж, VIP-сектор, павильон Vip2-46 · м. Багратионовская</span></div></div>
        <div class="contact-row">${icon("clock")}<div><b>Ежедневно с 11:00 до 20:00</b><span>Наличие и цену лучше сверить за час до приезда</span></div></div>
        <div class="contact-row">${icon("telegram")}<div><b><a href="${ORDER_URL}" target="_blank" rel="noopener">@${esc(ORDER_USER)}</a></b><span>Заказы и консультации в Telegram</span></div></div>
        ${mapLinks()}
      </div>
      <div class="map">${mapFrame()}</div>
    </div>`;
  }

  function faq() {
    const qa = [
      ["Как оформить заказ?", `Добавьте товары в корзину и нажмите «Отправить заказ в Telegram» — откроется чат с менеджером @${esc(ORDER_USER)} с готовым текстом заказа. Можно и просто написать менеджеру, какая модель нужна.`],
      ["Цены на сайте актуальны?", `Цены обновляются автоматически каждый день${updatedText ? ` (последнее обновление — ${updatedText})` : ""}. Наличие и стоимость могут меняться в течение дня, поэтому менеджер подтвердит их перед покупкой.`],
      ["Что значат eSIM и nano-SIM у iPhone?", "eSIM — у модели нет слота под физическую SIM-карту, только электронные. nano-SIM и eSIM — один слот под обычную SIM-карту и поддержка eSIM. Нужный вариант выбирается на странице товара — у них разная цена."],
      ["Цена «от» — что это значит?", "У товара несколько вариантов (например, версии SIM или комплектации), и показана цена самого доступного. Точную цену нужного варианта назовёт менеджер."],
      ["Какая гарантия?", `12 месяцев — на устройства Apple (если не указано иное), 14 дней — на аксессуары и технику других брендов. На чехлы, плёнки и стёкла гарантия не действует, кроме явного брака при продаже. <a href="#/warranty" style="color:var(--brand);font-weight:700">Все условия</a>`],
      ["Отправляете в другие города?", "Да, через СДЭК, Boxberry и Яндекс.Доставку — только по 100% предоплате. По Москве доставляет наш курьер: в пределах ТТК и МКАД — от 500 ₽, за МКАД — от 1 000 ₽."],
    ];
    return `<div class="faq">${qa.map(([q, a], i) => `<details${i === 0 ? " open" : ""}><summary>${q}${icon("chev")}</summary><p>${a}</p></details>`).join("")}</div>`;
  }

  // ------------------------------------------------------------------
  // Каталог
  // ------------------------------------------------------------------
  const MEM_LABEL = { watch: "Размер корпуса", mac: "Накопитель (SSD)" };
  const memValue = (m) => { const x = /^(\d+)\s*(ГБ|ТБ|мм)/.exec(m || ""); return x ? +x[1] * (x[2] === "ТБ" ? 1024 : 1) : 0; };
  // Порядок конфигураций: связь → чип → оперативная память → накопитель.
  function cfgValue(s) {
    const st = [...String(s).matchAll(/(\d+)\s*(ГБ|ТБ|мм)/g)].pop();
    const ram = /(\d+)\/\d+/.exec(s);
    return (/Cellular/.test(s) ? 1e9 : 0) + (/Max/.test(s) ? 2e8 : /Pro/.test(s) ? 1e8 : 0) +
      (ram ? +ram[1] * 1e4 : 0) + (st ? +st[1] * (st[2] === "ТБ" ? 1024 : 1) : 0);
  }

  function catalogState() {
    const q = route.q;
    const list = (k) => (q.get(k) ? q.get(k).split(",").filter(Boolean) : []);
    return {
      sub: q.get("sub") || "", text: q.get("q") || "", sort: q.get("sort") || "",
      min: +q.get("min") || 0, max: +q.get("max") || 0,
      brand: list("brand"), mem: list("mem"), fam: list("color"), ver: list("ver"), cat: list("cat"),
    };
  }
  function setCatalogState(patch, keepLimit) {
    const st = Object.assign(catalogState(), patch);
    const q = new URLSearchParams();
    if (st.sub) q.set("sub", st.sub);
    if (st.text) q.set("q", st.text);
    ["cat", "brand", "mem", "ver"].forEach((k) => st[k].length && q.set(k, st[k].join(",")));
    if (st.fam.length) q.set("color", st.fam.join(","));
    if (st.min) q.set("min", st.min);
    if (st.max) q.set("max", st.max);
    if (st.sort) q.set("sort", st.sort);
    route.q = q;
    if (!keepLimit) route.limit = PAGE;
    const base = route.cat ? `#/catalog/${route.cat}` : st.text && !route.cat ? "#/search" : "#/catalog";
    const qs = q.toString();
    history.replaceState(null, "", base + (qs ? "?" + qs : ""));
    renderCatalog(true);
  }

  // Версия для фильтра: SIM у смартфонов, комплектация и т. п.
  const verFacet = (p) => (p.ver ? shortVer(p.ver) : null);

  function renderCatalog(partial) {
    const st = catalogState();
    const cat = route.cat;
    const c = cat && CAT[cat];
    let base = PRODUCTS.filter((p) => !cat || p.cat === cat);
    if (st.text) base = search(st.text, base);
    const inCat = base;
    if (st.sub) base = base.filter((p) => p.sub === st.sub);
    if (!cat && st.cat.length) base = base.filter((p) => st.cat.includes(p.cat));

    const filt = (except) => base.filter((p) =>
      (except === "brand" || !st.brand.length || st.brand.includes(p.brand || "Другие")) &&
      (except === "mem" || !st.mem.length || st.mem.includes(p.mem)) &&
      (except === "fam" || !st.fam.length || st.fam.includes(p._fam)) &&
      (except === "ver" || !st.ver.length || st.ver.includes(verFacet(p))) &&
      (except === "price" || ((!st.min || (p.price != null && p.price >= st.min)) && (!st.max || (p.price != null && p.price <= st.max)))));
    let items = filt();
    const sorters = {
      asc: (a, b) => (a.price ?? 1e12) - (b.price ?? 1e12),
      desc: (a, b) => (b.price ?? -1) - (a.price ?? -1),
      name: (a, b) => a.name.localeCompare(b.name, "ru"),
    };
    if (sorters[st.sort]) items = items.slice().sort(sorters[st.sort]);
    else if (!st.text) items = items.slice().sort((a, b) => a._ord - b._ord);

    const facet = (key, getter, except) => {
      const m = new Map();
      for (const p of filt(except)) { const v = getter(p); if (v) m.set(v, (m.get(v) || 0) + 1); }
      return m;
    };
    const brands = facet("brand", (p) => p.brand || "Другие", "brand");
    const mems = facet("mem", (p) => p.mem, "mem");
    const fams = facet("fam", (p) => p._fam, "fam");
    const vers = facet("ver", verFacet, "ver");
    const opts = (key, map, sel, sortFn, label = (v) => esc(v)) => {
      let entries = [...map.entries()];
      if (sortFn) entries.sort(sortFn);
      return entries.map(([v, n]) => `<button type="button" class="fopt${sel.includes(v) ? " is-on" : ""}" data-f="${key}" data-v="${esc(v)}" aria-pressed="${sel.includes(v)}">${label(v)} <small>${n}</small></button>`).join("");
    };
    const groups = [];
    groups.push(`<div class="fgroup"><h4>Цена, ₽</h4><div class="fprice"><input type="number" inputmode="numeric" min="0" step="500" placeholder="от" value="${st.min || ""}" data-price="min" aria-label="Цена от"><input type="number" inputmode="numeric" min="0" step="500" placeholder="до" value="${st.max || ""}" data-price="max" aria-label="Цена до"></div></div>`);
    if (!cat) {
      const cm = new Map();
      for (const p of inCat) cm.set(p.cat, (cm.get(p.cat) || 0) + 1);
      if (cm.size > 1) groups.push(`<div class="fgroup"><h4>Категория</h4><div class="fopts">${CATS.filter((x) => cm.has(x.id)).map((x) => `<button type="button" class="fopt${st.cat.includes(x.id) ? " is-on" : ""}" data-f="cat" data-v="${x.id}" aria-pressed="${st.cat.includes(x.id)}">${esc(x.short || x.title)} <small>${cm.get(x.id)}</small></button>`).join("")}</div></div>`);
    }
    if (brands.size > 1 || st.brand.length) groups.push(`<div class="fgroup"><h4>Бренд</h4><div class="fopts">${opts("brand", brands, st.brand, (a, b) => b[1] - a[1])}</div></div>`);
    if (mems.size > 1 || st.mem.length) groups.push(`<div class="fgroup"><h4>${MEM_LABEL[cat] || "Память"}</h4><div class="fopts">${opts("mem", mems, st.mem, (a, b) => memValue(a[0]) - memValue(b[0]))}</div></div>`);
    if ((vers.size > 1 && vers.size <= 16) || st.ver.length) groups.push(`<div class="fgroup"><h4>${/iphone|samsung|android/.test(cat) ? "SIM-карта и версия" : "Версия"}</h4><div class="fopts">${opts("ver", vers, st.ver, (a, b) => b[1] - a[1])}</div></div>`);
    if (fams.size > 1 || st.fam.length) groups.push(`<div class="fgroup"><h4>Цвет</h4><div class="fopts">${opts("color", fams, st.fam, (a, b) => b[1] - a[1], (v) => `<i class="swatch" style="background:${FAMILIES[v][1]}"></i>${FAMILIES[v][0]}`)}</div></div>`);

    const activeChips = [];
    if (st.min) activeChips.push(["min", "", `от ${rub(st.min)}`]);
    if (st.max) activeChips.push(["max", "", `до ${rub(st.max)}`]);
    st.cat.forEach((v) => activeChips.push(["cat", v, CAT[v] ? CAT[v].short || CAT[v].title : v]));
    st.brand.forEach((v) => activeChips.push(["brand", v, v]));
    st.mem.forEach((v) => activeChips.push(["mem", v, v]));
    st.ver.forEach((v) => activeChips.push(["ver", v, v]));
    st.fam.forEach((v) => activeChips.push(["color", v, FAMILIES[v] ? FAMILIES[v][0] : v]));

    const shown = items.slice(0, route.limit);
    const results = `
      <div class="toolbar">
        <span class="toolbar__count">Найдено <b>${items.length}</b> ${plural(items.length, "товар", "товара", "товаров")}</span>
        <div class="toolbar__right">
          <button type="button" class="btn btn--ghost btn--sm filter-btn" data-open-filters>${icon("filter")}Фильтры${activeChips.length ? ` · ${activeChips.length}` : ""}</button>
          <select class="select" data-sort aria-label="Сортировка">
            ${[["", st.text ? "По релевантности" : "По популярности"], ["asc", "Сначала дешевле"], ["desc", "Сначала дороже"], ["name", "По названию"]].map(([v, t]) => `<option value="${v}"${st.sort === v ? " selected" : ""}>${t}</option>`).join("")}
          </select>
        </div>
      </div>
      ${activeChips.length ? `<div class="active-filters">${activeChips.map(([k, v, t]) => `<button type="button" data-unf="${k}" data-v="${esc(v)}">${esc(t)}${icon("close")}</button>`).join("")}<button type="button" data-reset style="background:none;color:var(--muted)">Сбросить всё</button></div>` : ""}
      ${items.length ? `<div class="grid">${shown.map(card).join("")}</div>` : `<div class="empty card">${ART.art({ kind: "accessory", color: "Silver" })}<h3>Ничего не нашлось</h3><p>Попробуйте изменить фильтры или спросите менеджера — подберём под запрос.</p><a class="btn btn--tg" href="${tgLink("Здравствуйте! Ищу: " + (st.text || (c ? c.title : "")))}" target="_blank" rel="noopener">${icon("telegram")}Спросить в Telegram</a></div>`}
      ${items.length > shown.length ? `<div class="more"><button type="button" class="btn btn--ghost" data-more>Показать ещё ${Math.min(PAGE, items.length - shown.length)} из ${items.length - shown.length}</button></div>` : ""}`;

    const filtersHtml = `
      <div class="filters__head"><b>Фильтры</b><button type="button" class="icon-btn" data-close-filters aria-label="Закрыть">${icon("close")}</button></div>
      ${groups.join("")}
      ${activeChips.length ? `<button type="button" class="btn btn--ghost btn--sm btn--block filters__reset" data-reset>Сбросить фильтры</button>` : ""}
      <div class="filters__apply"><button type="button" class="btn btn--brand btn--block" data-close-filters>Показать ${items.length} ${plural(items.length, "товар", "товара", "товаров")}</button></div>`;

    if (partial && $("#results")) {
      $("#results").innerHTML = results;
      const f = $("#filters"), wasOpen = f.classList.contains("is-open"), scroll = f.scrollTop;
      f.innerHTML = filtersHtml;
      f.scrollTop = scroll;
      if (wasOpen) f.classList.add("is-open");
      $$(".subs .pill").forEach((el) => el.classList.toggle("is-active", (el.dataset.sub || "") === st.sub));
      return;
    }

    // Фото в шапке раздела: по одной модели из первых линеек (или из выбранной линейки).
    const heroPhotos = (() => {
      const pool = st.sub ? [st.sub] : cat ? SUBS[cat].map((x) => x.name) : CATS.map((x) => x.hero);
      const out = [], seen = new Set();
      for (const name of pool) {
        for (const p of PRODUCTS.filter((x) => x.sub === name && x.img && (!cat || x.cat === cat)).sort((a, b) => a.price - b.price)) {
          const key = p.name.split(",")[0];
          if (!seen.has(key)) { seen.add(key); out.push(p); break; }
        }
        if (out.length === 3) break;
      }
      return out;
    })();
    const subs = cat ? SUBS[cat].filter((s) => !st.text || inCat.some((p) => p.sub === s.name)) : [];
    const m = minPrice(inCat);
    const heading = c ? c.title : st.text ? `Поиск: «${st.text}»` : "Все товары";
    app.innerHTML = `
      <div class="wrap">
        ${crumbs(c ? [["#/catalog", "Каталог"], [null, c.title]] : [[null, st.text ? "Поиск" : "Каталог"]])}
        <section class="cat-hero${heroPhotos.length ? "" : " cat-hero--plain"}">
          <div>
            <h1>${esc(heading)}</h1>
            <p>${c ? esc(c.desc) : st.text ? `${inCat.length} ${plural(inCat.length, "товар", "товара", "товаров")} по вашему запросу` : "Вся техника OctoStore: смартфоны, ноутбуки, планшеты, часы, аудио, консоли, Dyson, гаджеты и аксессуары."}</p>
            <div class="cat-hero__meta">
              <span class="chip">${inCat.length} ${plural(inCat.length, "позиция", "позиции", "позиций")}</span>
              ${m < Infinity ? `<span class="chip">от ${rub(m)}</span>` : ""}
              ${updatedShort ? `<span class="chip">цены на ${updatedShort}</span>` : ""}
            </div>
          </div>
          ${heroPhotos.length ? `<div class="cat-hero__photos" aria-hidden="true">${heroPhotos.map((p) => `<img src="${imgSrc(p)}" alt="">`).join("")}</div>` : ""}
        </section>
        ${subs.length > 1 ? `<div class="subs" role="tablist"><a class="pill${st.sub ? "" : " is-active"}" href="${catHref(cat)}" data-sub="">Все <small>${inCat.length}</small></a>${subs.map((s) => `<a class="pill${st.sub === s.name ? " is-active" : ""}" href="${catHref(cat, s.name)}" data-sub="${esc(s.name)}">${esc(s.name)} <small>${inCat.filter((p) => p.sub === s.name).length}</small></a>`).join("")}</div>` : ""}
        <div class="catalog">
          <aside class="filters card" id="filters" aria-label="Фильтры">${filtersHtml}</aside>
          <section id="results">${results}</section>
        </div>
      </div>`;
  }

  function closeFilters() {
    const f = $("#filters");
    if (f) f.classList.remove("is-open");
    const bd = $(".sheet-backdrop");
    if (bd) bd.remove();
    document.body.style.overflow = "";
  }

  // ------------------------------------------------------------------
  // Карточка товара
  // ------------------------------------------------------------------
  function siblingsOf(p) { return PRODUCTS.filter((x) => x.cat === p.cat && x.sub === p.sub); }

  // Варианты: конфигурация, цвет, версия. Выбор значения ведёт на самый похожий товар.
  function variants(p) {
    const sib = siblingsOf(p);
    const dims = [
      ["_cfg", { iphone: "Память", samsung: "Память", android: "Память", mac: "Конфигурация", tablets: "Конфигурация", watch: "Размер и ремешок" }[p.cat] || "Модель"],
      ["color", "Цвет"],
      ["_ver", { iphone: "SIM-карта", samsung: "SIM-карта и версия", android: "Версия" }[p.cat] || "Вариант"],
    ];
    const order = (key, vals) => (key === "_cfg" ? vals.sort((a, b) => cfgValue(a) - cfgValue(b) || a.localeCompare(b, "ru")) : vals);
    return dims.map(([key, label]) => {
      const vals = order(key, [...new Set(sib.map((x) => x[key]).filter(Boolean))]);
      if (vals.length < 2 || vals.length > 14) return "";
      const others = dims.map((d) => d[0]).filter((k) => k !== key);
      const btns = vals.map((v) => {
        const exact = sib.find((x) => x[key] === v && others.every((k) => x[k] === p[k]));
        const target = exact || sib.filter((x) => x[key] === v).sort((a, b) => others.reduce((s, k) => s + (b[k] === p[k]) - (a[k] === p[k]), 0) || (a.price ?? 1e12) - (b.price ?? 1e12))[0];
        const on = p[key] === v;
        const sw = key === "color" ? ART.resolve(target.colorEn) || ART.resolve(v) : null;
        return `<a class="vopt${sw ? " vopt--color" : ""}${on ? " is-on" : ""}${!exact && !on ? " is-off" : ""}" href="#/product/${encodeURIComponent(target.id)}" aria-current="${on}">${sw ? `<i class="swatch" style="background:${sw}"></i>` : ""}${esc(v)}${target.price != null && !on && key !== "color" ? ` <small>${rub(target.price)}</small>` : ""}</a>`;
      });
      return `<div class="variant"><div class="variant__label">${label}: <b>${esc(p[key])}</b></div><div class="variant__opts">${btns.join("")}</div></div>`;
    }).join("");
  }

  function warrantyFact(p) {
    if (/стекл|чехол|чехл|плёнк|пленк|накладк/i.test(p.name)) return ["Гарантия", "не действует, кроме брака при продаже"];
    if (p.brand === "Apple" && p.cat !== "accessories") return ["Гарантия 12 месяцев", "на устройства Apple"];
    return ["Гарантия 14 дней", "на аксессуары и технику других брендов"];
  }

  const specRows = (rows) => rows.map(([k, v]) => `<tr><th>${esc(k)}</th><td>${esc(v)}</td></tr>`).join("");

  function renderProduct(p) {
    const c = CAT[p.cat];
    const basic = [["Категория", c.title], ["Линейка", p.sub], ["Бренд", p.brand], [p.cat === "watch" ? "Размер корпуса" : "Память", p.mem], ["Цвет", p.color], ["Вариант", p.ver]].filter((r) => r[1]);
    const [wTitle, wText] = warrantyFact(p);
    const similar = PRODUCTS.filter((x) => x.cat === p.cat && x.id !== p.id && x.sub !== p.sub && x.price != null && x.img)
      .sort((a, b) => Math.abs((a.price || 0) - (p.price || 0)) - Math.abs((b.price || 0) - (p.price || 0)));
    const seenSub = new Set();
    const rail = similar.filter((x) => (seenSub.has(x.sub) ? false : seenSub.add(x.sub))).slice(0, 10);
    const sameLine = siblingsOf(p).filter((x) => x.id !== p.id);

    app.innerHTML = `
      <div class="wrap">
        ${crumbs([["#/catalog", "Каталог"], [catHref(p.cat), c.title], [catHref(p.cat, p.sub), p.sub]])}
        <div class="product">
          <div class="gallery">
            <div class="gallery__main${p.img ? " gallery__main--photo" : ""}" style="${mediaStyle(p)}" id="gMain">${photo(p, { label: p.name, eager: true })}</div>
            <div class="gallery__thumbs" id="gThumbs" hidden></div>
          </div>
          <div class="pinfo">
            <div class="pinfo__brand">${esc(p.brand || c.title)} · ${esc(p.sub)}</div>
            <h1>${esc(p.name)}</h1>
            <div class="chips">${chips(p)}${p.ver ? `<span class="chip">${esc(shortVer(p.ver))}</span>` : ""}</div>
            ${variants(p)}
            <div class="buybox card">
              <div class="buybox__price">${priceHtml(p)}${updatedShort ? `<span class="muted" style="font-size:14px">цена на ${updatedShort}</span>` : ""}</div>
              <p class="buybox__note">${icon("info")}${p.from ? "Цена указана за самый доступный вариант. " : ""}Наличие и стоимость могут меняться — менеджер подтвердит их перед покупкой.</p>
              <div class="buybox__actions">
                ${buy(p, "lg")}
                <a class="btn btn--tg" href="${tgLink(askText(p))}" target="_blank" rel="noopener">${icon("telegram")}Купить в 1 клик</a>
              </div>
              <div class="facts">
                <div class="fact">${icon("truck")}<div><b>Курьер за 2 часа</b><span>по Москве от 500 ₽</span></div></div>
                <div class="fact">${icon("store")}<div><b>Самовывоз</b><span>Горбушкин Двор, Vip2-46</span></div></div>
                <div class="fact">${icon("shield")}<div><b>${wTitle}</b><span>${wText}</span></div></div>
                <div class="fact">${icon("swap")}<div><b>Trade-in</b><span>старое устройство в зачёт</span></div></div>
              </div>
            </div>
            <div class="ptabs card">
              <h2>Характеристики</h2>
              <div id="specs"><table class="specs"><tbody>${specRows(basic)}</tbody></table></div>
              <div id="equip"></div>
            </div>
          </div>
        </div>
        ${sameLine.length ? `<section class="section"><div class="section__head"><h2 class="section__title">Ещё в линейке ${esc(p.sub)}</h2><a class="link-more" href="${catHref(p.cat, p.sub)}">Все ${sameLine.length + 1}${icon("chev")}</a></div><div class="rail">${sameLine.slice(0, 12).map(card).join("")}</div></section>` : ""}
        ${rail.length ? `<section class="section" style="padding-top:0"><div class="section__head"><h2 class="section__title">Похожие товары</h2><a class="link-more" href="${catHref(p.cat)}">${esc(c.title)}${icon("chev")}</a></div><div class="rail">${rail.map(card).join("")}</div></section>` : ""}
      </div>`;
    if (p.d) loadDetail(p, basic);
  }

  // Характеристики, комплектация и галерея — из отдельного файла товара.
  async function loadDetail(p, basic) {
    let d;
    try {
      const r = await fetch(`assets/data/p/${encodeURIComponent(p.d)}.json`);
      if (!r.ok) return;
      d = await r.json();
    } catch (e) { return; }
    if (route.p !== p) return;
    if (d.specs && d.specs.length) {
      const rows = d.specs.reduce((n, [, r]) => n + r.length, 0);
      $("#specs").innerHTML = `<div class="specs-wrap${rows > 14 ? " is-collapsed" : ""}">
        <table class="specs"><tbody>${specRows(basic.slice(0, 2))}</tbody></table>
        ${d.specs.map(([g, r]) => `<h3 class="specs__group">${esc(g)}</h3><table class="specs"><tbody>${specRows(r)}</tbody></table>`).join("")}
      </div>${rows > 14 ? `<button type="button" class="btn btn--ghost btn--sm" data-specs-toggle style="margin-top:12px">Все характеристики</button>` : ""}`;
    }
    if (d.equipment && d.equipment.length) {
      $("#equip").innerHTML = `<h2 style="margin-top:22px">Комплектация</h2><ul class="equip">${d.equipment.map((e) => `<li>${icon("check")}${esc(e)}</li>`).join("")}</ul>`;
    }
    const gal = (d.gallery || []).slice(0, 8);
    if (p.img && gal.length > 1) {
      const thumbs = $("#gThumbs");
      thumbs.innerHTML = gal.map((g, i) => `<button type="button" class="gthumb${i ? "" : " is-on"}" data-gal="${i}" aria-label="Фото ${i + 1}"><img src="${i ? cdn(g, 136) : imgSrc(p)}" alt="" loading="lazy" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></button>`).join("");
      thumbs.hidden = false;
      thumbs.addEventListener("click", (e) => {
        const b = e.target.closest("[data-gal]");
        if (!b) return;
        const i = +b.dataset.gal;
        $$(".gthumb", thumbs).forEach((x) => x.classList.toggle("is-on", x === b));
        $("#gMain").innerHTML = i ? `<img class="photo" src="${cdn(gal[i], 870)}" alt="${esc(p.name)}" referrerpolicy="no-referrer">` : photo(p, { label: p.name });
      });
    }
  }

  // ------------------------------------------------------------------
  // Корзина и оформление
  // ------------------------------------------------------------------
  const DELIVERY = [
    ["pickup", "Самовывоз из павильона", "ТК «Горбушкин Двор», Vip2-46 · ежедневно 11:00–20:00 · бесплатно", null],
    ["moscow", "Курьер по Москве (в пределах ТТК и МКАД)", "Наш курьер, около 2 часов · от 500 ₽", "от 500 ₽"],
    ["outside", "Курьер за МКАД", "Наш курьер · от 1 000 ₽", "от 1 000 ₽"],
    ["region", "Отправка в регион", "СДЭК, Boxberry или Яндекс.Доставка · только по 100% предоплате", "по тарифу ТК"],
  ];

  function renderCart() {
    const items = cartItems();
    const form = store.get("octo-checkout", { delivery: "pickup" });
    if (!items.length) {
      app.innerHTML = `<div class="wrap">${crumbs([[null, "Корзина"]])}<h1 class="page-title">Корзина</h1>
        <div class="empty card">${ART.art({ kind: "accessory", color: "Lavender" })}<h3>В корзине пока пусто</h3><p>Загляните в каталог — там ${PRODUCTS.length.toLocaleString("ru-RU")} ${plural(PRODUCTS.length, "товар", "товара", "товаров")}.</p><a class="btn btn--brand" href="#/catalog">${icon("grid")}Перейти в каталог</a></div></div>`;
      return;
    }
    const sum = cartSum();
    const count = cartCount();
    const d = DELIVERY.find((x) => x[0] === form.delivery) || DELIVERY[0];
    const focused = document.activeElement && document.activeElement.closest("#checkoutForm") ? document.activeElement.name : null;
    app.innerHTML = `
      <div class="wrap">
        ${crumbs([[null, "Корзина"]])}
        <h1 class="page-title">Корзина <span class="muted" style="font-size:.55em">${count} ${plural(count, "товар", "товара", "товаров")}</span></h1>
        <div class="cart">
          <div style="display:grid;gap:14px">
            <div class="card">${items.map(({ p, qty }) => `
              <div class="citem">
                <a class="citem__media" href="#/product/${encodeURIComponent(p.id)}" style="${mediaStyle(p)}">${photo(p)}</a>
                <div>
                  <a class="citem__name" href="#/product/${encodeURIComponent(p.id)}">${esc(p.name)}</a>
                  <div class="citem__meta">${chips(p)}${p.ver ? `<span class="chip">${esc(shortVer(p.ver))}</span>` : ""}</div>
                </div>
                <div class="citem__side">
                  <span class="price">${p.from ? "<small>от</small> " : ""}${rub(p.price * qty)}</span>
                  <div style="display:flex;gap:6px;align-items:center">${buy(p)}<button type="button" class="icon-btn" data-remove="${esc(p.id)}" aria-label="Удалить ${esc(p.name)}">${icon("trash")}</button></div>
                </div>
              </div>`).join("")}
            </div>
            <div class="notice notice--info">${icon("info")}<div>Цены указаны${updatedText ? ` на ${updatedText}` : ""}. Менеджер подтвердит наличие и итоговую стоимость в Telegram — заказ ни к чему не обязывает.</div></div>
          </div>
          <form class="checkout card" id="checkoutForm" novalidate>
            <h2>Оформление</h2>
            <div class="sumrow"><span>Товары (${count})</span><span>${rub(sum)}</span></div>
            <div class="sumrow"><span>Доставка</span><span>${d[3] || "бесплатно"}</span></div>
            <div class="sumrow sumrow--total"><span>Итого</span><span>${rub(sum)}${d[3] ? " + доставка" : ""}</span></div>
            <div class="field"><span class="label">Способ получения</span><div class="radios">
              ${DELIVERY.map(([id, t, s]) => `<label class="radio"><input type="radio" name="delivery" value="${id}"${form.delivery === id ? " checked" : ""}><span><b>${t}</b><small>${s}</small></span></label>`).join("")}
            </div></div>
            ${form.delivery !== "pickup" ? `<div class="field"><label for="f-address">${form.delivery === "region" ? "Город и пункт выдачи / адрес" : "Адрес доставки"}</label><input class="input" id="f-address" name="address" value="${esc(form.address || "")}" placeholder="${form.delivery === "region" ? "Например: Казань, ПВЗ СДЭК на ул. Баумана" : "Улица, дом, квартира"}"></div>` : ""}
            <div class="field"><label for="f-name">Имя</label><input class="input" id="f-name" name="name" value="${esc(form.name || "")}" autocomplete="name" placeholder="Как к вам обращаться"></div>
            <div class="field"><label for="f-phone">Телефон</label><input class="input" id="f-phone" name="phone" type="tel" value="${esc(form.phone || "")}" autocomplete="tel" placeholder="+7 900 000-00-00"></div>
            <div class="field"><label for="f-comment">Комментарий</label><textarea class="input" id="f-comment" name="comment" placeholder="Удобное время, вопросы по товару">${esc(form.comment || "")}</textarea></div>
            <label class="checkbox"><input type="checkbox" name="tradein"${form.tradein ? " checked" : ""}>Хочу сдать устройство в Trade-in</label>
            ${form.delivery !== "pickup" ? `<div class="notice" style="margin-top:14px">${icon("video")}<div><b>При получении</b> вскрывайте упаковку при курьере и снимайте распаковку на видео. <a href="#/delivery" style="color:var(--brand);font-weight:700">Подробнее</a></div></div>` : ""}
            <button type="submit" class="btn btn--tg btn--block" style="margin-top:16px;height:54px">${icon("telegram")}Отправить заказ в Telegram</button>
            <button type="button" class="btn btn--ghost btn--block" data-copy-order style="margin-top:8px">${icon("copy")}Скопировать текст заказа</button>
            <p class="muted" style="font-size:12.5px;margin-top:10px">Откроется чат с менеджером @${esc(ORDER_USER)} — текст заказа подставится автоматически. Если этого не произошло, вставьте его из буфера обмена.</p>
          </form>
        </div>
      </div>`;
    if (focused) { const el = $(`#checkoutForm [name="${focused}"]`); if (el) el.focus(); }
  }

  function readForm() {
    const f = $("#checkoutForm");
    const field = (n) => f.querySelector(`[name="${n}"]`);
    const data = Object.assign({}, store.get("octo-checkout", {}), {
      delivery: (f.querySelector("input[name=delivery]:checked") || {}).value || "pickup",
      name: field("name").value.trim(),
      phone: field("phone").value.trim(),
      comment: field("comment").value.trim(),
      tradein: field("tradein").checked,
    });
    if (field("address")) data.address = field("address").value.trim();
    store.set("octo-checkout", data);
    return data;
  }

  function orderText(form) {
    const lines = cartItems().map(({ p, qty }, i) => `${i + 1}. ${productLine(p)} — ${qty} шт. × ${p.from ? "от " : ""}${rub(p.price)}`);
    const d = DELIVERY.find((x) => x[0] === form.delivery) || DELIVERY[0];
    return [
      "Здравствуйте! Хочу оформить заказ на сайте OctoStore:",
      "",
      ...lines,
      "",
      `Итого: ${rub(cartSum())}${d[3] ? " + доставка" : ""}`,
      `Получение: ${d[1]}`,
      form.delivery !== "pickup" && form.address ? `Адрес: ${form.address}` : "",
      form.name ? `Имя: ${form.name}` : "",
      form.phone ? `Телефон: ${form.phone}` : "",
      form.tradein ? "Хочу сдать устройство в Trade-in" : "",
      form.comment ? `Комментарий: ${form.comment}` : "",
    ].filter((l, i, a) => l !== "" || (a[i - 1] !== "" && i < a.length - 1)).join("\n").replace(/\n+$/, "");
  }

  // ------------------------------------------------------------------
  // Информационные страницы
  // ------------------------------------------------------------------
  const INFO_TITLES = { delivery: "Доставка", warranty: "Гарантия", services: "Trade-in и ремонт", contacts: "Контакты" };
  const askCard = (title, text, msg) => `<div class="contact-card card"><h3>${title}</h3><p class="muted" style="margin-bottom:14px">${text}</p><a class="btn btn--tg btn--block" href="${msg ? tgLink(msg) : ORDER_URL}" target="_blank" rel="noopener">${icon("telegram")}Написать @${esc(ORDER_USER)}</a></div>`;
  const hoursCard = () => `<div class="contact-card card"><h3>Магазин</h3>
    <div class="contact-row">${icon("pin")}<div><b>Багратионовский проезд, 7к3</b><span>ТК «Горбушкин Двор», 2 этаж, VIP-сектор, павильон Vip2-46</span></div></div>
    <div class="contact-row">${icon("clock")}<div><b>Ежедневно 11:00–20:00</b><span>Без выходных</span></div></div></div>`;

  const INFO = {
    delivery: () => `<div class="wrap">${crumbs([[null, "Доставка"]])}<h1 class="page-title">Доставка</h1>
      <div class="info"><div class="info__main">
        <div class="info-head">${icon("truck")}<b>Привезём за 2 часа по Москве и отправим в любой регион</b><span>Курьер OctoStore, СДЭК, Boxberry и Яндекс.Доставка.</span></div>
        <div class="tiles">
          <div class="tile">${icon("truck")}<span class="tile__big">2 часа</span><span>Доставка по Москве нашим курьером</span></div>
          <div class="tile">${icon("pin")}<span class="tile__big">от 500 ₽</span><span>В пределах ТТК и МКАД</span></div>
          <div class="tile">${icon("pin")}<span class="tile__big">от 1 000 ₽</span><span>За МКАД и по области</span></div>
        </div>
        <div class="prose card">
          <h2>Отправка в регионы</h2>
          <p>Отправляем заказы по всей России <b>только по 100% предоплате</b> через службы доставки:</p>
          <div class="chips" style="margin:10px 0 4px"><span class="chip" style="height:32px;font-size:14px">СДЭК</span><span class="chip" style="height:32px;font-size:14px">Boxberry</span><span class="chip" style="height:32px;font-size:14px">Яндекс.Доставка</span></div>
        </div>
        <div class="prose card">
          <h2>Как правильно принять заказ</h2>
          <p>Чтобы защитить свои права, следуйте этому алгоритму при получении:</p>
          <div class="steps" style="margin-top:14px">
            <div class="step"><div><b>Вскрывайте упаковку при курьере</b><span>Не принимайте посылку «вслепую».</span></div></div>
            <div class="step"><div><b>Снимайте распаковку на видео</b><span>Непрерывно — от резки скотча до осмотра экрана и корпуса.</span></div></div>
            <div class="step"><div><b>Сверьте серийные номера</b><span>Номер на гаджете и на упаковке должен совпадать.</span></div></div>
            <div class="step"><div><b>Осмотрите корпус</b><span>Проверьте, нет ли сколов, царапин и вмятин.</span></div></div>
          </div>
          <div class="notice" style="margin-top:16px">${icon("info")}<div><b>Заметили дефект или несоответствие?</b> Не включайте устройство и сразу свяжитесь с нами. Заменить устройство с внешними повреждениями мы можем только до его активации.</div></div>
        </div>
        <div class="prose card">
          <h2>Самовывоз</h2>
          <p>Забрать заказ можно в павильоне на Горбушке ежедневно с 11:00 до 20:00. Советуем за час до приезда сверить наличие и стоимость у менеджера — они могут меняться в течение дня.</p>
        </div>
      </div>
      <aside class="info__aside">${askCard("Оформить доставку", "Напишите менеджеру адрес и удобное время — рассчитаем стоимость и согласуем доставку.", "Здравствуйте! Хочу оформить доставку.")}${hoursCard()}</aside></div></div>`,

    warranty: () => `<div class="wrap">${crumbs([[null, "Гарантия"]])}<h1 class="page-title">Гарантия</h1>
      <div class="info"><div class="info__main">
        <div class="info-head">${icon("shield")}<b>Гарантия на всю технику</b><span>14 дней на проверку, международная гарантия производителя и дополнительные 12 месяцев от магазина.</span></div>
        <div class="tiles">
          <div class="tile">${icon("shield")}<b>От магазина</b><span>14 дней на проверку устройства</span></div>
          <div class="tile">${icon("check")}<b>Международная гарантия</b><span>От производителя — 1 год с момента активации устройства</span></div>
          <div class="tile">${icon("plus")}<b>+12 месяцев</b><span>Можно приобрести дополнительную гарантию от магазина</span></div>
        </div>
        <div class="prose card">
          <h2>Гарантийные условия OctoStore</h2>
          <p>Дополнение к правам по Закону «О защите прав потребителей».</p>
          <ol class="rules">
            <li><b>Срок гарантии.</b><ul><li>12 мес. — на устройства Apple (если не указано иное);</li><li>14 дней — на аксессуары и технику других брендов (кабели, ЗУ, адаптеры и пр.);</li><li>на чехлы, плёнки, стёкла гарантия не действует (кроме явного брака при продаже).</li></ul></li>
            <li><b>Гарантийный случай</b> — заводской дефект, проявившийся при нормальной эксплуатации.</li>
            <li><b>Как обратиться.</b> Принесите товар в магазин OctoStore (Москва, Багратионовский проезд, 7к3) с чеком и описанием неисправности. Визит желательно согласовать в Telegram.</li>
            <li><b>Диагностика.</b> Товар направляется в сервис, заключение сервиса — основа для решения. Срок диагностики — до 10 календарных дней.</li>
            <li><b>Если дефект подтверждён</b>, OctoStore организует отправку в официальный сервис Apple за рубеж. Способ ремонта (ремонт или замена) — по регламенту Apple. Срок — от 35 до 90 дней с учётом логистики.</li>
            <li><b>AirPods</b> — при браке заменяется только неисправный элемент (левый/правый наушник или кейс), полный комплект не меняется.</li>
            <li><b>ЖК-дисплеи</b> — наличие до 4 битых пикселей не является гарантийным случаем (по техническим стандартам).</li>
            <li><b>Если брак не подтверждён</b>, гарантия не применяется, и покупатель оплачивает диагностику (см. стоимость ниже).</li>
            <li><b>Гарантия не действует</b> при механических повреждениях, падениях, попадании жидкости, коррозии; перегреве, скачках напряжения, использовании несовместимых ЗУ; следах вскрытия и неоригинальном ремонте; повреждении серийных номеров или пломб.</li>
            <li><b>Данные.</b> Покупатель обязан сделать резервную копию — магазин не несёт ответственности за их утрату.</li>
            <li><b>Влагозащита</b> после ремонта не восстанавливается. Попадание влаги после ремонта — негарантийный случай.</li>
            <li><b>Доставка</b> до магазина или сервиса — за счёт покупателя (если не оговорено иное).</li>
            <li><b>Рекомендация:</b> перед передачей сделайте бэкап и сброс до заводских настроек. Товар сдаётся в комплектности, достаточной для диагностики.</li>
          </ol>
        </div>
        <div class="prose card">
          <h2>Стоимость диагностики</h2>
          <p>Оплачивается, только если заводской брак не подтвердился.</p>
          <table class="price-table"><tbody>
            <tr><td>iPhone, iPad, Apple Watch, AirPods</td><td>3 190 ₽</td></tr>
            <tr><td>MacBook, iMac</td><td>7 000 ₽</td></tr>
          </tbody></table>
        </div>
      </div>
      <aside class="info__aside">${askCard("Гарантийный случай?", "Опишите неисправность в Telegram и согласуйте визит — так мы быстрее примем устройство.", "Здравствуйте! Вопрос по гарантии: ")}${hoursCard()}</aside></div></div>`,

    services: () => `<div class="wrap">${crumbs([[null, "Trade-in и ремонт"]])}<h1 class="page-title">Trade-in и ремонт</h1>
      <div class="info"><div class="info__main">
        <div class="promo promo--trade" id="tradein">
          <div><span class="eyebrow">${icon("swap")}Trade-in</span><h3 style="margin-top:10px">Обновляйте технику с выгодой</h3><p>Сдайте своё устройство — его стоимость пойдёт в зачёт покупки новой техники в OctoStore.</p></div>
          <div><a class="btn btn--light" href="${tgLink("Здравствуйте! Хочу сдать в Trade-in: ")}" target="_blank" rel="noopener">${icon("telegram")}Оценить устройство</a></div>
          <svg class="promo__ico"><use href="#i-swap"/></svg>
        </div>
        <div class="prose card">
          <h2>Как проходит Trade-in</h2>
          <div class="steps" style="margin-top:14px">
            <div class="step"><div><b>Напишите в Telegram</b><span>Модель, объём памяти, состояние, комплект и пара фото устройства.</span></div></div>
            <div class="step"><div><b>Получите предварительную оценку</b><span>Менеджер подскажет, сколько можно зачесть в новую покупку.</span></div></div>
            <div class="step"><div><b>Приезжайте в павильон</b><span>Проверим устройство на месте и подтвердим сумму.</span></div></div>
            <div class="step"><div><b>Заберите новую технику</b><span>Сумма за старое устройство засчитывается в стоимость нового.</span></div></div>
          </div>
          <div class="notice notice--info" style="margin-top:16px">${icon("info")}<div>Перед сдачей сделайте резервную копию, выйдите из iCloud / аккаунта и сбросьте устройство до заводских настроек.</div></div>
        </div>
        <div class="promo promo--repair" id="repair">
          <div><span class="eyebrow">${icon("wrench")}Ремонт</span><h3 style="margin-top:10px">Ремонт любой сложности? Решим любую задачу!</h3><p>Опишите, что случилось с устройством, — подскажем по срокам и стоимости и договоримся о визите.</p></div>
          <div><a class="btn btn--glass" href="${tgLink("Здравствуйте! Нужен ремонт: ")}" target="_blank" rel="noopener">${icon("telegram")}Описать проблему</a></div>
          <svg class="promo__ico"><use href="#i-wrench"/></svg>
        </div>
        <div class="prose card">
          <h2>Как сдать технику в ремонт</h2>
          <div class="steps" style="margin-top:14px">
            <div class="step"><div><b>Опишите неисправность</b><span>Напишите модель и что происходит с устройством — по возможности приложите фото или видео.</span></div></div>
            <div class="step"><div><b>Согласуйте визит</b><span>Привезите устройство в павильон на Горбушке в удобное время.</span></div></div>
            <div class="step"><div><b>Диагностика и ремонт</b><span>Сообщим результат диагностики, стоимость и срок до начала работ.</span></div></div>
          </div>
        </div>
      </div>
      <aside class="info__aside">${askCard("Есть вопрос?", "Ответим в Telegram ежедневно с 11:00 до 20:00.")}${hoursCard()}</aside></div></div>`,

    contacts: () => `<div class="wrap">${crumbs([[null, "Контакты"]])}<h1 class="page-title">Контакты</h1>
      <div class="info"><div class="info__main">
        <div class="map">${mapFrame()}</div>
        ${mapLinks()}
        <div class="prose card">
          <h2>Как нас найти</h2>
          <ol class="rules">
            <li>Доберитесь до ТК <b>«Горбушкин Двор»</b> — Багратионовский проезд, 7к3 (рядом с м. Багратионовская).</li>
            <li>Поднимитесь на <b>2 этаж</b> и пройдите в <b>VIP-сектор</b>.</li>
            <li>Ищите павильон <b>Vip2-46</b> — OctoStore.</li>
          </ol>
          <div class="notice" style="margin-top:14px">${icon("clock")}<div>Чтобы избежать неожиданностей, за час до приезда сверьте наличие и стоимость у менеджера — они могут меняться в течение дня.</div></div>
        </div>
      </div>
      <aside class="info__aside">
        ${hoursCard()}
        <div class="contact-card card"><h3>Мы на связи</h3>
          <div class="contact-row">${icon("telegram")}<div><b><a href="${ORDER_URL}" target="_blank" rel="noopener">@${esc(ORDER_USER)}</a></b><span>Заказы и консультации</span></div></div>
          <div class="contact-row">${icon("instagram")}<div><b><a href="${SOCIALS.instagram}" target="_blank" rel="noopener">Instagram</a></b><span>@octostore46</span></div></div>
          <div class="contact-row">${icon("tiktok")}<div><b><a href="${SOCIALS.tiktok}" target="_blank" rel="noopener">TikTok</a></b><span>@octostore46</span></div></div>
          <a class="btn btn--tg btn--block" style="margin-top:10px" href="${ORDER_URL}" target="_blank" rel="noopener">${icon("telegram")}Написать менеджеру</a>
        </div>
      </aside></div></div>`,
  };

  function renderNotFound() {
    app.innerHTML = `<div class="wrap" style="padding:40px 0"><div class="empty card">${ART.art({ kind: "phone", color: "Lavender" })}<h3>Страница не найдена</h3><p>Возможно, товар уже распродан или ссылка устарела.</p><a class="btn btn--brand" href="#/catalog">${icon("grid")}В каталог</a></div></div>`;
  }

  // ------------------------------------------------------------------
  // События
  // ------------------------------------------------------------------
  let toastTimer;
  function toast(html) {
    const t = $("#toast");
    t.innerHTML = html;
    t.classList.add("is-on");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("is-on"), 2800);
  }

  document.addEventListener("click", async (e) => {
    const t = e.target.closest("[data-add],[data-inc],[data-dec],[data-remove],[data-f],[data-unf],[data-reset],[data-more],[data-open-filters],[data-close-filters],[data-copy-order],[data-specs-toggle]");
    if (!t) return;
    if (t.dataset.add) {
      setQty(t.dataset.add, 1);
      toast(`${icon("check")}Добавлено в корзину <a href="#/cart">Оформить</a>`);
    } else if (t.dataset.inc) setQty(t.dataset.inc, (cart[t.dataset.inc] || 0) + 1);
    else if (t.dataset.dec) setQty(t.dataset.dec, (cart[t.dataset.dec] || 0) - 1);
    else if (t.dataset.remove) setQty(t.dataset.remove, 0);
    else if (t.dataset.f) {
      const st = catalogState();
      const key = { color: "fam" }[t.dataset.f] || t.dataset.f;
      const cur = st[key];
      const v = t.dataset.v;
      setCatalogState({ [key]: cur.includes(v) ? cur.filter((x) => x !== v) : cur.concat(v) });
    } else if (t.dataset.unf) {
      const key = { color: "fam" }[t.dataset.unf] || t.dataset.unf;
      if (key === "min" || key === "max") setCatalogState({ [key]: 0 });
      else setCatalogState({ [key]: catalogState()[key].filter((x) => x !== t.dataset.v) });
    } else if (t.hasAttribute("data-reset")) {
      setCatalogState({ brand: [], mem: [], fam: [], ver: [], cat: [], min: 0, max: 0 });
    } else if (t.hasAttribute("data-more")) {
      route.limit += PAGE;
      renderCatalog(true);
    } else if (t.hasAttribute("data-open-filters")) {
      $("#filters").classList.add("is-open");
      const bd = document.createElement("div");
      bd.className = "sheet-backdrop";
      bd.addEventListener("click", closeFilters);
      document.body.appendChild(bd);
      document.body.style.overflow = "hidden";
    } else if (t.hasAttribute("data-close-filters")) closeFilters();
    else if (t.hasAttribute("data-specs-toggle")) {
      const w = $(".specs-wrap");
      w.classList.toggle("is-collapsed");
      t.textContent = w.classList.contains("is-collapsed") ? "Все характеристики" : "Свернуть";
    } else if (t.hasAttribute("data-copy-order")) {
      const ok = await copy(orderText(readForm()));
      toast(ok ? `${icon("check")}Текст заказа скопирован` : "Не удалось скопировать — выделите текст вручную");
    }
  });

  document.addEventListener("change", (e) => {
    const t = e.target;
    if (t.matches("[data-sort]")) setCatalogState({ sort: t.value }, true);
    else if (t.matches("[data-price]")) setCatalogState({ [t.dataset.price]: Math.max(0, parseInt(t.value, 10) || 0) });
    else if (t.closest("#checkoutForm")) { readForm(); if (t.name === "delivery") renderCart(); }
  });
  document.addEventListener("input", (e) => { if (e.target.closest("#checkoutForm") && e.target.name !== "delivery") readForm(); });

  document.addEventListener("submit", (e) => {
    if (e.target.id !== "checkoutForm") return;
    e.preventDefault();
    const text = orderText(readForm());
    const copied = copySync(text);
    window.open(tgLink(text), "_blank", "noopener");
    toast(`${icon("check")}Открываем Telegram${copied ? " — текст заказа также скопирован" : ""}`);
  });

  darkMQ.addEventListener && darkMQ.addEventListener("change", render);
  window.addEventListener("hashchange", render);
  window.addEventListener("storage", (e) => { if (e.key === "octo-cart") { cart = store.get("octo-cart", {}); syncCart(); } });

  indexCatalog();
  initChrome();
  syncCart();
  render();
})();
