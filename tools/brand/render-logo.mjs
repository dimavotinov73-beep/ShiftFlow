// Делает PNG из SVG логотипа (store/brand/*.svg → store/brand/png/*.png) и собирает папку для загрузки в RuStore.
// Запуск: node tools/brand/render-logo.mjs   (после python3 tools/brand/build-logo.py; нужен Playwright с Chromium)
import { createRequire } from 'module';
import { readFileSync, mkdirSync, copyFileSync, readdirSync } from 'fs';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const require = createRequire(import.meta.url);
let playwright;
try { playwright = require('playwright'); }
catch { playwright = require(require('child_process').execSync('node -e "process.stdout.write(require.resolve(\'playwright\'))"', { cwd: '/' }).toString()); }

const ROOT = join(dirname(fileURLToPath(import.meta.url)), '..', '..');
const BRAND = join(ROOT, 'store', 'brand'), PNG = join(BRAND, 'png');
mkdirSync(PNG, { recursive: true });

// файл → ширины PNG (высота по пропорции); прозрачный фон, если в SVG нет подложки
const JOBS = {
  'shiftflow-logo-dark.svg': [2000, 800],
  'shiftflow-logo-light.svg': [2000, 800],
  'shiftflow-logo-tagline-dark.svg': [2000, 800],
  'shiftflow-logo-tagline-light.svg': [2000, 800],
  'shiftflow-logo-on-ink.svg': [2400],
  'shiftflow-logo-on-paper.svg': [2400],
  'shiftflow-stacked-on-ink.svg': [1200],
  'shiftflow-stacked-on-paper.svg': [1200],
  'shiftflow-mark-dark.svg': [1024, 256],
  'shiftflow-mark-light.svg': [1024, 256],
  'shiftflow-icon.svg': [1024, 512],
  'shiftflow-icon-rounded.svg': [1024],
  'shiftflow-avatar.svg': [400],
};

const browser = await playwright.chromium.launch();
const page = await browser.newPage({ deviceScaleFactor: 1 });
for (const [file, widths] of Object.entries(JOBS)) {
  const svg = readFileSync(join(BRAND, file), 'utf8');
  const [, w, h] = svg.match(/viewBox="0 0 ([\d.]+) ([\d.]+)"/).map(Number);
  const opaque = /<svg[^>]*>\s*<rect width=/.test(svg) && !/rx=/.test(svg.slice(0, 300));
  for (const W of widths) {
    const H = Math.round(W * h / w);
    await page.setViewportSize({ width: W, height: H });
    await page.setContent(`<html><body style="margin:0;background:transparent">${svg.replace(/width="[\d.]+" height="[\d.]+"/, `width="${W}" height="${H}"`)}</body></html>`);
    await page.screenshot({ path: join(PNG, file.replace('.svg', `-${W}.png`)), omitBackground: !opaque, clip: { x: 0, y: 0, width: W, height: H } });
  }
}
await browser.close();

// Папка «как загружать в RuStore»: значок 512×512 (без прозрачности) и скриншоты телефона 1080×1920
const RU = join(ROOT, 'store', 'rustore');
mkdirSync(join(RU, 'screenshots'), { recursive: true });
copyFileSync(join(ROOT, 'store', 'graphics', 'icon-512.png'), join(RU, 'icon-512.png'));
for (const f of readdirSync(join(ROOT, 'store', 'screenshots', 'ru')).filter(f => f.endsWith('.png'))) copyFileSync(join(ROOT, 'store', 'screenshots', 'ru', f), join(RU, 'screenshots', f));
copyFileSync(join(PNG, 'shiftflow-avatar-400.png'), join(RU, 'avatar-400.png'));
console.log('png и store/rustore готовы');
