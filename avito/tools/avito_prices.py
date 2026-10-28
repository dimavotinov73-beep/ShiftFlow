#!/usr/bin/env python3
"""Обновляет цены объявлений на Авито по прайсу поставщика из Telegram-канала.

    python3 avito/tools/avito_prices.py prices          # скачать прайс → avito/data/prices.csv
    python3 avito/tools/avito_prices.py match           # подобрать позиции прайса к объявлениям → avito/mapping.csv
    python3 avito/tools/avito_prices.py sync            # показать, какие цены поменяются (ничего не меняет)
    python3 avito/tools/avito_prices.py sync --apply    # поменять цены на Авито

Ключи API берутся из переменных окружения AVITO_CLIENT_ID и AVITO_CLIENT_SECRET.

Как связаны объявления и прайс — файл avito/mapping.csv (открывается в Excel):
  avito_id, avito_title — объявление;
  source_key            — позиция прайса (её нормализованное название);
  checked               — «да», если пара проверена; цены меняются только у проверенных строк;
  rule                  — своё правило цены для строки: «+2000», «+5%», «-500», «=45000» (фиксированная)
                          или «нет» (не трогать). Пусто — общее правило из avito/config.json.

Защита от ошибок:
  - если в прайсе нашлось заметно меньше позиций, чем в прошлый раз, ничего не меняется;
  - позиции из постов, дата которых старше max_price_age_days, не используются;
  - цена, которая меняется больше чем на max_change_percent, не ставится (нужен --force);
  - если позиция пропала из прайса, объявление не трогается.
"""

import argparse
import csv
import datetime as dt
import json
import math
import os
import re
import sys
from pathlib import Path

sys.path.insert(0, str(Path(__file__).resolve().parent))
import telegram_prices as tp  # noqa: E402
from avito_api import Avito, AvitoError  # noqa: E402

ROOT = Path(__file__).resolve().parent.parent
CONFIG = ROOT / "config.json"
MAPPING = ROOT / "mapping.csv"
DATA = ROOT / "data"
SNAPSHOT = DATA / "prices.json"
PRICES_CSV = DATA / "prices.csv"
REPORT = DATA / "last_run.md"

FIELDS = ["avito_id", "avito_title", "avito_price", "source_key", "source_name", "source_price",
          "score", "checked", "rule", "alt_1", "alt_2"]
YES = {"да", "yes", "1", "+", "y", "д", "ok"}
MSK = dt.timezone(dt.timedelta(hours=3))


def load_config():
    return json.loads(CONFIG.read_text(encoding="utf-8"))


def avito_client():
    cid, secret = os.environ.get("AVITO_CLIENT_ID"), os.environ.get("AVITO_CLIENT_SECRET")
    if not cid or not secret:
        sys.exit("Нет ключей API: задайте AVITO_CLIENT_ID и AVITO_CLIENT_SECRET.")
    return Avito(cid, secret)


def load_items(args):
    if args.items_json:  # для проверки без доступа к API
        return json.loads(Path(args.items_json).read_text(encoding="utf-8"))
    return avito_client().items()


# ---------------------------------------------------------------------------
# Прайс
# ---------------------------------------------------------------------------

def load_price_list(cfg):
    """Свежий прайс из канала; если он подозрительно мал по сравнению с прошлым — ошибка."""
    prices = tp.price_list(tp.fetch_posts(cfg["channel"]))
    if SNAPSHOT.exists():
        before = json.loads(SNAPSHOT.read_text(encoding="utf-8")).get("count", 0)
        if before and len(prices) < before * cfg["min_items_ratio"]:
            sys.exit(f"В прайсе {len(prices)} позиций, в прошлый раз было {before}. "
                     "Похоже, канал недоступен или поменялся формат — цены не меняю.")
    return prices


def save_price_list(prices):
    DATA.mkdir(exist_ok=True)
    SNAPSHOT.write_text(json.dumps({
        "updated": dt.datetime.now(MSK).isoformat(timespec="minutes"),
        "count": len(prices),
        "items": {k: [v["price"], v["name"], v["note"], v["flags"], v["date"]] for k, v in sorted(prices.items())},
    }, ensure_ascii=False, indent=0), encoding="utf-8")
    with PRICES_CSV.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.writer(f, delimiter=";")
        w.writerow(["Позиция", "Пометка", "Страна", "Цена", "Дата прайса", "Раздел", "Ключ"])
        for v in sorted(prices.values(), key=lambda v: (v["post"], v["name"])):
            w.writerow([v["name"], v["note"], v["flags"], v["price"], v["date"] or "", v["header"], v["key"]])


# ---------------------------------------------------------------------------
# Подбор пар «объявление — позиция прайса»
# ---------------------------------------------------------------------------

