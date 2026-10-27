#!/usr/bin/env python3
"""Собирает каталог OctoStore с biggeek.ru: товары, фото, характеристики и цены на 2% ниже.

    python3 tools/update_catalog.py               # обновить всё
    python3 tools/update_catalog.py --details 300 # загрузить не больше 300 новых карточек товаров

Что делает:
  1. Обходит разделы из tools/sources.py и собирает товары, которые можно купить.
  2. Открывает карточки товаров: характеристики, комплектация, фото, варианты (SIM, раскладка…)
     и их цены. Карточки кешируются в assets/data/p/; заново открываются только товары
     с несколькими вариантами (у них цены вариантов меняются) и устаревшие (старше 30 дней).
  3. Считает цену: цена biggeek − 2%, с округлением вниз до 10 ₽.
  4. Скачивает главное фото товара в assets/img/p/ (WebP, до 600 px); дополнительные фото
     галереи сайт показывает по ссылкам на CDN источника.
  5. Пишет assets/data/catalog.js — каталог для сайта.

Если за запуск собрано заметно меньше товаров, чем в прошлый раз (сайт-источник
недоступен или изменился), каталог не перезаписывается и скрипт завершается с ошибкой.
"""

import argparse
import datetime as dt
import hashlib
import io
import json
import math
import re
import sys
from concurrent.futures import ThreadPoolExecutor
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import biggeek  # noqa: E402
from sources import CATEGORIES  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
OUT = ROOT / "assets" / "data" / "catalog.js"
DETAILS = ROOT / "assets" / "data" / "p"
IMAGES = ROOT / "assets" / "img" / "p"

DISCOUNT = 0.02
# Товары собственной марки источника: их нельзя купить у других поставщиков.
OWN_BRAND = re.compile(r"big\s*geek", re.I)
DETAILS_MAX_AGE = 30  # дней
SKIP_SPECS = {"Артикул", "Гарантийный срок", "Гарантия"}


def our_price(src):
    """Цена источника − 2%, вниз до 10 ₽."""
    return int(math.floor(src * (1 - DISCOUNT) / 10) * 10)


# ---------------------------------------------------------------------------
# Названия
# ---------------------------------------------------------------------------

TYPE_PREFIX = re.compile(
    r"^(?:Смартфон|Планшет|Ноутбук|Моноблок|Компьютер|Неттоп|Монитор|Умные часы|Смарт-часы|Часы)\s+", re.I)
COLOR_RE = re.compile(r"\(\s*[«\"]?(?P<ru>[^()|«»\"]+?)[»\"]?\s*\|\s*(?P<en>[^()]+?)\s*\)")
NOT_COLORS = {"Snapdragon", "Exynos", "Global", "OEM", "Wi-Fi", "Cellular", "Hairstyler", "Complete", "Long"}
BRANDS = [
    "Apple", "Samsung", "Google", "Xiaomi", "REDMI", "Redmi", "POCO", "OnePlus", "Nothing", "CMF", "HONOR", "Honor",
    "Huawei", "HUAWEI", "Vivo", "vivo", "Realme", "realme", "Dyson", "Sony", "PlayStation", "Nintendo", "Microsoft",
    "Xbox", "Valve", "Meta", "DJI", "Insta360", "GoPro", "Fujifilm", "Instax", "Canon", "Kodak", "Polaroid",
    "Marshall", "JBL", "Bose", "Beats", "Sennheiser", "Bang & Olufsen", "Harman Kardon", "Яндекс", "Yandex",
    "Garmin", "Amazfit", "Belkin", "Anker", "Baseus", "Ugreen", "UGREEN", "Satechi", "Logitech", "Keychron",
    "Native Union", "Spigen", "Benks", "PITAKA", "Pitaka", "Nomad", "Moft", "MOFT", "Peak Design", "Tesla",
    "Ray-Ban", "Oakley", "Plaud", "Ledger", "Trezor", "Kindle", "PocketBook", "ONYX", "Onyx", "Roborock",
    "Dreame", "Ecovacs", "Philips", "Oral-B", "Braun", "Nanoleaf", "Aqara", "Ninja", "SteelSeries", "Razer",
]


