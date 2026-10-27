#!/usr/bin/env python3
"""Пересобирает каталог сайта OctoStore из Telegram-канала @OctoStore46.

Скрипт читает публичную веб-версию канала (https://t.me/s/OctoStore46),
находит пост «Актуальный прайс» с кнопками-разделами, разбирает посты
с ценами и записывает каталог в assets/data/catalog.js.

Запуск (нужен только Python 3, без сторонних библиотек):

    python3 tools/update_prices.py                  # скачать канал и обновить каталог
    python3 tools/update_prices.py --html a.html b.html   # взять уже сохранённые страницы
"""

import argparse
import html
import json
import re
import sys
import urllib.request
from html.parser import HTMLParser
from pathlib import Path

CHANNEL = "OctoStore46"
ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "data" / "catalog.js"

# ---------------------------------------------------------------------------
# Загрузка и разбор HTML канала
# ---------------------------------------------------------------------------


class ChannelPage(HTMLParser):
    """Достаёт из t.me/s/<channel> посты: id, текст, ссылки и инлайн-кнопки."""

    def __init__(self):
        super().__init__(convert_charrefs=True)
        self.posts = {}
        self._post = None
        self._text_depth = 0
        self._div_depth = 0
        self._link = None
        self._button = None

    def handle_starttag(self, tag, attrs):
        a = dict(attrs)
        cls = a.get("class", "") or ""
        if tag == "div":
            self._div_depth += 1
            if "tgme_widget_message " in cls + " " and a.get("data-post"):
                pid = int(a["data-post"].split("/")[-1])
                self._post = self.posts.setdefault(
                    pid, {"id": pid, "text": "", "links": [], "buttons": []}
                )
            elif "tgme_widget_message_text" in cls and self._post is not None and not self._text_depth:
                self._post["text"] = ""
                self._text_depth = self._div_depth
        elif tag == "br" and self._text_depth:
            self._post["text"] += "\n"
        elif tag == "a" and self._post is not None:
            if "tgme_widget_message_inline_button" in cls:
                self._button = {"href": a.get("href", ""), "label": ""}
            elif self._text_depth:
                self._link = {"href": a.get("href", ""), "label": ""}
        elif tag == "img" and self._text_depth:
            # эмодзи-картинки внутри текста — берём alt, если он есть
            self._post["text"] += a.get("alt", "")

    def handle_endtag(self, tag):
        if tag == "div":
            if self._text_depth and self._div_depth == self._text_depth:
                self._text_depth = 0
            self._div_depth -= 1
        elif tag == "a":
            if self._button is not None:
                self._post["buttons"].append(self._button)
                self._button = None
            if self._link is not None:
                self._post["links"].append(self._link)
                self._link = None

    def handle_data(self, data):
        if self._button is not None:
            self._button["label"] += data
        if self._text_depth:
            self._post["text"] += data
            if self._link is not None:
                self._link["label"] += data


def fetch(url):
    req = urllib.request.Request(url, headers={"User-Agent": "Mozilla/5.0 OctoStore price updater"})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode("utf-8")


def parse_pages(pages):
    posts = {}
    for page in pages:
        p = ChannelPage()
        p.feed(page)
        posts.update(p.posts)
    return posts


def load_posts(html_files):
    if html_files:
        return parse_pages(Path(f).read_text(encoding="utf-8") for f in html_files)

    base = f"https://t.me/s/{CHANNEL}"
    posts = parse_pages([fetch(base)])
    # Листаем назад, пока не соберём все посты, на которые ссылается прайс.
    for _ in range(15):
        price = find_price_post(posts)
        needed = {ref for _, ref in section_refs(price)} if price else set()
        oldest = min(posts)
        if price and (not needed or min(needed) >= oldest):
            break
        more = parse_pages([fetch(f"{base}?before={oldest}")])
        if not set(more) - set(posts):
            break
        posts.update(more)
    return posts


def find_price_post(posts):
    """Самый свежий пост с кнопкой «Заказать» и ссылками на разделы."""
    for pid in sorted(posts, reverse=True):
        if any("заказ" in b["label"].lower() for b in posts[pid]["buttons"]):
            return posts[pid]
    return None