def _weights(tokens):
    return {t: (2.0 if re.search(r"\d", t) else 1.0) for t in tokens}


COLORS = set(tp.SYNONYMS.values()) | {"midnight", "starlight", "natural", "silver", "violet", "sky", "space",
                                      "jet", "rose", "slate", "obsidian", "porcelain", "cosmic", "deep"}
# Слова, которые отличают модель: если оно есть только с одной стороны — это другой товар.
VARIANTS = {"lte", "pro", "max", "ultra", "mini", "plus", "air", "fe", "lite", "nano", "edge", "flip", "fold"}


def similarity(avito_tokens, source_tokens):
    """0…1: какая доля позиции прайса есть в названии объявления (и наоборот, с меньшим весом)."""
    a, s = _weights(avito_tokens), _weights(source_tokens)
    common = sum(s[t] for t in s if t in a)
    if not common:
        return 0.0
    score = 0.7 * common / sum(s.values()) + 0.3 * common / sum(a.values())
    a_colors, s_colors = avito_tokens & COLORS, source_tokens & COLORS
    if a_colors and s_colors and not (a_colors & s_colors):
        score *= 0.5
    score *= 0.7 ** len((avito_tokens ^ source_tokens) & VARIANTS)
    for kind in (MEMORY_RE, CHIP_RE):  # разная память или процессор — другой товар
        a_k = {t for t in avito_tokens if kind.match(t)}
        s_k = {t for t in source_tokens if kind.match(t)}
        if a_k and s_k and not (a_k & s_k):
            score *= 0.4
    return score


MEMORY_RE = re.compile(r"^(?:\d+/)?(?:32|64|128|256|512|\d+tb)$")
CHIP_RE = re.compile(r"^m\d$")


def best_matches(title, index, n=3):
    tokens = set(tp.normalize(title).split())
    scored = [(similarity(tokens, toks), key) for key, toks in index]
    scored.sort(reverse=True)
    return [(round(score, 2), key) for score, key in scored[:n] if score > 0]


def read_mapping():
    if not MAPPING.exists():
        return {}
    with MAPPING.open(encoding="utf-8-sig", newline="") as f:
        return {row["avito_id"]: row for row in csv.DictReader(f, delimiter=";") if row.get("avito_id")}


def write_mapping(rows):
    with MAPPING.open("w", encoding="utf-8-sig", newline="") as f:
        w = csv.DictWriter(f, FIELDS, delimiter=";", extrasaction="ignore")
        w.writeheader()
        for row in sorted(rows, key=lambda r: (r.get("checked", "").lower() in YES, -float(r.get("score") or 0))):
            w.writerow(row)


def cmd_match(args, cfg):
    prices = load_price_list(cfg)
    save_price_list(prices)
    items = load_items(args)
    index = [(key, set(key.split())) for key in prices]
    mapping = read_mapping()
    added = 0
    for item in items:
        aid = str(item["id"])
        row = mapping.get(aid)
        if row is None:
            found = best_matches(item["title"], index)
            row = {"avito_id": aid, "checked": "", "rule": ""}
            if found:
                row["score"], row["source_key"] = found[0]
                if row["score"] >= cfg.get("auto_check_score", 2):
                    row["checked"] = "да"
                for i, (score, key) in enumerate(found[1:3], 1):
                    row[f"alt_{i}"] = f"{key} ({prices[key]['price']})"
            mapping[aid] = row
            added += 1
        row["avito_title"] = item["title"]
        row["avito_price"] = item.get("price") or ""
        src = prices.get(row.get("source_key", ""))
        row["source_name"] = (f"{src['name']} {src['note']}".strip()) if src else ""
        row["source_price"] = src["price"] if src else ""
    write_mapping(mapping.values())
    print(f"Объявлений: {len(items)}, новых в {MAPPING.relative_to(ROOT.parent)}: {added}. "
          "Проверьте пары и поставьте «да» в колонке checked.")


# ---------------------------------------------------------------------------
# Цены
# ---------------------------------------------------------------------------

def round_price(value, cfg):
    step = cfg["round_to"] or 1
    fn = {"up": math.ceil, "down": math.floor}.get(cfg["round"], round)
    return int(fn(value / step) * step)


def target_price(source_price, rule, cfg):
    """Цена для Авито: общее правило из конфига или своё правило строки."""
    rule = (rule or "").replace(" ", "").replace(",", ".")
    if rule.startswith("="):
        return int(float(rule[1:]))
    if m := re.fullmatch(r"([+-]\d+(?:\.\d+)?)%", rule):
        return round_price(source_price * (1 + float(m.group(1)) / 100), cfg)
    if m := re.fullmatch(r"[+-]\d+", rule):
        return round_price(source_price + int(m.group(0)), cfg)
    if rule:
        raise ValueError(f"непонятное правило «{rule}»")
    return round_price(source_price * (1 + cfg["markup_percent"] / 100) + cfg["markup_rub"], cfg)


