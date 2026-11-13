// Картинки предпросмотра виджетов (меню «Виджеты»). Запуск: node tools/android/widget-previews.js
// Повторяют разметку из gen_widget_layouts.py и цвета из WidgetRenderer.java: светлая «бумага», акцент «Мята».
const { execSync } = require('child_process');
const fs = require('fs'), path = require('path');
let pw; try { pw = require('playwright'); } catch (e) { pw = require(execSync('node -e "process.stdout.write(require.resolve(\'playwright\'))"', { cwd:'/' }).toString()); }
const ROOT = path.resolve(__dirname, '..', '..');
const OUT = process.env.OUT_DIR || path.join(ROOT, 'android/app/src/main/res/drawable-nodpi');
const font = (f) => 'data:font/ttf;base64,' + fs.readFileSync(path.join(ROOT, 'android/app/src/main/res/font', f)).toString('base64');

const mix = (a, b, t) => { const x = [1,3,5].map(i => parseInt(a.substr(i,2),16)), y = [1,3,5].map(i => parseInt(b.substr(i,2),16));
  return '#' + x.map((v,i) => Math.round(v*t + y[i]*(1-t)).toString(16).padStart(2,'0')).join(''); };
const ACC = '#3DDCB0', BG = '#F9F6EE', CELL = '#E9E4D7', TEXT = '#1F1D1A', T2 = '#58544B', T3 = '#6B6659', RED = '#BD3521';
const OFF = mix(T3, CELL, .10), TODAY_NUM = mix(ACC, '#000000', .62);
const S = 2;   // 1dp = 2px
const css = `@font-face{font-family:D;src:url(${font('sofia_bold.ttf')})}@font-face{font-family:O;src:url(${font('onest_bold.ttf')})}@font-face{font-family:OM;src:url(${font('onest_medium.ttf')})}
*{box-sizing:border-box}body{margin:0;background:transparent;font-family:O;color:${TEXT}}
.w{border-radius:${24*S}px;background:${BG};box-shadow:inset 0 0 0 ${S}px rgba(31,29,26,.12);display:flex;flex-direction:column;height:100%}
.h{display:flex;align-items:center;gap:${7*S}px;color:${T2};font-size:${12*S}px;white-space:nowrap;overflow:hidden}.mark{width:${22*S}px;height:${14*S}px;flex:none}
.st{display:flex;align-items:center;gap:${8*S}px;font-family:D;font-size:${30*S}px;line-height:1;letter-spacing:.02em;text-transform:uppercase;white-space:nowrap}.dot{width:${10*S}px;height:${10*S}px;border-radius:50%;flex:none}
.sub{font-family:OM;color:${T2};font-size:${13*S}px;margin-top:${4*S}px}
.sp{flex:1}.pill{height:${38*S}px;border-radius:${8*S}px;background:${ACC};color:#05110D;display:flex;align-items:center;justify-content:center;font-family:D;font-size:${17*S}px;letter-spacing:.07em;text-transform:uppercase}
.row{display:flex;gap:${4*S}px;flex:1;min-height:0}
.wdr{display:flex;gap:${4*S}px;margin-top:${8*S}px}.wdr span{flex:1;text-align:center;font-size:${9*S}px}
.c{flex:1;min-width:0;border-radius:${6*S}px;display:flex;flex-direction:column;align-items:center;justify-content:center;position:relative;line-height:1}
.c .num{font-family:D}
.c .wd{font-size:${9*S}px;margin-bottom:${S}px}
.c .nm{font-family:D;font-size:var(--nm);letter-spacing:.04em;text-transform:uppercase;margin-top:${2*S}px;max-width:94%;overflow:hidden;white-space:nowrap;text-overflow:ellipsis;height:${11*S}px;display:flex;align-items:center}
.c i{position:absolute;bottom:var(--bb);width:${14*S}px;height:${3*S}px;border-radius:${2*S}px}.c.t{box-shadow:inset 0 0 0 ${2*S}px ${ACC}}`;
const mark = `<svg class="mark" viewBox="10 27 80 48"><path d="M15 51.8L24.56 51.8A7 7 0 0 1 30.74 55.52A21.8 21.8 0 0 0 69.26 55.52A7 7 0 0 1 75.44 51.8L85 51.8" stroke="${TEXT}" stroke-width="8" stroke-linecap="round" fill="none"/><circle cx="50" cy="45.3" r="14" fill="${ACC}"/></svg>`;