def section_refs(price_post):
    refs = []
    for b in price_post["buttons"]:
        m = re.search(rf"t\.me/{CHANNEL}/(\d+)", b["href"], re.I)
        if m:
            refs.append((b["label"].strip(), int(m.group(1))))
    return refs


# ---------------------------------------------------------------------------
# Текстовые утилиты
# ---------------------------------------------------------------------------

FLAG_RE = re.compile("[\U0001F1E6-\U0001F1FF]{2}")
EMOJI_RE = re.compile(
    "[\U0001F000-\U0001FAFF☀-➿⬀-⯿⌀-⏿️‍⃣]"
)
CYR2LAT = str.maketrans("аеорсхуАЕОРСХКМТВН", "aeopcxyAEOPCXKMTBH")
PRICE_TAIL = re.compile(
    r"^(?P<name>.+?)\s*[—–-]\s*(?P<price>\d{1,3}(?:[ .]\d{3})+|\d+|уточняйте цену)\s*₽?\s*(?P<rest>[^\d]*)$"
)
PRICE_ONLY = re.compile(r"^(?P<price>\d{1,3}(?:[ .]\d{3})+|\d+)\s*₽\s*(?P<rest>.*)$")
STOCK_RE = re.compile(r"·\s*(\d+)\s*шт\.?")

REGIONS = {
    "US": "США", "JP": "Япония", "AE": "ОАЭ", "IN": "Индия", "CN": "Китай",
    "HK": "Гонконг", "KR": "Корея", "EU": "Европа", "GB": "Великобритания",
    "TH": "Таиланд", "MY": "Малайзия", "SG": "Сингапур", "AU": "Австралия",
}
EU_PLUG = {"EU", "KR", "TH"}


def flag_codes(s):
    return [chr(ord(f[0]) - 0x1F1E6 + 65) + chr(ord(f[1]) - 0x1F1E6 + 65) for f in FLAG_RE.findall(s)]


def fix_mixed(word):
    """«Prо», «Maх», «Glaсier» — латиница с кириллическими двойниками."""
    if re.search("[A-Za-z]", word) and re.search("[А-Яа-яЁё]", word):
        return word.translate(CYR2LAT)
    return word


def clean(s):
    s = FLAG_RE.sub(" ", s)
    s = EMOJI_RE.sub(" ", s)
    s = " ".join(fix_mixed(w) for w in s.split())
    return s.strip(" :·—-")


def to_price(raw):
    if raw is None or "уточн" in raw:
        return None
    return int(re.sub(r"[ .]", "", raw))


def fmt_storage(v):
    """'256' -> '256 ГБ', '1Tb' -> '1 ТБ', '512GB' -> '512 ГБ'."""
    v = v.strip()
    m = re.match(r"(?i)^(\d+)\s*(tb|тб)$", v)
    if m:
        return f"{m.group(1)} ТБ"
    m = re.match(r"(?i)^(\d+)\s*(gb|гб)?$", v)
    if m:
        n = int(m.group(1))
        return f"{n} ТБ" if n < 8 else f"{n} ГБ"
    return v


def split_lines(text):
    """Строки поста: «товар — цена» или заголовок раздела.

    Возвращает список кортежей (kind, data):
      ("header", "Стайлеры HS05")
      ("item", {"raw": ..., "name": ..., "price": ..., "flags": [...], "transit": bool, "stock": n})
    Многострочные карточки вида «Название / Размер … · UPC … / 26.500₽»
    склеиваются в один товар.
    """
    lines = [l.strip() for l in text.split("\n")]
    lines = [l for l in lines if l and not re.fullmatch(r"[—\-_\s]+", l)]
    out = []
    pending = None
    for i, line in enumerate(lines):
        nxt = lines[i + 1] if i + 1 < len(lines) else ""
        if nxt.startswith("Размер"):
            pending = {"raw": line, "name": clean(line), "flags": flag_codes(line), "extra": {}}
            continue
        if pending and line.startswith("Размер"):
            m = re.search(r"Размер\s+([^·]+)", line)
            u = re.search(r"UPC:\s*(\d+)", line)
            if m:
                pending["extra"]["Размер"] = m.group(1).strip()
            if u:
                pending["extra"]["UPC"] = u.group(1)
            continue
        if pending:
            m = PRICE_ONLY.match(line)
            if m:
                stock = STOCK_RE.search(line)
                pending.update(price=to_price(m.group("price")), transit="🚕" in line,
                               stock=int(stock.group(1)) if stock else None)
                out.append(("item", pending))
                pending = None
                continue
        stock = STOCK_RE.search(line)
        body = STOCK_RE.sub("", line).strip()
        m = PRICE_TAIL.match(body)
        if m:
            out.append(("item", {
                "raw": m.group("name"),
                "name": clean(m.group("name")),
                "price": to_price(m.group("price")),
                "flags": flag_codes(m.group("name")),
                "transit": "🚕" in line,
                "stock": int(stock.group(1)) if stock else None,
                "extra": {},
            }))
        else:
            h = clean(line)
            if h and not re.fullmatch(r"\d+", h):
                out.append(("header", h))
    return out


