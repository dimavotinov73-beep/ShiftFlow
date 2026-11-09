// Собирает web/privacy.html и web/terms.html из тех же текстов, что показывает приложение (web/app.js).
// Запуск: node tools/legal/build-legal-pages.js   (нужен Playwright с Chromium)
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path'), http = require('http');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(execSync('node -e "process.stdout.write(require.resolve(\'playwright\'))"', { cwd:'/' }).toString()); }
const WEB = path.resolve(__dirname, '..', '..', 'web');
const T = { '.html':'text/html; charset=utf-8', '.js':'text/javascript', '.woff2':'font/woff2', '.svg':'image/svg+xml', '.webmanifest':'application/manifest+json', '.png':'image/png', '.json':'application/json' };

function page(kind, title, sub, ru, en, email){
  return `<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<meta name="color-scheme" content="dark light">
<meta http-equiv="Content-Security-Policy" content="default-src 'self'; style-src 'self' 'unsafe-inline'; img-src 'self'; font-src 'self'; script-src 'none'; object-src 'none'; base-uri 'none'; form-action 'none'">
<meta name="referrer" content="no-referrer">
<title>ShiftFlow — ${title}</title>
<meta name="description" content="${sub}">
<link rel="icon" href="icons/favicon.svg" type="image/svg+xml">
<!-- Сгенерировано tools/legal/build-legal-pages.js из текстов приложения — правь тексты в web/app.js -->
<style>
@font-face{ font-family:"Onest"; font-weight:100 900; font-display:swap; src:url(fonts/onest-cyrillic.woff2) format("woff2"); unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116; }
@font-face{ font-family:"Onest"; font-weight:100 900; font-display:swap; src:url(fonts/onest-latin.woff2) format("woff2"); unicode-range:U+0000-00FF,U+2000-206F,U+20AC,U+2122; }
@font-face{ font-family:"Unbounded"; font-weight:200 900; font-display:swap; src:url(fonts/unbounded-cyrillic.woff2) format("woff2"); unicode-range:U+0400-045F,U+0490-0491,U+04B0-04B1,U+2116; }
@font-face{ font-family:"Unbounded"; font-weight:200 900; font-display:swap; src:url(fonts/unbounded-latin.woff2) format("woff2"); unicode-range:U+0000-00FF,U+2000-206F,U+20AC,U+2122; }
:root{ color-scheme:dark; --bg:#08090B; --card:#111416; --text:#F1F5F4; --muted:#A2ADAA; --line:rgba(255,255,255,.08); --accent:#3DDCB0; }
@media (prefers-color-scheme: light){ :root{ color-scheme:light; --bg:#F3F5F4; --card:#FFFFFF; --text:#0E1513; --muted:#55615D; --line:rgba(12,32,27,.09); --accent:#1F8A6D; } }
*{ box-sizing:border-box; }
body{ margin:0; background:var(--bg); color:var(--text); font:16px/1.65 "Onest",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,sans-serif; -webkit-font-smoothing:antialiased; }
main{ max-width:760px; margin:0 auto; padding:max(28px, env(safe-area-inset-top)) max(18px, env(safe-area-inset-right)) 60px max(18px, env(safe-area-inset-left)); }
header{ display:flex; align-items:center; gap:14px; margin-bottom:24px; }
header img{ width:56px; height:56px; border-radius:16px; }
h1,h2{ font-family:"Unbounded","Onest",sans-serif; font-weight:700; text-wrap:balance; }
h1{ font-size:1.5rem; line-height:1.2; letter-spacing:-.02em; margin:0; }
h3{ font-size:1rem; margin:22px 0 6px; }
.sub{ color:var(--muted); font-weight:600; font-size:.9rem; }
nav{ display:flex; gap:16px; flex-wrap:wrap; margin:0 0 8px; font-weight:700; font-size:.9rem; }
section{ background:var(--card); border-radius:22px; padding:22px 20px; margin:16px 0; box-shadow:inset 0 0 0 1px var(--line); }
p{ margin:0 0 10px; color:var(--muted); }
b{ color:var(--text); }
a{ color:var(--accent); }
.lang{ display:inline-block; font-size:.72rem; font-weight:800; letter-spacing:.12em; text-transform:uppercase; color:var(--accent); margin-bottom:6px; }
footer{ color:var(--muted); font-size:.82rem; text-align:center; margin-top:28px; }
</style>
</head>
<body>
<main>
  <header><img src="icons/icon.svg" alt=""><div><h1>${title}</h1><div class="sub">ShiftFlow · ${kind === 'privacy' ? 'Privacy policy' : 'Terms of use'}</div></div></header>
  <nav><a href="terms.html">Пользовательское соглашение</a><a href="privacy.html">Политика конфиденциальности</a><a href="#en">English</a></nav>
  <section lang="ru"><span class="lang">Русский</span>${ru}</section>
  <section lang="en" id="en"><span class="lang">English</span>${en}</section>
  <footer>Связь с разработчиком: <a href="mailto:${email}">${email}</a> · <a href="./">Открыть ShiftFlow</a></footer>
</main>
</body>
</html>
`;
}

(async () => {
  const srv = http.createServer((req, res) => {
    let p = decodeURIComponent(req.url.split('?')[0]); if (p.endsWith('/')) p += 'index.html';
    const f = path.join(WEB, p);
    if (!f.startsWith(WEB) || !fs.existsSync(f)) { res.writeHead(404); res.end(); return; }
    res.writeHead(200, { 'Content-Type':T[path.extname(f)] || 'application/octet-stream' }); fs.createReadStream(f).pipe(res);
  }).listen(0, '127.0.0.1');
  await new Promise(r => srv.on('listening', r));
  const b = await pw.chromium.launch(); const p = await b.newPage();
  await p.goto('http://127.0.0.1:' + srv.address().port + '/index.html'); await p.waitForTimeout(800);
  const d = await p.evaluate(() => ({ terms_ru:LEGAL_RU, terms_en:LEGAL_EN, priv_ru:PRIVACY_RU, priv_en:PRIVACY_EN, email:SUPPORT_EMAIL }));
  await b.close(); srv.close();
  fs.writeFileSync(path.join(WEB, 'terms.html'), page('terms', 'Пользовательское соглашение', 'Условия использования приложения ShiftFlow.', d.terms_ru, d.terms_en, d.email));
  fs.writeFileSync(path.join(WEB, 'privacy.html'), page('privacy', 'Политика конфиденциальности', 'ShiftFlow не собирает и не передаёт персональные данные: всё хранится на устройстве.', d.priv_ru, d.priv_en, d.email));
  console.log('terms.html and privacy.html written');
})();