const WP = { k:['#00AB89','Кофейня'], s:['#9260DA','Склад'], r:['#D08000','Репетитор'] };
const WD = ['ПН','ВТ','СР','ЧТ','ПТ','СБ','ВС'];
// Ноябрь 2026: 1-е — воскресенье; «сегодня» — 10-е
const plan = { 2:'k',3:'k',4:'s',6:'k',7:'s',10:'k',11:'r',12:'k',13:'s',14:'k',16:'k',17:'s',19:'k',20:'k',21:'s',23:'k',24:'r',26:'k',27:'s',28:'k' };
const offs = new Set([1,8,15,22,29,5,18]);
const cell = (day, col, inMonth, opts) => {
  const w = inMonth && plan[day] ? WP[plan[day]] : null, off = inMonth && !w && offs.has(day), today = inMonth && day === 10;
  const weekend = col >= 5;
  let bg = w ? mix(w[0], CELL, .22) : off ? OFF : today ? mix(ACC, CELL, .10) : CELL;
  let num = weekend ? RED : TEXT;
  if(off) num = weekend ? mix(RED, T3, .6) : T3;
  if(today) num = TODAY_NUM;
  if(!inMonth){ bg = mix(bg, BG, .55); num = T3; }
  const nm = w ? w[1] : off ? 'вых' : '';
  return `<div class="c${today ? ' t' : ''}" style="background:${bg};--nm:${opts.nm}px;--bb:${opts.bb}px;padding-bottom:${opts.pb}px">`
    + (opts.wd ? `<span class="wd" style="color:${weekend ? RED : T3}">${WD[col]}</span>` : '')
    + `<span class="num" style="font-size:${opts.num}px;color:${num}">${day}</span><span class="nm" style="color:${w ? mix(w[0], TEXT, .6) : T3}">${nm}</span>`
    + (w || off ? `<i style="background:${w ? w[0] : T3}"></i>` : '') + `</div>`;
};
const monthGrid = (rows) => {
  const out = []; let day = -5;   // понедельник 26 октября
  for(let r = 0; r < 6; r++){
    const cells = [];
    for(let i = 0; i < 7; i++, day++){
      const inMonth = day >= 1 && day <= 30;
      const label = day < 1 ? 31 + day : day > 30 ? day - 30 : day;
      cells.push(cell(label, i, inMonth, { num:15*S, nm:10*S, bb:3*S, pb:5*S }));
    }
    out.push(`<div class="row" style="margin-top:${4*S}px">${cells.join('')}</div>`);
  }
  const start = Math.min(2, 6 - rows);   // окно недель вокруг текущей (как в WidgetRenderer.month)
  return out.slice(start, start + rows).join('');
};
const week = () => [9,10,11,12,13,14,15].map((d, i) => cell(d, i, true, { wd:true, num:19*S, nm:11*S, bb:5*S, pb:7*S })).join('');

const pages = {
  today:[360, 360, `<div class="w" style="padding:${14*S}px"><div class="h">${mark}<span>Вторник, 10 ноября</span></div><div class="sp"></div>
    <div class="st"><span class="dot" style="background:${WP.k[0]}"></span>Кофейня</div><div class="sub">8 ч · 2 560 ₽</div><div class="sp" style="min-height:${10*S}px"></div><div class="pill">Открыть</div></div>`],
  month:[720, 540, `<div class="w" style="padding:${12*S}px"><div class="h">${mark}<span>Ноябрь 2026</span></div>
    <div class="wdr">${WD.map((d,i) => `<span style="color:${i >= 5 ? RED : T3}">${d}</span>`).join('')}</div>${monthGrid(5)}</div>`],
  week:[720, 190, `<div class="w" style="padding:${8*S}px"><div class="row">${week()}</div></div>`]
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