# ---------------------------------------------------------------------------
# Разбор разделов
# ---------------------------------------------------------------------------

products = []


def add(cat, sub, brand, kind, name, item, color=None, mem=None, specs=None, **extra):
    specs = [list(s) for s in (specs or []) if s[1]]
    for k, v in item.get("extra", {}).items():
        specs.append([k, v])
    region = [c for c in item.get("flags", []) if c in REGIONS]
    p = {
        "cat": cat,
        "sub": sub,
        "brand": brand,
        "kind": kind,
        "name": " ".join(name.split()),
        "price": item.get("price"),
    }
    if color:
        p["color"] = color
    if mem:
        p["mem"] = mem
    if region:
        p["region"] = region
    if item.get("transit"):
        p["transit"] = True
    if item.get("stock"):
        p["stock"] = item["stock"]
    p.update({k: v for k, v in extra.items() if v})
    p["specs"] = specs
    products.append(p)


SIM_NAMES = {"esim": "только eSIM", "1sim": "nano-SIM + eSIM", "2sim": "2 nano-SIM"}


def parse_iphone(entries):
    rx = re.compile(
        r"^(?P<gen>1\d)\s*(?P<model>e|E|Air|Plus|Pro Max|Pro)?\s+(?P<mem>\d+\s*(?:TB|Tb|tb)?)\s+"
        r"(?P<color>.+?)(?:\s+(?P<sim>eSim|1Sim|2sim))?$"
    )
    for kind, it in entries:
        if kind != "item":
            continue
        m = rx.match(it["name"])
        if not m:
            print("  ! iPhone: не разобрано:", it["raw"], file=sys.stderr)
            continue
        model = m.group("model") or ""
        model = {"e": "e", "E": "e"}.get(model, model)
        title = f"iPhone {m.group('gen')}{model}" if model == "e" else f"iPhone {m.group('gen')} {model}".strip()
        color = m.group("color").replace("Glasier", "Glacier")
        mem = fmt_storage(m.group("mem"))
        sim = (m.group("sim") or "").lower()
        add("iphone", title, "Apple", "phone", f"{title} {mem} {color}", it,
            color=color, mem=mem, sim=SIM_NAMES.get(sim),
            specs=[("Модель", title), ("Память", mem), ("Цвет", color), ("SIM", SIM_NAMES.get(sim))])


def parse_samsung(entries):
    sub = "Galaxy"
    for kind, it in entries:
        if kind == "header":
            sub = it
            continue
        name = it["name"]
        article = None
        am = re.search(r"\b(SM-[A-Z0-9/]+(?:\s+CH)?)\b", name)
        if am:
            article = am.group(1)
            name = name.replace(article, "").strip()
        rest = name[len(sub):].strip() if name.startswith(sub) else name
        cat, kind_ = "samsung", "phone"
        if sub.startswith("Galaxy Tab"):
            cat, kind_ = "tablets", "tablet"
        elif sub.startswith("Galaxy Buds"):
            cat, kind_ = "audio", "earbuds"
        elif sub.startswith("Galaxy Watch"):
            cat, kind_ = "watch", "watch-round"
        elif "Fold" in sub:
            kind_ = "fold"
        elif "Flip" in sub:
            kind_ = "flip"
        mem = color = None
        mm = re.match(r"^(?P<ram>\d+)/(?P<rom>\d+\s*(?:TB)?)\s+(?P<color>.+)$", rest)
        if mm:
            mem = fmt_storage(mm.group("rom"))
            color = mm.group("color")
            title = f"{sub} {mm.group('ram')}/{mem} {color}"
            specs = [("Оперативная память", f"{mm.group('ram')} ГБ"), ("Встроенная память", mem), ("Цвет", color)]
        else:
            title = name if name.startswith("Galaxy") else f"{sub} {rest}"
            cm = re.search(r"(White|Silver|Black|Графит|Серебро)$", rest)
            color = cm.group(1) if cm else None
            specs = [("Цвет", color)]
        specs.append(("Артикул", article))
        add(cat, sub, "Samsung", kind_, title, it, color=color, mem=mem, article=article, specs=specs)


