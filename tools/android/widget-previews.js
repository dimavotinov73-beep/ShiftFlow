// Картинки предпросмотра виджетов (меню «Виджеты» на Android 7–11). Запуск: node tools/android/widget-previews.js
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(execSync('node -e "process.stdout.write(require.resolve(\'playwright\'))"', { cwd:'/' }).toString()); }
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = path.join(ROOT, 'android/app/src/main/res/drawable-nodpi');
const font = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(ROOT, 'android/app/src/main/res/font', f)).toString('base64');
const css = `@font-face{font-family:U;src:url(${font('unbounded_bold.ttf')})}@font-face{font-family:O;src:url(${font('onest_bold.ttf')})}@font-face{font-family:OM;src:url(${font('onest_medium.ttf')})}
*{box-sizing:border-box}body{margin:0;background:transparent;font-family:O;color:#F1F5F4}
.w{border-radius:48px;background:linear-gradient(#171B1D,#0E1113);border:2px solid rgba(255,255,255,.12);padding:28px;display:flex;flex-direction:column;height:100%}
.h{display:flex;align-items:center;gap:14px;color:#A2ADAA;font-size:24px}.mark{width:44px;height:28px}
.big{font-family:U;font-size:56px;margin-top:12px;letter-spacing:-1px}.meta{font-family:OM;color:#A2ADAA;font-size:24px;margin-top:4px}
.st{display:flex;align-items:center;gap:14px;font-family:U;font-size:38px}.dot{width:20px;height:20px;border-radius:50%;background:#00AB89}
.sp{flex:1}.btns{display:flex;gap:12px}.b{flex:1;height:72px;border-radius:36px;display:flex;align-items:center;justify-content:center;font-size:24px}
.strip{display:flex;gap:8px;height:116px}.c{flex:1;border-radius:20px;background:#1C2124;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;font-size:28px}
.c small{font-size:18px;color:#68726F}.c em{font-style:normal;font-size:15px;color:#A2ADAA;max-width:90%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis}
.c i{position:absolute;bottom:10px;width:32px;height:6px;border-radius:3px}.t{outline:4px solid #3DDCB0;outline-offset:-4px}`;
const mark = `<svg class="mark" viewBox="10 27 80 48"><path d="M15 51.8L24.56 51.8A7 7 0 0 1 30.74 55.52A21.8 21.8 0 0 0 69.26 55.52A7 7 0 0 1 75.44 51.8L85 51.8" stroke="#F4FBF9" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="50" cy="45.3" r="14" fill="#3DDCB0"/></svg>`;
const days = [['ПН',10,'#00AB89','Кофейня'],['ВТ',11,'#00AB89','Кофейня'],['СР',12,'',''],['ЧТ',13,'#9260DA','Склад'],['ПТ',14,'#9260DA','Склад'],['СБ',15,'off','вых'],['ВС',16,'','']];
const cell = (d, names, today) => { const c = d[2] && d[2] !== 'off' ? d[2] : null; const bg = c ? `color-mix(in srgb, ${c} 34%, #1C2124)` : (d[2] === 'off' ? '#242A2D' : '#1C2124');
  return `<div class="c${today ? ' t' : ''}" style="background:${bg}"><small>${d[0]}</small><span>${d[1]}</span>${names && d[3] ? `<em>${d[3]}</em>` : ''}${c || d[2]==='off' ? `<i style="background:${c || '#68726F'}"></i>` : ''}</div>`; };
const pages = {
  today:[360, 360, `<div class="w"><div class="h">${mark}<span>Сегодня · пн, 10 ноября</span></div><div class="sp"></div><div class="st"><span class="dot"></span>Кофейня</div><div class="meta">8 ч · 2 560 ₽</div><div class="sp"></div><div class="btns"><div class="b" style="background:#1C2124">Сбросить</div><div class="b" style="background:#3DDCB0;color:#05110D">Открыть</div></div></div>`],
  month:[720, 360, `<div class="w"><div class="h">${mark}<span>Ноябрь · заработано</span></div><div class="big">15 320 ₽</div><div class="meta">5 смен · 52 ч</div><div class="sp"></div><div class="strip">${days.map((d,i)=>cell(d,true,i===0)).join('')}</div></div>`],
  week:[720, 170, `<div class="w" style="padding:16px"><div class="strip" style="height:100%">${days.map((d,i)=>cell(d,false,i===0)).join('')}</div></div>`]
};
(async () => {
  fs.mkdirSync(OUT, { recursive:true });
  const b = await pw.chromium.launch(); const p = await b.newPage();
  for (const [name, [w, h, body]] of Object.entries(pages)) {
    await p.setViewportSize({ width:w, height:h });
    await p.setContent(`<style>${css} html,body{width:${w}px;height:${h}px}</style>${body}`);
    await p.waitForTimeout(150);
    await p.screenshot({ path:path.join(OUT, `widget_preview_${name}.png`), omitBackground:true });
  }
  await b.close(); console.log('widget previews written');
})();
