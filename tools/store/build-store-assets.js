// Генерирует графику для магазинов приложений из настоящего интерфейса ShiftFlow:
//   store/screenshots/{ru,en}/*.png   — скриншоты 1080×1920 с подписями (Google Play, RuStore)
//   store/graphics/feature-graphic.png — баннер 1024×500 (Google Play)
//   web/icons/og-image.png            — превью ссылки 1200×630
//   web/icons/screenshot-*.png        — скриншоты для манифеста PWA
// Запуск из корня репозитория:  node tools/store/build-store-assets.js
// Нужен Playwright с Chromium (npm i -g playwright && npx playwright install chromium).
const http = require('http');
const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');
const seed = require('./demo-data.js');

let playwright;
try { playwright = require('playwright'); }
catch (e) { playwright = require(execSync('node -e "process.stdout.write(require.resolve(\'playwright\'))"', { cwd:'/' }).toString()); }

const ROOT = path.resolve(__dirname, '..', '..');
const WEB = path.join(ROOT, 'web');
const TYPES = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.css':'text/css', '.svg':'image/svg+xml', '.png':'image/png',
                '.woff2':'font/woff2', '.json':'application/json', '.webmanifest':'application/manifest+json' };

const COPY = {
  ru: [
    { file:'01-calendar',  title:'Все смены —<br>в одном календаре', sub:'Отмечай смены и выходные в одно касание' },
    { file:'02-day',       title:'Ставка, часы<br>и чаевые', sub:'Доход за каждый день считается сам' },
    { file:'03-finance',   title:'Сколько заработал —<br>видно сразу', sub:'Итоги по каждому месту работы' },
    { file:'04-year',      title:'Весь год<br>как на ладони', sub:'Статистика и выгрузка в Excel' },
    { file:'05-pattern',   title:'График 2/2<br>за секунду', sub:'Шаблоны смен до конца месяца' },
    { file:'06-style',     title:'Сделай его<br>своим', sub:'Тема, цвет, размер текста' }
  ],
  en: [
    { file:'01-calendar',  title:'Every shift<br>in one calendar', sub:'Mark shifts and days off in one tap' },
    { file:'02-day',       title:'Rates, hours<br>and tips', sub:'Daily pay is calculated for you' },
    { file:'03-finance',   title:'See what you earned<br>at a glance', sub:'Totals for every workplace' },
    { file:'04-year',      title:'Your whole year<br>in one view', sub:'Statistics and Excel export' },
    { file:'05-pattern',   title:'A 2/2 schedule<br>in a second', sub:'Shift patterns to month end' },
    { file:'06-style',     title:'Make it<br>yours', sub:'Theme, color, text size' }
  ]
};