def parse_mac(entries):
    sub = None
    rx_imac = re.compile(r"iMac (?P<chip>M\d) \((?P<cpu>\d+)/(?P<gpu>\d+)/(?P<ram>\d+)/(?P<ssd>\d+\s*(?:Tb|TB)?)\)\s+(?P<color>.+)$")
    rx_mini = re.compile(r"Mini (?P<chip>M\d(?: Pro| Max)?) (?P<ram>\d+)/(?P<ssd>\d+)\s*ГБ$")
    rx_neo = re.compile(r"Neo (?P<ram>\d+)GB/(?P<ssd>\d+(?:GB|TB))/(?P<tid>Touch ID) (?P<color>.+)$")
    rx_book = re.compile(r"(?P<chip>M\d(?: Pro| Max)?)/(?P<ram>\d+)GB/(?P<ssd>\d+(?:GB|TB))\s+(?P<color>.+)$")
    for kind, it in entries:
        if kind == "header":
            h = re.sub(r"\s*20\d\d$", "", it)
            if h.lower().startswith("imac"):
                sub = "iMac 24"
            elif h.lower().startswith("mac mini"):
                sub = "Mac mini"
            elif h.startswith("MacBook Neo"):
                sub = "MacBook Neo"
            elif re.match(r"(Air|Pro) \d\d", h):
                sub = "MacBook " + re.match(r"(Air|Pro) \d\d", h).group(0)
            continue
        name = it["name"]
        article = None
        am = re.match(r"^([A-Z0-9]{5,10})\s+(.+)$", name)
        if am:
            article, name = am.group(1), am.group(2)
        if m := rx_imac.search(name):
            ssd = fmt_storage(m.group("ssd"))
            sub_ = "iMac 24"
            title = f"iMac 24\" {m.group('chip')} {m.group('cpu')}/{m.group('gpu')}-core {m.group('ram')}/{ssd} {m.group('color')}"
            add("mac", sub_, "Apple", "imac", title, it, color=m.group("color"), mem=ssd, article=article,
                specs=[("Чип", f"Apple {m.group('chip')}: {m.group('cpu')} CPU / {m.group('gpu')} GPU"),
                       ("Оперативная память", f"{m.group('ram')} ГБ"), ("SSD", ssd),
                       ("Цвет", m.group("color")), ("Артикул", article)])
        elif m := rx_mini.search(name):
            ssd = fmt_storage(m.group("ssd"))
            add("mac", "Mac mini", "Apple", "macmini", f"Mac mini {m.group('chip')} {m.group('ram')}/{ssd}", it,
                color="Silver", mem=ssd, article=article,
                specs=[("Чип", f"Apple {m.group('chip')}"), ("Оперативная память", f"{m.group('ram')} ГБ"),
                       ("SSD", ssd), ("Артикул", article)])
        elif m := rx_neo.search(name):
            ssd = fmt_storage(m.group("ssd"))
            add("mac", "MacBook Neo", "Apple", "laptop", f"MacBook Neo {m.group('ram')}/{ssd} Touch ID {m.group('color')}", it,
                color=m.group("color"), mem=ssd, article=article,
                specs=[("Оперативная память", f"{m.group('ram')} ГБ"), ("SSD", ssd), ("Touch ID", "есть"),
                       ("Цвет", m.group("color")), ("Артикул", article)])
        elif (m := rx_book.search(name)) and sub:
            ssd = fmt_storage(m.group("ssd"))
            add("mac", sub, "Apple", "laptop", f"{sub} {m.group('chip')} {m.group('ram')}/{ssd} {m.group('color')}", it,
                color=m.group("color"), mem=ssd, article=article,
                specs=[("Чип", f"Apple {m.group('chip')}"), ("Оперативная память", f"{m.group('ram')} ГБ"),
                       ("SSD", ssd), ("Цвет", m.group("color")), ("Артикул", article)])
        else:
            print("  ! Mac: не разобрано:", it["raw"], file=sys.stderr)


