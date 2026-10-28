"""Прайс поставщика из публичного Telegram-канала (по умолчанию t.me/BigSaleApple).

Канал ведёт прайс как набор постов, которые поставщик каждый день редактирует
(в начале поста — дата прайса, например «29/10/2026»). Публичную веб-версию канала
(t.me/s/<канал>) можно читать без входа в Telegram — её и разбираем.

Из каждой строки вида «🇮🇳 S26 12/256GB Black — 60100 (Snapdragon)» получаем:
  name   — «S26 12/256GB Black»   (без эмодзи и флагов)
  flags  — «IN»                   (страна поставки)
  note   — «(Snapdragon)»         (пометка после цены — это другой товар, она входит в ключ)
  price  — 60100
  key    — нормализованная строка, по которой объявление Авито связано с позицией прайса.
"""

import datetime as dt
import html
import re
import time
import unicodedata
import urllib.request

UA = "Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36"
MAX_PAGES = 40

POST_RE = re.compile(r'data-post="[^"/]+/(\d+)"(.*?)(?=data-post="|\Z)', re.S)
TEXT_RE = re.compile(r'<div class="tgme_widget_message_text[^"]*"[^>]*>(.*?)</div>', re.S)
EMOJI_IMG_RE = re.compile(r'<i class="emoji"[^>]*><b>(.*?)</b></i>', re.S)
DATE_RE = re.compile(r"\b(\d{1,2})[./](\d{1,2})[./](20\d\d)\b")

# Цена: «64000», «105.500», «209,000», «15 200». Перед ней не должно быть буквы, цифры или «/»
# (иначе это часть модели: «M402d», «16/512»), после — буквы или цифры («128 LTE», «65W»).
PRICE_RE = re.compile(r"(?<![\w/.,])(\d{1,3}(?:[ .,]\d{3})+|\d{3,7})(?![\w/%]|[.,]\d)")
SEPARATOR_RE = re.compile(r"[—–\-:=]\s*$")
CURRENCY_RE = re.compile(r"^\s*(?:₽|руб\.?|р\.)", re.I)
# Строки про допгарантию и услуги с «-1.000» — это не товары.
SKIP_LINE_RE = re.compile(r"🛡|гаранти|\+\s*\d+\s*мес", re.I)

# Кириллица, которую поставщик путает с латиницей в моделях («М5» вместо «M5»).
LOOKALIKE = str.maketrans("авекмнорстухё", "abekmhopctyxe")
# Цвета и слова, которые в объявлениях пишут по-русски, а в прайсе — по-английски (и наоборот).
SYNONYMS = {
    "черный": "black", "черная": "black", "белый": "white", "белая": "white", "серый": "gray", "grey": "gray",
    "серебристый": "silver", "серебристая": "silver", "золотой": "gold", "золотистый": "gold",
    "голубой": "blue", "синий": "blue", "темно-синий": "navy", "розовый": "pink", "желтый": "yellow",
    "зеленый": "green", "мятный": "mint", "фиолетовый": "purple", "лавандовый": "lavender",
    "красный": "red", "оранжевый": "orange", "графит": "graphite", "графитовый": "graphite",
    "кремовый": "cream", "бежевый": "beige", "титановый": "titanium", "cellular": "lte",
    "индиго": "indigo", "цитрусовый": "citrus", "ipro": "ipad pro",
}
SYNONYM_RE = re.compile(r"(?<!\w)(" + "|".join(map(re.escape, SYNONYMS)) + r")(?!\w)")


def fetch_posts(channel, pages=MAX_PAGES):
    """Все текстовые посты канала: {id: {"date": date|None, "text": str}}."""
    posts = {}
    url = f"https://t.me/s/{channel}"
    for _ in range(pages):
        page = _get(url)
        ids = []
        for m in POST_RE.finditer(page):
            pid, body = int(m.group(1)), m.group(2)
            ids.append(pid)
            texts = TEXT_RE.findall(body)
            if texts:
                text = _html_to_text(texts[0])
                posts[pid] = {"date": post_date(text), "text": text}
        if not ids or min(ids) <= 1:
            break
        url = f"https://t.me/s/{channel}?before={min(ids)}"
    return posts


def _get(url, tries=4):
    for attempt in range(tries):
        try:
            req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru"})
            with urllib.request.urlopen(req, timeout=40) as r:
                return r.read().decode("utf-8", "replace")
        except OSError:
            if attempt == tries - 1:
                raise
            time.sleep(2 ** (attempt + 1))