def detect_brand(title):
    for b in BRANDS:
        if re.search(rf"(?<![\w-]){re.escape(b)}(?![\w-])", title):
            return {"REDMI": "Xiaomi", "Redmi": "Xiaomi", "POCO": "Xiaomi", "Honor": "HONOR", "HUAWEI": "Huawei",
                    "vivo": "Vivo", "realme": "Realme", "Instax": "Fujifilm", "Yandex": "Яндекс", "PlayStation": "Sony",
                    "Xbox": "Microsoft", "UGREEN": "Ugreen", "Pitaka": "PITAKA", "MOFT": "Moft", "Onyx": "ONYX",
                    "Kindle": "Amazon"}.get(b, b)
    return None


def split_title(title, cat):
    """«Смартфон Apple iPhone 17 Pro 256 ГБ («Синий» | Deep Blue)» → имя, цвет (рус/англ), пометки."""
    t = re.sub(r"\s+", " ", title).strip()
    color_ru = color_en = None
    m = COLOR_RE.search(t)
    if m:
        color_ru, color_en = m.group("ru").strip(" «»"), m.group("en").strip(" «»")
        t = (t[:m.start()] + t[m.end():]).strip()
    notes = [n.strip() for n in re.findall(r"\(([^()]*)\)", t)]
    if not color_ru:
        # «(Nickel/Copper)» — цвет только по-английски
        en = next((n for n in notes if re.fullmatch(r"[A-Z][a-z]+(?:[ /][A-Z][a-z]+)*", n) and n not in NOT_COLORS), None)
        if en:
            color_ru = color_en = en
            t = t.replace(f"({en})", "")
    if cat in {"iphone", "samsung", "android", "tablets", "mac", "watch"}:
        t = TYPE_PREFIX.sub("", t)
        t = re.sub(r"\bApple (?=iPhone|iPad|MacBook|iMac|Mac|AirPods|Studio|Pro Display)", "", t)
        t = re.sub(r"^Samsung (?=Galaxy)", "", t)
    t = re.sub(r"\s(?:M[A-Z0-9]{3}\d|Z[0-9A-Z]{8})\b", "", t)  # артикулы Apple: MHFA4, Z1E8000J1
    t = re.sub(r"\s+", " ", t)
    t = re.sub(r"\s+,", ",", t)
    t = re.sub(r"[\s,]+$", "", t).strip()
    name = f"{t}, {color_ru}" if color_ru else t
    return name, color_ru, color_en, notes


def memory_of(title, cat):
    if cat == "watch":
        m = re.search(r"(\d{2})\s*мм", title)
        return f"{m.group(1)} мм" if m else None
    found = re.findall(r"(\d+)\s*(ГБ|ТБ|GB|TB|Гб|Тб)\b", title)
    if not found:
        return None
    n, unit = found[-1]  # «16 ГБ + 512 ГБ» → объём накопителя идёт последним
    unit = "ТБ" if unit.upper() in ("ТБ", "TB") else "ГБ"
    return f"{n} {unit}"


