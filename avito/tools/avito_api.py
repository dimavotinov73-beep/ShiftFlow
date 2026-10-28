"""Минимальный клиент API Авито (https://developers.avito.ru): токен, список объявлений, смена цены."""

import json
import time
import urllib.error
import urllib.parse
import urllib.request

API = "https://api.avito.ru"


class AvitoError(RuntimeError):
    pass


class Avito:
    def __init__(self, client_id, client_secret):
        self.client_id = client_id
        self.client_secret = client_secret
        self.token = None

    def login(self):
        self._auth()

    def _auth(self):
        data = urllib.parse.urlencode({
            "grant_type": "client_credentials",
            "client_id": self.client_id,
            "client_secret": self.client_secret,
        }).encode()
        resp = self._call("POST", "/token", data=data, auth=False,
                          content_type="application/x-www-form-urlencoded")
        if "access_token" not in resp:
            raise AvitoError(f"Авито не выдал токен: {resp}. Проверьте AVITO_CLIENT_ID и AVITO_CLIENT_SECRET.")
        self.token = resp["access_token"]

    def _call(self, method, path, data=None, auth=True, content_type="application/json", tries=5):
        if auth and not self.token:
            self._auth()
        for attempt in range(tries):
            req = urllib.request.Request(API + path, data=data, method=method)
            req.add_header("Content-Type", content_type)
            if auth:
                req.add_header("Authorization", f"Bearer {self.token}")
            try:
                with urllib.request.urlopen(req, timeout=60) as r:
                    return json.loads(r.read() or b"{}")
            except urllib.error.HTTPError as e:
                body = e.read().decode("utf-8", "replace")[:500]
                if e.code == 429 or e.code >= 500:
                    time.sleep(min(60, 5 * (attempt + 1)))
                    continue
                if e.code in (401, 403) and auth and attempt == 0:
                    self._auth()  # токен живёт сутки — получим новый и повторим
                    continue
                raise AvitoError(f"{method} {path}: HTTP {e.code} {body}") from None
            except OSError:
                if attempt == tries - 1:
                    raise
                time.sleep(2 ** (attempt + 1))
        raise AvitoError(f"{method} {path}: Авито не отвечает")

    def items(self, status="active"):
        """Все объявления аккаунта: [{id, title, price, status, url, category}]. Лимит Авито — 25 запросов в минуту."""
        result, page = [], 1
        while True:
            q = urllib.parse.urlencode({"per_page": 100, "page": page, "status": status})
            resp = self._call("GET", f"/core/v1/items?{q}")
            chunk = resp.get("resources") or []
            result += chunk
            if len(chunk) < 100:
                return result
            page += 1
            time.sleep(2.5)

    def last_feed(self):
        """XML последнего файла Автозагрузки (в нём описания и цвета объявлений) или None."""
        try:
            report = self._call("GET", "/autoload/v2/reports/last_completed_report")
        except AvitoError:
            return None
        url = report.get("feed_url")
        if not url:
            return None
        req = urllib.request.Request(url, headers={"Authorization": f"Bearer {self.token}"})
        with urllib.request.urlopen(req, timeout=180) as r:
            return r.read()

    def update_price(self, item_id, price):
        """Новая цена объявления (целые рубли). Лимит Авито — 150 запросов в минуту."""
        resp = self._call("POST", f"/core/v1/items/{int(item_id)}/update_price",
                          data=json.dumps({"price": int(price)}).encode())
        if not (resp.get("result") or {}).get("success"):
            raise AvitoError(f"Авито не принял цену {price} для {item_id}: {resp}")
        time.sleep(0.45)