def cmd_sync(args, cfg):
    prices = load_price_list(cfg)
    items = {str(i["id"]): i for i in load_items(args)}
    mapping = read_mapping()
    if not mapping:
        sys.exit("avito/mapping.csv пуст — сначала запустите match и проверьте пары.")
    today = dt.datetime.now(MSK).date()
    changes, problems, same, unchecked = [], [], 0, 0

    for aid, row in mapping.items():
        if row.get("checked", "").strip().lower() not in YES:
            unchecked += 1
            continue
        if row.get("rule", "").strip().lower() in ("нет", "no", "-"):
            continue
        title = row.get("avito_title", "")
        item = items.get(aid)
        if item is None:
            problems.append((aid, title, "объявление не активно или удалено"))
            continue
        src = prices.get(row.get("source_key", ""))
        if src is None:
            problems.append((aid, title, f"позиции «{row.get('source_key')}» нет в прайсе"))
            continue
        if src["date"] and (today - dt.date.fromisoformat(src["date"])).days > cfg["max_price_age_days"]:
            problems.append((aid, title, f"прайс от {src['date']} устарел"))
            continue
        try:
            new = target_price(src["price"], row.get("rule"), cfg)
        except ValueError as e:
            problems.append((aid, title, str(e)))
            continue
        old = item.get("price")
        if old == new:
            same += 1
            continue
        if old and abs(new - old) / old * 100 > cfg["max_change_percent"] and not args.force:
            problems.append((aid, title, f"цена {old} → {new}: изменение больше {cfg['max_change_percent']}%"))
            continue
        changes.append((aid, item["title"], old, new, src["price"]))

    applied, failed = 0, []
    if args.apply and changes:
        client = avito_client()
        try:
            client.login()
        except AvitoError as e:
            sys.exit(str(e))
        for aid, title, old, new, _ in changes:
            try:
                client.update_price(aid, new)
                applied += 1
            except AvitoError as e:
                failed.append((aid, title, str(e)))
    problems += failed
    save_price_list(prices)
    report(changes, problems, same, unchecked, args.apply, applied)
    if failed:
        sys.exit(1)


def report(changes, problems, same, unchecked, applied_mode, applied):
    now = dt.datetime.now(MSK).strftime("%d.%m.%Y %H:%M")
    head = "Цены изменены" if applied_mode else "Проверка без изменений (тестовый режим)"
    lines = [f"# {head} — {now} МСК", ""]
    lines.append(f"- изменить: **{len(changes)}**" + (f", изменено: **{applied}**" if applied_mode else ""))
    lines.append(f"- цена уже верная: {same}")
    lines.append(f"- требуют внимания: {len(problems)}")
    lines.append(f"- не проверены в mapping.csv: {unchecked}")
    if changes:
        lines += ["", "## Новые цены", "", "| Объявление | Было | Стало | Прайс |", "|---|---:|---:|---:|"]
        lines += [f"| {t} ({a}) | {o or '—'} | {n} | {s} |" for a, t, o, n, s in changes]
    if problems:
        lines += ["", "## Не изменены", "", "| Объявление | Причина |", "|---|---|"]
        lines += [f"| {t} ({a}) | {why} |" for a, t, why in problems]
    text = "\n".join(lines) + "\n"
    DATA.mkdir(exist_ok=True)
    REPORT.write_text(text, encoding="utf-8")
    if os.environ.get("GITHUB_STEP_SUMMARY"):
        with open(os.environ["GITHUB_STEP_SUMMARY"], "a", encoding="utf-8") as f:
            f.write(text)
    print(text)


def cmd_prices(args, cfg):
    prices = load_price_list(cfg)
    save_price_list(prices)
    print(f"Позиций в прайсе: {len(prices)} → {PRICES_CSV.relative_to(ROOT.parent)}")


def main():
    p = argparse.ArgumentParser(description=__doc__, formatter_class=argparse.RawDescriptionHelpFormatter)
    sub = p.add_subparsers(dest="cmd", required=True)
    sub.add_parser("prices", help="скачать прайс из канала")
    for name in ("match", "sync"):
        s = sub.add_parser(name)
        s.add_argument("--items-json", help=argparse.SUPPRESS)
        if name == "sync":
            s.add_argument("--apply", action="store_true", help="на самом деле поменять цены на Авито")
            s.add_argument("--force", action="store_true", help="менять и цены, которые сильно скачут")
    args = p.parse_args()
    cfg = load_config()
    {"prices": cmd_prices, "match": cmd_match, "sync": cmd_sync}[args.cmd](args, cfg)


if __name__ == "__main__":
    main()