def guess_sub(cat, title):
    """Линейка для товаров из общих разделов — по названию."""
    t = title
    rules = {
        "iphone": [(r"iPhone (\d+e?|Air|Duo)( Pro Max| Pro| Plus| mini)?", lambda m: f"iPhone {m.group(1)}{m.group(2) or ''}")],
        "samsung": [(r"Galaxy (S\d+(?:\+| Ultra| Edge| FE)?|Z (?:Fold|Flip)\d+(?: Ultra| FE)?)", lambda m: f"Galaxy {m.group(1)}"),
                    (r"Galaxy A\d+", lambda m: "Galaxy A")],
        "mac": [(r"MacBook (Air|Pro) (1[3-6])", lambda m: f"MacBook {m.group(1)} {m.group(2)}"), (r"MacBook Neo", "MacBook Neo"),
                (r"iMac", "iMac 24"), (r"Mac mini", "Mac mini"), (r"Mac Studio", "Mac Studio"), (r"Display|Монитор", "Мониторы")],
        "tablets": [(r"iPad (Pro|Air) (1[13])", lambda m: f"iPad {m.group(1)} {m.group(2)}"), (r"iPad mini", "iPad mini"), (r"iPad", "iPad")],
        "watch": [(r"Apple Watch (Ultra|Series \d+|SE)", lambda m: f"Apple Watch {m.group(1)}")],
        "audio": [(r"AirPods Max", "AirPods Max"), (r"AirPods Pro", "AirPods Pro"), (r"AirPods", "AirPods"), (r"Beats", "Beats"),
                  (r"Galaxy Buds", "Galaxy Buds"), (r"[Нн]аушники", "Наушники")],
        "dyson": [(r"[Сс]тайлер", "Стайлеры"), (r"[Фф]ен", "Фены"), (r"[Вв]ыпрямит", "Выпрямители"), (r"[Пп]ылесос", "Пылесосы"),
                  (r"[Оо]чистит|[Уу]влажнит", "Очистители воздуха")],
    }
    for rx, res in rules.get(cat, []):
        m = re.search(rx, t)
        if m:
            return res(m) if callable(res) else res
    if cat in {"android", "tablets", "watch", "audio"}:
        b = detect_brand(t)
        if b:
            return b
    return "Другое"


# ---------------------------------------------------------------------------
# Карточки товаров (кеш в assets/data/p/<id>.json)
# ---------------------------------------------------------------------------

def parse_details(page):
    props = {}
    m = re.search(r'<script type="application/json" id="product-properties-json">(.*?)</script>', page, re.S)
    if m:
        try:
            props = json.loads(m.group(1))
        except ValueError:
            props = {}
    brand = None
    for raw in re.findall(r'<script[^>]*application/ld\+json[^>]*>(.*?)</script>', page, re.S):
        try:
            ld = json.loads(raw)
        except ValueError:
            continue
        if isinstance(ld, dict) and ld.get("@type") == "Product":
            b = ld.get("brand")
            brand = b.get("name") if isinstance(b, dict) else b
    specs = []
    for group, items in (props.get("featureGroups") or {}).items():
        rows = [[i.get("name", "").strip(), re.sub(r"\s+", " ", str(i.get("value", ""))).strip()] for i in items]
        rows = [r for r in rows if r[0] and r[1] and r[0] not in SKIP_SPECS]
        if rows:
            specs.append([group, rows])
    picker = props.get("variantCharacteristicPicker") or {}
    labels = {}
    for c in picker.get("characteristics") or []:
        for v in c.get("values") or []:
            labels[(str(c.get("id")), str(v.get("id")))] = (c.get("name") or "", (v.get("label") or v.get("name") or "").strip(), bool(c.get("isColor")))
    variants = []
    for row in picker.get("variantsMatrix") or []:
        if row.get("isNoOrder") or row.get("isAvailable") is False or not row.get("price"):
            continue
        parts = [labels.get((str(cid), str(vid))) for cid, vid in (row.get("valueIds") or {}).items()]
        variants.append({"vid": row.get("id"), "price": int(row["price"]), "parts": [p for p in parts if p]})
    # Фото товара — миниатюры галереи в начале страницы.
    gallery = []
    start = page.find("sl-prewiew-thumbs")
    end = page.find("prod-info", start) if start >= 0 else -1
    if start >= 0:
        for p in re.findall(r"//images\.biggeek\.ru/1/\d+/([0-9a-f]{4}/[^\s\"'&)]+?\.(?:jpe?g|png))", page[start:end]):
            if p not in gallery:
                gallery.append(p)
    return {
        "brand": brand,
        "specs": specs,
        "equipment": [e for e in props.get("equipment") or [] if isinstance(e, str)],
        "gallery": gallery[:10],
        "variants": variants,
    }


def load_detail(pid):
    f = DETAILS / f"{pid}.json"
    if f.exists():
        try:
            return json.loads(f.read_text(encoding="utf-8"))
        except ValueError:
            return None
    return None