function serve() {
  return new Promise((resolve) => {
    const srv = http.createServer((req, res) => {
      let p = decodeURIComponent(req.url.split('?')[0]);
      if (p.endsWith('/')) p += 'index.html';
      const f = path.join(WEB, p);
      if (!f.startsWith(WEB) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
      res.writeHead(200, { 'Content-Type': TYPES[path.extname(f)] || 'application/octet-stream', 'Access-Control-Allow-Origin': '*' });
      fs.createReadStream(f).pipe(res);
    });
    srv.listen(0, '127.0.0.1', () => resolve(srv));
  });
}
const out = (p) => { const f = path.join(ROOT, p); fs.mkdirSync(path.dirname(f), { recursive:true }); return f; };
const dataUri = (buf) => 'data:image/png;base64,' + buf.toString('base64');

async function captureApp(browser, base, lang) {
  const s = seed(lang);
  const ctx = await browser.newContext({ viewport:{ width:360, height:721 }, deviceScaleFactor:3, isMobile:true, hasTouch:true, colorScheme:'dark', locale:lang === 'en' ? 'en-US' : 'ru-RU' });
  await ctx.addInitScript(([p, d]) => {
    if (!sessionStorage.getItem('seeded')) { localStorage.setItem('tabel-prefs', p); localStorage.setItem('tabel-data', d); sessionStorage.setItem('seeded', '1'); }
  }, [JSON.stringify(s.prefs), JSON.stringify(s.data)]);
  const page = await ctx.newPage();
  await page.clock.setFixedTime(new Date('2026-11-09T12:00:00'));
  await page.goto(base + '/index.html');
  await page.waitForTimeout(1600);
  const shots = {};
  const snap = async (name) => { await page.waitForTimeout(250); shots[name] = await page.screenshot(); };
  const scrollTo = async (sel, offset) => { await page.evaluate(([q, o]) => { const e = document.querySelector(q); window.scrollTo(0, e ? e.getBoundingClientRect().top + window.pageYOffset - o : 0); }, [sel, offset]); await page.waitForTimeout(500); };

  await snap('01-calendar');
  await page.click('.grid .day[data-k="2026-11-03"]'); await page.waitForTimeout(700);
  await scrollTo('.cal', 8); await page.evaluate(() => window.scrollBy(0, 330)); await page.waitForTimeout(500);
  await snap('02-day');
  await page.click('[data-act="closeEditor"]');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.click('[data-act="togglePattern"]'); await page.waitForTimeout(700);
  await scrollTo('[data-key="pattern"]', 70);
  await snap('05-pattern');
  await page.click('[data-act="togglePattern"]'); await page.waitForTimeout(300);

  await page.click('.tb-tab[data-i="1"]'); await page.waitForTimeout(1500);
  await snap('03-finance');
  await scrollTo('.chart', 190); await page.waitForTimeout(900);
  await snap('04-year');

  await page.click('.tb-tab[data-i="2"]'); await page.waitForTimeout(1200);
  await page.click('[data-act="openPage"][data-p="appearance"]'); await page.waitForTimeout(1100);
  await snap('06-style');
  await ctx.close();
  return shots;
}

function frameHtml(base, shot, copy) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{ font-family:M; font-weight:200 800; src:url(${base}/fonts/manrope-cyrillic.woff2) format("woff2"); unicode-range:U+0400-045F; }
  @font-face{ font-family:M; font-weight:200 800; src:url(${base}/fonts/manrope-latin.woff2) format("woff2"); unicode-range:U+0000-00FF,U+2000-206F; }
  html,body{ margin:0; width:1080px; height:1920px; overflow:hidden; }
  body{ background:radial-gradient(70% 40% at 20% 8%, rgba(61,220,176,.30), transparent 70%), radial-gradient(60% 40% at 100% 30%, rgba(146,96,218,.20), transparent 70%), linear-gradient(180deg, #0B1715, #060708 70%);
    font-family:M, sans-serif; color:#F1F5F4; -webkit-font-smoothing:antialiased; }
  h1{ position:absolute; left:84px; right:84px; top:96px; margin:0; font-size:80px; line-height:1.04; letter-spacing:-.045em; font-weight:800; }
  p{ position:absolute; left:86px; right:84px; top:290px; margin:0; font-size:36px; color:#A9C9C0; font-weight:600; letter-spacing:-.01em; }
  .phone{ position:absolute; left:160px; top:400px; width:760px; height:1490px; border-radius:74px; padding:16px; box-sizing:border-box; background:linear-gradient(160deg,#2B3335,#0E1112);
    box-shadow:0 60px 120px rgba(0,0,0,.6), 0 0 0 2px rgba(255,255,255,.08) inset, 0 0 90px rgba(61,220,176,.15); }
  .phone img{ display:block; width:728px; height:1458px; border-radius:60px; object-fit:cover; object-position:top; }
  </style></head><body><h1>${copy.title}</h1><p>${copy.sub}</p><div class="phone"><img src="${dataUri(shot)}"></div></body></html>`;
}

function bannerHtml(base, shot, w, h, lang) {
  const tag = lang === 'en' ? 'Shifts and income,<br>under control' : 'Смены и доход —<br>под контролем';
  const small = lang === 'en' ? 'Offline · No account · No ads' : 'Офлайн · Без аккаунта · Без рекламы';
  const icon = fs.readFileSync(path.join(WEB, 'icons', 'icon.svg'));
  const k = h / 500;
  return `<!doctype html><html><head><meta charset="utf-8"><style>
  @font-face{ font-family:M; font-weight:200 800; src:url(${base}/fonts/manrope-cyrillic.woff2) format("woff2"); unicode-range:U+0400-045F; }
  @font-face{ font-family:M; font-weight:200 800; src:url(${base}/fonts/manrope-latin.woff2) format("woff2"); unicode-range:U+0000-00FF,U+2000-206F; }
  html,body{ margin:0; width:${w}px; height:${h}px; overflow:hidden; }
  body{ position:relative; background:radial-gradient(60% 90% at 78% 40%, rgba(61,220,176,.28), transparent 70%), radial-gradient(50% 70% at 10% 100%, rgba(146,96,218,.18), transparent 70%), linear-gradient(120deg,#0B1715,#060708);
    font-family:M, sans-serif; color:#F1F5F4; -webkit-font-smoothing:antialiased; }
  .l{ position:absolute; left:${70*k}px; top:50%; transform:translateY(-50%); }
  .brand{ display:flex; align-items:center; gap:${18*k}px; }
  .brand img{ width:${86*k}px; height:${86*k}px; border-radius:${22*k}px; box-shadow:0 ${14*k}px ${40*k}px rgba(0,0,0,.45); }
  .brand b{ font-size:${54*k}px; letter-spacing:-.04em; font-weight:800; } .brand b i{ font-style:normal; color:#3DDCB0; }
  h1{ margin:${26*k}px 0 0; font-size:${44*k}px; line-height:1.08; letter-spacing:-.035em; font-weight:800; }
  p{ margin:${16*k}px 0 0; font-size:${19*k}px; color:#9FBFB6; font-weight:700; letter-spacing:.02em; }
  .phone{ position:absolute; right:${70*k}px; top:${46*k}px; width:${300*k}px; height:${560*k}px; border-radius:${44*k}px; padding:${9*k}px; background:linear-gradient(160deg,#2B3335,#0E1112);
    box-shadow:0 ${30*k}px ${80*k}px rgba(0,0,0,.55), 0 0 0 1px rgba(255,255,255,.08) inset; transform:rotate(-6deg); }
  .phone img{ width:100%; height:100%; border-radius:${36*k}px; object-fit:cover; object-position:top; display:block; }
  </style></head><body><div class="l"><div class="brand"><img src="data:image/svg+xml;base64,${icon.toString('base64')}"><b>Shift<i>Flow</i></b></div>
  <h1>${tag}</h1><p>${small}</p></div><div class="phone"><img src="${dataUri(shot)}"></div></body></html>`;
}

(async () => {
  const srv = await serve();
  const base = 'http://127.0.0.1:' + srv.address().port;
  const browser = await playwright.chromium.launch();
  const page = await browser.newPage({ deviceScaleFactor:1 });
  for (const lang of ['ru', 'en']) {
    const shots = await captureApp(browser, base, lang);
    for (const c of COPY[lang]) {
      await page.setViewportSize({ width:1080, height:1920 });
      await page.setContent(frameHtml(base, shots[c.file], c), { waitUntil:'networkidle' });
      await page.screenshot({ path:out(`store/screenshots/${lang}/${c.file}.png`) });
    }
    if (lang === 'ru') {
      fs.writeFileSync(out('web/icons/screenshot-calendar.png'), shots['01-calendar']);
      fs.writeFileSync(out('web/icons/screenshot-finance.png'), shots['03-finance']);
      await page.setViewportSize({ width:1024, height:500 });
      await page.setContent(bannerHtml(base, shots['01-calendar'], 1024, 500, 'ru'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('store/graphics/feature-graphic.png') });
      await page.setViewportSize({ width:1200, height:630 });
      await page.setContent(bannerHtml(base, shots['01-calendar'], 1200, 630, 'ru'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('web/icons/og-image.png') });
    } else {
      await page.setViewportSize({ width:1024, height:500 });
      await page.setContent(bannerHtml(base, shots['01-calendar'], 1024, 500, 'en'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('store/graphics/feature-graphic-en.png') });
    }
  }
  await browser.close();
  srv.close();
  console.log('store assets generated');
})();
