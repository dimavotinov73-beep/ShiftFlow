"""Загрузка страниц biggeek.ru и разбор списков товаров в разделах."""

import html
import json
import re
import sys
import threading
import time
import urllib.error
import urllib.parse
import urllib.request
from concurrent.futures import ThreadPoolExecutor

BASE = "https://biggeek.ru"
UA = "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36"
DELAY = 0.6  # пауза между запросами, чтобы не нагружать сайт

_last = 0.0
_lock = threading.Lock()


def _throttle(url):
    """Не чаще одного запроса в DELAY секунд (к CDN картинок — чаще), в том числе из разных потоков."""
    global _last
    gap = 0.15 if "images.biggeek.ru" in url else DELAY
    with _lock:
        wait = gap - (time.time() - _last)
        if wait > 0:
            time.sleep(wait)
        _last = time.time()


def fetch(url, binary=False, tries=4):
    """GET с паузой между запросами и повторами. 404 → None."""
    url = urllib.parse.quote(url, safe=":/?&=%@()+,;~!*'#")  # в путях к фото бывает кириллица
    for attempt in range(tries):
        _throttle(url)
        req = urllib.request.Request(url, headers={"User-Agent": UA, "Accept-Language": "ru-RU,ru;q=0.9"})
        try:
            with urllib.request.urlopen(req, timeout=40) as resp:
                data = resp.read()
                return data if binary else data.decode("utf-8", "replace")
        except urllib.error.HTTPError as e:
            if e.code == 404:
                return None
            err = e
        except Exception as e:  # сеть, таймаут
            err = e
        time.sleep(2 ** attempt)
    print(f"  ! не удалось загрузить {url}: {err}", file=sys.stderr)
    return None


def fetch_many(urls, workers=3, progress=None):
    """Загружает страницы в несколько потоков; результаты в том же порядке, что и urls."""
    done = [0]

    def one(u):
        r = fetch(u)
        done[0] += 1
        if progress and done[0] % progress == 0:
            print(f"  загружено {done[0]} из {len(urls)}", flush=True)
        return r

    with ThreadPoolExecutor(max_workers=workers) as pool:
        return list(pool.map(one, urls))


def _num(s):
    s = re.sub(r"[^\d]", "", s or "")
    return int(s) if s else None


IMG_RE = re.compile(r"//images\.biggeek\.ru/1/\d+/(?P<path>[^\s\"']+?)(?:\.webp)?(?=[\s\"'])")


def parse_listing(page):
    """Карточки товаров со страницы раздела."""
    cards = []
    for chunk in re.split(r'<div class="catalog-card[ "]', page)[1:]:
        m = re.search(r'href="/products/([^"?#]+)"', chunk)
        t = re.search(r'catalog-card__title[^>]*>([^<]+)<', chunk)
        if not m or not t:
            continue
        price = re.search(r'cart-modal-count">\s*(от\s*)?([\d\s ]+)', chunk)
        old = re.search(r'class="old-price">([\d\s ]+)<', chunk)
        img = IMG_RE.search(chunk)
        pid = re.search(r'data-product-id="(\d+)"', chunk)
        cards.append({
            "slug": m.group(1),
            "title": html.unescape(t.group(1)).strip(),
            "price": _num(price.group(2)) if price else None,
            "from": bool(price and price.group(1)),
            "old": _num(old.group(1)) if old else None,
            "img": img.group("path") if img else None,
            "pid": pid.group(1) if pid else None,
            "buy": "catalog-card__cart" in chunk,
        })
    return cards


def crawl_category(slug, max_pages=60):
    """Все карточки раздела со всех страниц пагинации."""
    out, seen = [], set()
    for n in range(1, max_pages + 1):
        url = f"{BASE}/catalog/{slug}" + (f"?page={n}" if n > 1 else "")
        page = fetch(url)
        if page is None:
            break
        cards = [c for c in parse_listing(page) if c["slug"] not in seen]
        if not cards:
            break
        for c in cards:
            seen.add(c["slug"])
        out += cards
        pages = [int(x) for x in re.findall(rf'/catalog/{re.escape(slug)}\?page=(\d+)', page)]
        if not pages or n >= max(pages):
            break
    return out
