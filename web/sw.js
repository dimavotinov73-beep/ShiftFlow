/* ShiftFlow — офлайн-помощник.
   Приложение локальное: все файлы кэшируются, наружу запросов нет.
   Навигация: сначала сеть (чтобы обновления подхватывались сразу), без сети — копия из кэша.
   Остальное: кэш сразу + тихое обновление в фоне. */
const CACHE = 'shiftflow-v3.1.1';
const CORE = [
  './', './index.html', './boot.js', './app.js', './manifest.webmanifest', './privacy.html', './terms.html',
  './fonts/onest-cyrillic.woff2', './fonts/onest-latin.woff2', './fonts/onest-currency.woff2',
  './fonts/unbounded-cyrillic.woff2', './fonts/unbounded-latin.woff2', './fonts/unbounded-currency.woff2',
  './icons/icon.svg', './icons/favicon.svg', './icons/favicon-32.png', './icons/apple-touch-icon.png',
  './icons/icon-192.png', './icons/icon-512.png', './icons/maskable-192.png', './icons/maskable-512.png'
];

self.addEventListener('install', function(e){
  e.waitUntil(
    caches.open(CACHE)
      .then(function(c){ return c.addAll(CORE).catch(function(){}); })
      .then(function(){ return self.skipWaiting(); })
  );
});

self.addEventListener('activate', function(e){
  e.waitUntil(
    caches.keys()
      .then(function(keys){ return Promise.all(keys.filter(function(k){ return k !== CACHE; }).map(function(k){ return caches.delete(k); })); })
      .then(function(){ return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function(e){
  const req = e.request;
  if(req.method !== 'GET') return;
  const url = new URL(req.url);
  if(url.origin !== location.origin) return;
  if(url.pathname.endsWith('/version.json') || url.pathname.indexOf('/download/') >= 0) return;   /* всегда из сети */

  if(req.mode === 'navigate'){
    /* Каждая страница кэшируется под своим адресом; без сети — её копия или главная */
    const page = /\/(privacy|terms)\.html$/.test(url.pathname) ? url.pathname : './index.html';
    e.respondWith(
      fetch(req)
        .then(function(res){
          if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(page, copy); }); }
          return res;
        })
        .catch(function(){ return caches.match(page).then(function(hit){ return hit || caches.match('./index.html'); }); })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function(hit){
      const net = fetch(req).then(function(res){
        if(res && res.ok){ const copy = res.clone(); caches.open(CACHE).then(function(c){ c.put(req, copy); }); }
        return res;
      }).catch(function(){ return hit; });
      return hit || net;
    })
  );
});