def parse_ipad(entries):
    sub = None
    rx = re.compile(r"(?P<conn>Wi-Fi|LTE)\s+(?P<mem>\d+)\s*ГБ\s+(?P<color>.+)$")
    for kind, it in entries:
        if kind == "header":
            h = re.sub(r"\s*20\d\d$", "", it)
            if h.startswith("iPad"):
                sub = (h.replace("iPad Mini", "iPad mini").replace("iPad 11 A16", "iPad 11 (A16)"))
            continue
        name = it["name"]
        if name.startswith("Apple Pencil"):
            add("accessories", "Клавиатуры, мыши и Pencil", "Apple", "pencil", name, it, color="White")
            continue
        m = rx.search(name)
        if not m or not sub:
            print("  ! iPad: не разобрано:", it["raw"], file=sys.stderr)
            continue
        mem = fmt_storage(m.group("mem"))
        conn = "Wi-Fi + Cellular" if m.group("conn") == "LTE" else "Wi-Fi"
        add("tablets", sub, "Apple", "tablet", f"{sub} {conn} {mem} {m.group('color')}", it,
            color=m.group("color"), mem=mem,
            specs=[("Модель", sub), ("Связь", conn), ("Память", mem), ("Цвет", m.group("color"))])


def parse_airpods(entries):
    for kind, it in entries:
        if kind != "item":
            continue
        name = it["name"].replace("Проводные наушники ", "")
        if "EarPods" in name:
            sub, kind_ = "EarPods", "earpods"
        elif "Max" in name:
            sub, kind_ = "AirPods Max", "headphones"
        elif "Pro" in name:
            sub, kind_ = "AirPods Pro", "earbuds"
        else:
            sub, kind_ = "AirPods", "earbuds"
        cm = re.search(r"\)\s+(\w+)$", name)
        color = cm.group(1) if cm else "White"
        add("audio", sub, "Apple", kind_, name, it, color=color,
            specs=[("Цвет", cm.group(1) if cm else None)])


def parse_watch(entries):
    sub, material = None, None
    rx = re.compile(r"^(?:SE \d|S \d+|Ultra \d)\s+(?P<size>\d{2})\s+(?P<rest>.+?)(?:\s+(?P<band>S/M|M/L|[SML]))?$")
    for kind, it in entries:
        if kind == "header":
            m = re.match(r"^(SE \d|Series \d+|Ultra \d)\s*(?:\((.+)\))?", it)
            if m:
                sub = "Apple Watch " + m.group(1)
                material = m.group(2)
            continue
        m = rx.match(it["name"])
        if not m or not sub:
            print("  ! Watch: не разобрано:", it["raw"], file=sys.stderr)
            continue
        rest = m.group("rest")
        band = m.group("band")
        mat = material or ("Титан" if "Ultra" in sub else "Алюминий")
        if "керамическ" in rest:
            mat = "Керамика"
            rest = rest.replace("керамический корпус", "").strip()
        title = f"{sub} {m.group('size')} мм {rest}" + (f" {band}" if band else "")
        add("watch", sub, "Apple", "watch", title, it, color=rest, mem=f"{m.group('size')} мм",
            specs=[("Корпус", f"{m.group('size')} мм, {mat.lower()}"), ("Цвет / ремешок", rest), ("Размер ремешка", band)])


def parse_yandex(entries):
    sub = None
    for kind, it in entries:
        if kind == "header":
            if "станции" not in it.lower():
                sub = re.sub(r"\s*\(.+\)$", "", it).replace("Яндекс ", "")
                sub = {"Макс 3.75": "Станция Макс", "Станция Дуо": "Станция Дуо Макс"}.get(sub, sub)
            continue
        color = it["name"].split()[-1]
        add("yandex", sub or "Станции", "Яндекс", "smartspeaker", it["name"], it, color=color,
            specs=[("Цвет", color)])