def _html_to_text(fragment):
    s = EMOJI_IMG_RE.sub(r"\1", fragment)
    s = re.sub(r"<br\s*/?>", "\n", s)
    return html.unescape(re.sub(r"<[^>]+>", "", s))


def post_date(text):
    """Дата прайса из начала поста («29/10/2026»)."""
    m = DATE_RE.search(text[:300])
    if not m:
        return None
    try:
        return dt.date(int(m.group(3)), int(m.group(2)), int(m.group(1)))
    except ValueError:
        return None


# ---------------------------------------------------------------------------
# Разбор строк
# ---------------------------------------------------------------------------

def flags_of(s):
    """Флаги стран («🇮🇳🇺🇸» → «IN/US»)."""
    ri = [chr(ord(c) - 0x1F1E6 + ord("A")) for c in s if 0x1F1E6 <= ord(c) <= 0x1F1FF]
    return "/".join("".join(ri[i:i + 2]) for i in range(0, len(ri) - 1, 2))


def strip_emoji(s):
    s = "".join(c for c in s if unicodedata.category(c) not in ("So", "Sk", "Cs", "Cf", "Mn", "Co"))
    return re.sub(r"\s+", " ", s).strip()


def normalize(s):
    """Строка для сравнения: нижний регистр, без эмодзи, «256 ГБ» → «256», «М5» → «m5»."""
    s = strip_emoji(s).lower().replace("ё", "е")
    s = SYNONYM_RE.sub(lambda m: SYNONYMS[m.group(1)], s)
    s = re.sub(r"(?<=[a-z]{3})(?=\d)", " ", s)  # «Fold8» = «Fold 8»
    s = re.sub(r"\s*/\s*", "/", s)
    s = re.sub(r"(\d)\s*(?:gb|гб)\b", r"\1", s)
    s = re.sub(r"(\d)\s*(?:tb|тб)\b", r"\1tb", s)
    s = re.sub(r"[^\w/+.]+", " ", s.translate(LOOKALIKE))
    return re.sub(r"\s+", " ", s).strip(" .")


def parse_price(line):
    """(название, цена, пометка) или None, если в строке нет цены."""
    matches = list(PRICE_RE.finditer(line))
    if not matches:
        return None
    m = matches[-1]
    before, rest = line[:m.start()], line[m.end():]
    if CURRENCY_RE.match(rest):
        rest = CURRENCY_RE.sub("", rest, count=1)
    if re.match(r"\s*[\w]", rest):  # после «цены» идёт текст — значит, это не цена
        return None
    digits = re.sub(r"\D", "", m.group(1))
    price = int(digits)
    grouped = not m.group(1).isdigit()
    after_sep = bool(SEPARATOR_RE.search(before))
    if not (after_sep or grouped):
        # Число без разделителя («черный 2100»): берём, только если похоже на цену, а не на год.
        if price < 1000 or 2015 <= price <= 2035:
            return None
    if price < 100:
        return None
    name = SEPARATOR_RE.sub("", before).strip()
    if not strip_emoji(name):
        return None
    return name, price, strip_emoji(rest).strip(" *")


def parse_post(pid, post):
    """Позиции прайса из одного поста."""
    items, header = [], ""
    for raw in post["text"].split("\n"):
        line = raw.strip()
        if not line or SKIP_LINE_RE.search(line) or DATE_RE.search(line):
            continue
        parsed = parse_price(line)
        if not parsed:
            plain = strip_emoji(line)
            if 2 <= len(plain) <= 40 and re.search(r"[A-Za-zА-Яа-я]", plain) and "." not in plain[-1:]:
                header = plain
            continue
        name_raw, price, note = parsed
        name = strip_emoji(name_raw)
        title = f"{name} {note}".strip()
        key = normalize(title)
        # Короткие строки («Obsidian — 11.700») без заголовка раздела ничего не значат.
        if len(key.split()) < 3 and header:
            key = normalize(f"{header} {title}")
        items.append({
            "key": key,
            "name": name,
            "note": note,
            "flags": flags_of(name_raw),
            "header": header,
            "price": price,
            "post": pid,
            "date": post["date"].isoformat() if post["date"] else None,
        })
    return items


def price_list(posts):
    """Прайс {key: позиция}. Если одна позиция встречается несколько раз (разные флаги), берём самую дешёвую."""
    result = {}
    for pid in sorted(posts):
        for item in parse_post(pid, posts[pid]):
            old = result.get(item["key"])
            if old is None or item["price"] < old["price"]:
                item["offers"] = (old["offers"] + 1) if old else 1
                result[item["key"]] = item
            else:
                old["offers"] += 1
    return result