def save_detail(pid, d):
    DETAILS.mkdir(parents=True, exist_ok=True)
    pub = {k: d[k] for k in ("brand", "specs", "equipment", "gallery", "fetched", "multi") if k in d}
    (DETAILS / f"{pid}.json").write_text(json.dumps(pub, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")


# ---------------------------------------------------------------------------
# Фото
# ---------------------------------------------------------------------------

def image_file(path):
    return hashlib.sha1(path.encode()).hexdigest()[:16] + ".webp"


def ensure_image(path):
    """Главное фото товара в assets/img/p/ (WebP до 600 px). Возвращает имя файла или None."""
    name = image_file(path)
    dest = IMAGES / name
    if dest.exists():
        return name
    # У части фото на CDN нет WebP-версии — тогда берём исходный JPG/PNG.
    data = biggeek.fetch(f"https://images.biggeek.ru/1/870/{path}.webp", binary=True) \
        or biggeek.fetch(f"https://images.biggeek.ru/1/870/{path}", binary=True)
    if not data:
        return None
    try:
        from PIL import Image
        im = Image.open(io.BytesIO(data))
        im = im.convert("RGBA") if im.mode in ("P", "LA") else im
        im.thumbnail((600, 600))
        buf = io.BytesIO()
        im.save(buf, "WEBP", quality=80, method=6)
        data = buf.getvalue()
    except ImportError:
        data = biggeek.fetch(f"https://images.biggeek.ru/1/424/{path}.webp", binary=True) or data
    IMAGES.mkdir(parents=True, exist_ok=True)
    dest.write_bytes(data)
    return name


# ---------------------------------------------------------------------------

def slug(s):
    return re.sub(r"[^a-z0-9]+", "-", s.lower()).strip("-")


def previous_count():
    if not OUT.exists():
        return 0
    m = re.search(r'"count":(\d+)', OUT.read_text(encoding="utf-8")[:500])
    return int(m.group(1)) if m else 0


def main():
    ap = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    ap.add_argument("--details", type=int, default=100000, help="максимум новых карточек товаров за запуск")
    ap.add_argument("--no-images", action="store_true", help="не скачивать фото")
    ap.add_argument("--listings", help=argparse.SUPPRESS)  # для отладки: JSON с уже собранными разделами
    args = ap.parse_args()
    today = dt.date.today().isoformat()

    # 1. Разделы
    cards, order = {}, []
    saved = json.loads(Path(args.listings).read_text(encoding="utf-8")) if args.listings else None
    for cat, srcs in CATEGORIES:
        for src_slug, sub in srcs:
            found = saved.get(f"{cat}|{src_slug}|{sub}", []) if saved else biggeek.crawl_category(src_slug)
            fresh = 0
            for c in found:
                if c["slug"] in cards or not c["buy"] or not c["price"] or OWN_BRAND.search(c["title"]):
                    continue
                c["cat"], c["sub"] = cat, sub or guess_sub(cat, c["title"])
                cards[c["slug"]] = c
                order.append(c["slug"])
                fresh += 1
            print(f"  {cat:11} {src_slug:48} {len(found):4} → +{fresh}", flush=True)
    print(f"Разделы: {len(cards)} товаров")

    prev = previous_count()
    if prev and len(cards) < prev * 0.6:
        sys.exit(f"Собрано {len(cards)} товаров против {prev} в прошлый раз — каталог не обновлён.")

    # 2. Карточки товаров. Обязательно — товары с несколькими вариантами (их цены берутся из карточки)
    #    и устаревшие; новые без вариантов — сколько позволяет --details.
    stale = (dt.date.today() - dt.timedelta(days=DETAILS_MAX_AGE)).isoformat()
    must, optional = [], []
    for s in order:
        c = cards[s]
        cached = load_detail(c["pid"] or slug(s))
        c["detail"] = cached
        if c["from"] or (cached and (cached.get("multi") or cached.get("fetched", "") < stale)):
            must.append(s)
        elif cached is None:
            optional.append(s)
    todo = must + optional[:max(args.details, 0)]
    print(f"Карточки товаров: обязательных {len(must)}, новых {min(len(optional), max(args.details, 0))} из {len(optional)}")
    def store_detail(i, page):
        if not page:
            return
        c = cards[todo[i]]
        d = parse_details(page)
        d["fetched"] = today
        d["multi"] = len(d["variants"]) > 1
        save_detail(c["pid"] or slug(todo[i]), d)
        c["detail"] = d

    biggeek.fetch_many([f"{biggeek.BASE}/products/{s}" for s in todo], workers=4, progress=200, on_result=store_detail)

    # 3. Фото (в несколько потоков; уже скачанные пропускаются)
    images = {}
    if not args.no_images:
        paths = sorted({c["img"] for c in cards.values() if c["img"]})
        missing = [p for p in paths if not (IMAGES / image_file(p)).exists()]
        print(f"Фото: {len(paths)}, скачать {len(missing)}")
        with ThreadPoolExecutor(max_workers=4) as pool:
            for path, name in zip(paths, pool.map(ensure_image, paths)):
                images[path] = name

    # 4. Каталог
    products, used_images, used_details = [], set(), set()
    for s in order:
        c = cards[s]
        pid = c["pid"] or slug(s)
        d = c.get("detail") or {}
        name, color_ru, color_en, notes = split_title(c["title"], c["cat"])
        img = images.get(c["img"])
        if img:
            used_images.add(img)
        if d.get("specs") or d.get("gallery"):
            used_details.add(pid)
        base = {
            "cat": c["cat"], "sub": c["sub"],
            "brand": d.get("brand") or detect_brand(c["title"]),
            "name": name, "mem": memory_of(c["title"], c["cat"]),
            "color": color_ru, "colorEn": color_en,
            "img": img, "d": pid if pid in used_details else None,
        }
        note = next((n for n in notes if re.search(r"верси|Global|CN|EU|Ростест|Snapdragon|Exynos", n, re.I)), None)
        variants = d.get("variants") or []
        if len(variants) > 1:
            for v in variants:
                labels = [lbl for (_, lbl, is_color) in v["parts"] if not is_color]
                colors = [lbl for (_, lbl, is_color) in v["parts"] if is_color]
                p = dict(base, id=f"{s}--{v['vid']}", price=our_price(v["price"]))
                if colors:
                    p["color"] = colors[0]
                    p["name"] = f"{split_title(c['title'], c['cat'])[0].split(', ')[0]}, {colors[0]}"
                p["ver"] = ", ".join(x for x in labels + ([note] if note else []) if x) or None
                products.append({k: v_ for k, v_ in p.items() if v_ not in (None, "", [])})
        else:
            price = variants[0]["price"] if variants else c["price"]
            p = dict(base, id=s, price=our_price(price), ver=note)
            if c["from"] and not variants:
                p["from"] = True
            products.append({k: v_ for k, v_ in p.items() if v_ not in (None, "", [])})

    # Удаляем фото и карточки товаров, которых больше нет в каталоге.
    if not args.no_images and IMAGES.exists():
        for f in IMAGES.glob("*.webp"):
            if f.name not in used_images:
                f.unlink()
    if DETAILS.exists():
        for f in DETAILS.glob("*.json"):
            if f.stem not in {c["pid"] or slug(s) for s, c in cards.items()}:
                f.unlink()

    data = {"updated": today, "count": len(products), "discount": DISCOUNT, "products": products}
    OUT.parent.mkdir(parents=True, exist_ok=True)
    OUT.write_text(
        "// Сгенерировано tools/update_catalog.py — не редактируйте вручную.\n"
        "window.OCTO_CATALOG = " + json.dumps(data, ensure_ascii=False, separators=(",", ":")) + ";\n",
        encoding="utf-8",
    )
    print(f"Готово: {len(products)} позиций → {OUT.relative_to(ROOT)}")


if __name__ == "__main__":
    main()