def parse_gaming(entries):
    sub = "PlayStation 5"
    for kind, it in entries:
        if kind == "header":
            low = it.lower()
            if "геймпад" in low:
                sub = "Геймпады PS5"
            elif "игры" in low:
                sub = "Игры для PS5"
            elif "quest" in low:
                sub = "Meta Quest"
            elif "xbox" in low and "линейка" not in low:
                sub = "Xbox"
            elif low == "steam":
                sub = "Steam"
            elif "nintendo" in low:
                sub = "Nintendo Switch"
            continue
        name = it["name"]
        brand, kind_, specs = "Sony", "console", []
        s = sub
        if sub == "PlayStation 5":
            if "VR2" in name:
                s, kind_ = "PlayStation VR2", "vr"
            elif "Portal" in name:
                s, kind_ = "PlayStation Portal", "handheld"
            elif not name.startswith("PlayStation 5"):
                s, kind_ = "Аксессуары PS5", "gamepad" if "DualSense" in name else "accessory"
        elif sub == "Геймпады PS5":
            kind_ = "gamepad"
            name = name.replace("DualSense PS5", "Геймпад DualSense")
        elif sub == "Игры для PS5":
            kind_ = "game"
            pm = re.match(r"^(PS\d(?:-\d)?)\s+(.+)$", name)
            if pm:
                platform = "PS4 / PS5" if pm.group(1) == "PS4-5" else pm.group(1)
                name = pm.group(2)
                specs.append(("Платформа", platform))
        elif sub == "Meta Quest":
            brand, kind_ = "Meta", "vr"
            name = re.sub(r"^Oculus Quest (\S+) (\d+)$", r"Meta Quest \1 \2 ГБ", name)
        elif sub == "Xbox":
            brand = "Microsoft"
            if "Series" not in name:
                kind_ = "gamepad"
                name = "Геймпад " + name
        elif sub == "Steam":
            brand, kind_ = "Valve", "handheld" if "Deck" in name else "console"
        elif sub == "Nintendo Switch":
            brand, kind_ = "Nintendo", "handheld"
        cm = re.search(r"\b(White|Black|Red|Blue|Silver|Purple|Pink|Camo|Indigo|Pearl|Teal)$", name)
        add("gaming", s, brand, kind_, name, it, color=cm.group(0) if cm else None, specs=specs)


# Длинные названия раньше коротких: «Prussian Blue/Rich Copper» прежде «Prussian Blue».
DYSON_COLORS = sorted([
    "Nickel/Copper", "Copper/Nickel", "Nickel Copper", "Ceramic Pop", "Strawberry Bronze", "Red Velvet/Gold",
    "Red Velvet", "Prussian Blue/Rich Copper", "Prussian Blue/Copper", "Prussian Blue", "Vinca Blue Topaz",
    "Amber Silk", "Ceramic Pink", "Ceramic Patina Topaz", "Ceramic Topaz", "Kanzan Pink", "Jasper Plum",
    "Apricot Topaz", "Blue/Copper", "Blue Copper", "Nickel/Yellow", "Yellow/Nickel", "Iron/Purple",
    "Iron/Yellow", "Black/Teal", "White/Silver", "Gold/White", "White", "Nickel", "Black",
], key=len, reverse=True)


def dyson_sub(header, current):
    low = header.lower()
    for key, val in (("стайлер", "Стайлеры"), ("фен", "Фены"), ("выпрямит", "Выпрямители"),
                     ("очистит", "Очистители и увлажнители"), ("сушилк", "Сушилки для рук")):
        if key in low:
            return val
    if "пылесос" in low or "моющ" in low or re.match(r"^(v\d+|gen\d)", low):
        return "Пылесосы"
    return current


