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
    { file:'02-day',       title:'Две работы —<br>в одном дне', sub:'У каждой смены свои часы и оплата' },
    { file:'03-finance',   title:'Сколько заработал —<br>видно сразу', sub:'Итоги по каждому месту работы' },
    { file:'04-year',      title:'Весь год<br>как на ладони', sub:'Статистика и выгрузка в Excel' },
    { file:'05-pattern',   title:'График 2/2<br>за секунду', sub:'Шаблоны смен до конца месяца' },
    { file:'06-style',     title:'Сделай его<br>своим', sub:'Тема, цвет, размер текста' }
  ],
  en: [
    { file:'01-calendar',  title:'Every shift<br>in one calendar', sub:'Mark shifts and days off in one tap' },
    { file:'02-day',       title:'Two jobs<br>in one day', sub:'Each shift with its own hours and pay' },
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
  s.prefs.theme = 'light';   // скриншоты для магазинов — на «бумаге»
  const ctx = await browser.newContext({ viewport:{ width:360, height:721 }, deviceScaleFactor:3, isMobile:true, hasTouch:true, colorScheme:'light', locale:lang === 'en' ? 'en-US' : 'ru-RU' });
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

  await snap('00-top');
  await page.evaluate(() => window.scrollTo(0, 250)); await page.waitForTimeout(500);
  await snap('01-calendar');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.click('.grid .day[data-k="2026-11-05"]'); await page.waitForTimeout(700);
  await scrollTo('.panel', 70); await page.waitForTimeout(500);
  await snap('02-day');
  await page.click('[data-act="closeEditor"]');
  await page.evaluate(() => window.scrollTo(0, 0)); await page.waitForTimeout(300);
  await page.click('[data-act="openPattern"]'); await page.waitForTimeout(900);
  await page.evaluate(() => { const o = document.querySelector('.overlay'); if (o) o.scrollTo(0, 120); }); await page.waitForTimeout(400);
  await snap('05-pattern');
  await page.click('[data-act="ovlCloseBtn"]'); await page.waitForTimeout(500);

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

// Рамка скриншота: лист бумаги, заголовок набран как в табеле, приписка от руки, телефон — плоский, с «подложенным листом»
const FONTS = (base) => `
  @font-face{ font-family:D; font-weight:500 900; src:url(${base}/fonts/sofia-condensed.woff2) format("woff2"); }
  @font-face{ font-family:H; font-weight:600; src:url(${base}/fonts/caveat.woff2) format("woff2"); }
  @font-face{ font-family:M; font-weight:100 900; src:url(${base}/fonts/onest-cyrillic.woff2) format("woff2"); unicode-range:U+0400-045F; }
  @font-face{ font-family:M; font-weight:100 900; src:url(${base}/fonts/onest-latin.woff2) format("woff2"); unicode-range:U+0000-00FF,U+2000-206F; }`;
const PAPER = '#ECE7DA', INK = '#1F1D1A', MUTED = '#5E5A50', SHEET2 = '#D8D1BF';

function frameHtml(base, shot, copy) {
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS(base)}
  html,body{ margin:0; width:1080px; height:1920px; overflow:hidden; }
  body{ background:${PAPER}; font-family:M, sans-serif; color:${INK}; -webkit-font-smoothing:antialiased; }
  .head{ position:absolute; left:84px; right:84px; top:84px; padding-top:30px; border-top:6px solid ${INK}; }
  h1{ margin:0; font-family:D, M, sans-serif; font-size:106px; line-height:.92; letter-spacing:.01em; font-weight:900; text-transform:uppercase; }
  p{ margin:22px 0 0 4px; font-family:H, M, sans-serif; font-size:54px; line-height:1.02; color:${MUTED}; transform:rotate(-1.2deg); transform-origin:left center; }
  .phone{ position:absolute; left:160px; bottom:-60px; width:760px; height:1420px; border-radius:66px; padding:16px; box-sizing:border-box; background:${INK};
    box-shadow:22px 22px 0 ${SHEET2}; transform:rotate(-1deg); }
  .phone img{ display:block; width:728px; height:1388px; border-radius:52px; object-fit:cover; object-position:top; }
  </style></head><body><div class="head"><h1>${copy.title}</h1><p>${copy.sub}</p></div><div class="phone"><img src="${dataUri(shot)}"></div></body></html>`;
}

function bannerHtml(base, shot, w, h, lang) {
  const tag = lang === 'en' ? 'Shifts and income,<br>under control' : 'Смены и доход —<br>под контролем';
  const small = lang === 'en' ? 'offline · no account · no ads' : 'офлайн · без аккаунта · без рекламы';
  const icon = fs.readFileSync(path.join(WEB, 'icons', 'icon.svg'));
  const k = h / 500;
  return `<!doctype html><html><head><meta charset="utf-8"><style>${FONTS(base)}
  html,body{ margin:0; width:${w}px; height:${h}px; overflow:hidden; }
  body{ position:relative; background:${PAPER}; font-family:M, sans-serif; color:${INK}; -webkit-font-smoothing:antialiased; }
  .l{ position:absolute; left:${64*k}px; top:50%; transform:translateY(-50%); }
  .brand{ display:flex; align-items:center; gap:${16*k}px; }
  .brand img{ width:${78*k}px; height:${78*k}px; border-radius:${18*k}px; }
  .brand b{ font-family:D, M, sans-serif; font-size:${62*k}px; letter-spacing:.02em; font-weight:900; text-transform:uppercase; line-height:.9; } .brand b i{ font-style:normal; color:#1F7A62; }
  h1{ margin:${24*k}px 0 0; font-family:D, M, sans-serif; font-size:${74*k}px; line-height:.92; letter-spacing:.01em; font-weight:900; text-transform:uppercase; }
  p{ margin:${18*k}px 0 0; font-family:H, M, sans-serif; font-size:${34*k}px; line-height:1; color:${MUTED}; transform:rotate(-1.5deg); transform-origin:left center; }
  .phone{ position:absolute; right:${78*k}px; top:${46*k}px; width:${300*k}px; height:${560*k}px; border-radius:${42*k}px; padding:${9*k}px; background:${INK};
    box-shadow:${12*k}px ${12*k}px 0 ${SHEET2}; transform:rotate(-6deg); }
  .phone img{ width:100%; height:100%; border-radius:${34*k}px; object-fit:cover; object-position:top; display:block; }
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
      await page.setContent(bannerHtml(base, shots['00-top'], 1024, 500, 'ru'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('store/graphics/feature-graphic.png') });
      await page.setViewportSize({ width:1200, height:630 });
      await page.setContent(bannerHtml(base, shots['00-top'], 1200, 630, 'ru'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('web/icons/og-image.png') });
    } else {
      await page.setViewportSize({ width:1024, height:500 });
      await page.setContent(bannerHtml(base, shots['00-top'], 1024, 500, 'en'), { waitUntil:'networkidle' });
      await page.screenshot({ path:out('store/graphics/feature-graphic-en.png') });
    }
  }
  await browser.close();
  srv.close();
  console.log('store assets generated');
})();