def parse_dyson(entries):
    sub = "Стайлеры"
    for kind, it in entries:
        if kind == "header":
            if "вилк" in it.lower() or "стандарт" in it.lower():
                continue
            sub = dyson_sub(it, sub)
            continue
        name = it["name"]
        eu = "Вилка EU" in name
        name = name.replace("(Вилка EU)", "").strip()
        flags = set(it["flags"])
        if eu or (flags and flags <= EU_PLUG):
            plug = "EU — наш стандарт"
        else:
            plug = "иностранная + переходник"
        kind_ = {"Стайлеры": "styler", "Фены": "hairdryer", "Выпрямители": "straightener",
                 "Пылесосы": "vacuum", "Очистители и увлажнители": "purifier",
                 "Сушилки для рук": "handdryer"}[sub]
        if not name.startswith("Dyson"):
            name = "Dyson " + name
        color = next((c for c in DYSON_COLORS if c in name), None)
        region = ", ".join(REGIONS[c] for c in it["flags"] if c in REGIONS)
        add("dyson", sub, "Dyson", kind_, name, it, color=color, plug=plug,
            specs=[("Вилка", plug), ("Версия", region), ("Цвет", color)])


def parse_gadgets(entries):
    sub = None
    for kind, it in entries:
        if kind == "header":
            low = it.lower()
            if "canon" in low:
                sub = "Canon"
            elif "instax" in low:
                sub = "Instax"
            elif "kodak" in low:
                sub = "Kodak"
            elif "ray-ban" in low:
                sub = "Meta Ray-Ban"
            continue
        name = it["name"].replace("Install", "Instax")
        brand, kind_ = {"Canon": ("Canon", "camera"), "Instax": ("Fujifilm", "instant"),
                        "Kodak": ("Kodak", "camera"), "Meta Ray-Ban": ("Ray-Ban Meta", "glasses")}[sub]
        if "Картридж" in name:
            kind_ = "film"
        color = None
        specs = []
        if sub == "Meta Ray-Ban":
            m = re.match(r"^(?P<model>.+?)\s+—\s+(?P<frame>[^/]+?)\s*/\s*(?P<lens>.+)$", name)
            if m:
                name = f"Ray-Ban Meta {m.group('model')} {m.group('frame')} / {m.group('lens')}"
                color = m.group("frame")
                specs = [("Оправа", m.group("frame")), ("Линзы", m.group("lens"))]
        else:
            cm = re.search(r"\b((?:Clay |Candy |Dreamy |Frost |Lagoon )?(?:Black|Brown|Pink|Green|Blue|Purple|White|Silver))$", name)
            color = cm.group(1) if cm else None
            specs = [("Цвет", color)]
        add("gadgets", sub, brand, kind_, name, it, color=color, specs=specs)


def parse_accessories(entries):
    sub = None
    for kind, it in entries:
        if kind == "header":
            low = it.lower()
            if "стёкл" in low or "стекл" in low:
                sub = "Защитные стёкла и чехлы"
            elif "кабел" in low or low.startswith("для "):
                sub = "Кабели и зарядки"
            elif "блок" in low:
                sub = "Блоки питания"
            elif "мышк" in low or "клавиатур" in low:
                sub = "Клавиатуры, мыши и Pencil"
            elif "marshall" in low:
                sub = "Marshall"
            elif "прочее" in low:
                sub = "Прочее"
            continue
        name = it["name"]
        cat, brand, kind_, s = "accessories", None, "accessory", sub
        cm = re.search(r"\((Белая|Белый|Чёрная|Черная|Чёрный)\)|\b(White|Black|Starlight|Space Gray|Space Black|Midnight|Brown|Cream|Blue|Sage|Silver|Navy Blue|Lunar Silver)$", name)
        color = (cm.group(1) or cm.group(2)) if cm else None
        if sub == "Защитные стёкла и чехлы":
            kind_ = "case" if "Case" in name or "чехол" in name else "glass"
        elif sub == "Кабели и зарядки":
            kind_ = "charger" if "MagSafe Charger" in name else "cable"
            if "Apple Watch" in name or "MagSafe" in name:
                brand = "Apple"
        elif sub == "Блоки питания":
            kind_ = "charger"
        elif sub == "Клавиатуры, мыши и Pencil":
            brand = "Apple"
            kind_ = "mouse" if "Mouse" in name else "trackpad" if "Trackpad" in name else "keyboard"
        elif sub == "Marshall":
            cat, brand = "audio", "Marshall"
            if re.search(r"Major|Motif", name):
                s, kind_ = "Наушники Marshall", "headphones" if "Major" in name else "earbuds"
            else:
                s, kind_ = "Колонки Marshall", "speaker"
        elif sub == "Прочее":
            if name.startswith("Plaud"):
                cat, s, brand, kind_ = "gadgets", "Plaud", "Plaud", "recorder"
            elif name.startswith("AirTag"):
                cat, s, brand, kind_ = "gadgets", "AirTag", "Apple", "tag"
                color = "White"
            else:
                s, kind_ = "Кабели и зарядки", "cable"
        add(cat, s, brand, kind_, name, it, color=color, specs=[("Цвет", color)])


HANDLERS = [
    ("гаджет", parse_gadgets), ("камер", parse_gadgets), ("консол", parse_gaming),
    ("колонк", parse_yandex), ("dyson", parse_dyson), ("samsung", parse_samsung),
    ("imac", parse_mac), ("macbook", parse_mac), ("ipad", parse_ipad), ("airpods", parse_airpods),
    ("watch", parse_watch), ("iphone", parse_iphone), ("аксессуар", parse_accessories),
]


def handler_for(label):
    low = label.lower()
    for key, fn in HANDLERS:
        if key in low:
            return fn
    return None


# ---------------------------------------------------------------------------


def slug(s):
    tr = dict(zip("абвгдеёжзийклмнопрстуфхцчшщъыьэюя",
                  ["a", "b", "v", "g", "d", "e", "e", "zh", "z", "i", "y", "k", "l", "m", "n", "o", "p", "r", "s",
                   "t", "u", "f", "h", "c", "ch", "sh", "sch", "", "y", "", "e", "yu", "ya"]))
    s = "".join(tr.get(c, c) for c in s.lower())
    return re.sub(r"[^a-z0-9]+", "-", s).strip("-")


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--html", nargs="+", help="сохранённые страницы t.me/s/OctoStore46 вместо загрузки")
    args = ap.parse_args()

    posts = load_posts(args.html)
    price = find_price_post(posts)
    if not price:
        sys.exit("Не найден пост с прайсом (кнопка «Заказать»).")

    refs = section_refs(price)
    mapped = sorted((pid, handler_for(label), label) for label, pid in refs)
    sections = [(pid, fn, label) for pid, fn, label in mapped if fn]
    print(f"Прайс: пост #{price['id']}, разделов с товарами: {len(sections)}")

    # Длинный раздел может продолжаться в следующем посте без своей кнопки (Dyson: 159 → 160).
    known = {pid for _, pid in refs}
    for pid, fn, label in sections:
        chain = [pid]
        nxt = pid + 1
        while nxt in posts and nxt not in known and nxt != price["id"]:
            chain.append(nxt)
            nxt += 1
        entries = []
        for p in chain:
            if p not in posts:
                print(f"  ! пост #{p} ({label}) не найден", file=sys.stderr)
                continue
            entries += split_lines(posts[p]["text"])
        before = len(products)
        fn(entries)
        for prod in products[before:]:
            prod["post"] = chain[0]
        print(f"  #{'+'.join(map(str, chain))} {label.strip()}: {len(products) - before} товаров")

    seen = {}
    for p in products:
        base = slug(" ".join([p["name"], *p.get("region", []), p.get("sim", "") or "", p.get("plug", "")[:2]]))[:80]
        n = seen.get(base, 0)
        seen[base] = n + 1
        p["id"] = base if n == 0 else f"{base}-{n + 1}"

    date = None
    m = re.search(r"прайс на (\d{1,2})\.(\d{1,2})\.(\d{2,4})", price["text"], re.I)
    if m:
        y = m.group(3)
        date = f"{'20' + y if len(y) == 2 else y}-{int(m.group(2)):02d}-{int(m.group(1)):02d}"
    socials = {l["label"].strip().lower(): html.unescape(l["href"]) for l in price["links"]}

    # Контакт для заказов задаётся на сайте (ORDER_URL в assets/js/app.js), а не берётся из канала.
    data = {
        "updated": date,
        "channel": f"https://t.me/{CHANNEL}",
        "socials": socials,
        "products": [{"id": p.pop("id"), **p} for p in products],
    }
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// Сгенерировано tools/update_prices.py из t.me/" + CHANNEL + " — не редактируйте вручную.\n"
        "window.OCTO_CATALOG = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Готово: {len(products)} товаров, прайс от {date} → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
