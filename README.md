<!DOCTYPE html>
<html lang="ru">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
<title>ShiftFlow</title>
<style>
  :root{
    --bg1:#0b1020; --bg2:#1a1040; --bg3:#062a3a;
    --glass:rgba(255,255,255,.12);
    --glass-strong:rgba(255,255,255,.18);
    --stroke:rgba(255,255,255,.28);
    --text:#fff; --muted:rgba(255,255,255,.65);
    --accent:#5ac8fa;
  }
  *{box-sizing:border-box; -webkit-tap-highlight-color:transparent;}
  html,body{height:100%;}
  body{
    margin:0; font-family:-apple-system,BlinkMacSystemFont,"SF Pro Display","Segoe UI",Roboto,sans-serif;
    color:var(--text); overflow-x:hidden;
    background:
      radial-gradient(1200px 600px at 10% -10%, #3a1d6e 0%, transparent 60%),
      radial-gradient(900px 500px at 110% 10%, #0d4f6b 0%, transparent 55%),
      radial-gradient(700px 500px at 50% 120%, #4a1d5e 0%, transparent 60%),
      linear-gradient(160deg,var(--bg1),var(--bg2) 45%,var(--bg3));
    background-attachment:fixed;
    min-height:100dvh;
    padding-bottom:120px;
  }

  .app-header{padding:24px 20px 8px; text-align:center;}
  .logo{
    font-size:34px; font-weight:800; letter-spacing:-1px;
    background:linear-gradient(90deg,#fff,#9ee7ff 60%,#c6a6ff);
    -webkit-background-clip:text; background-clip:text; color:transparent;
  }
  .tagline{color:var(--muted); font-size:14px; margin-top:4px;}

  .glass{
    background:var(--glass);
    border:1px solid var(--stroke);
    border-radius:24px;
    backdrop-filter:blur(22px) saturate(160%);
    -webkit-backdrop-filter:blur(22px) saturate(160%);
    box-shadow:0 10px 30px rgba(0,0,0,.28), inset 0 1px 0 rgba(255,255,255,.25);
  }

  .screen{display:none; padding:0 16px 16px;}
  .screen.active{display:block; animation:fade .35s ease;}
  @keyframes fade{from{opacity:0; transform:translateY(8px);} to{opacity:1; transform:none;}}

  .calendar{padding:14px 14px 18px; margin-top:8px;}
  .cal-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:10px;}
  .cal-head h2{margin:0; font-size:16px; font-weight:600; text-transform:capitalize;}
  .nav-btn{
    width:34px; height:34px; border-radius:50%; border:1px solid var(--stroke);
    background:var(--glass-strong); color:#fff; font-size:18px; cursor:pointer;
    display:flex; align-items:center; justify-content:center;
    transition:transform .2s;
  }
  .nav-btn:active{transform:scale(.9);}
  .weekdays{display:grid; grid-template-columns:repeat(7,1fr); gap:4px; margin-bottom:6px;}
  .weekdays span{text-align:center; font-size:12px; color:var(--muted);}
  .days{display:grid; grid-template-columns:repeat(7,1fr); gap:4px;}
  .day{
    aspect-ratio:1/1; display:flex; align-items:center; justify-content:center;
    border-radius:12px; font-size:14px; cursor:pointer; position:relative;
    transition:background .2s, transform .15s;
  }
  .day:active{transform:scale(.92);}
  .day.other{color:rgba(255,255,255,.25);}
  .day.today{border:1px solid var(--accent);}
  .day.selected{background:linear-gradient(135deg,#5ac8fa,#7a6bff); font-weight:700;}
  .day.has-shift::after{
    content:""; position:absolute; bottom:5px; width:5px; height:5px; border-radius:50%;
    background:#34c759;
  }

  .stats{display:grid; grid-template-columns:1fr 1fr; gap:12px; margin-top:14px;}
  .stat{
    padding:18px 12px; text-align:center;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:6px;
  }
  .stat .label{font-size:12px; color:var(--muted); text-transform:uppercase; letter-spacing:.5px;}
  .stat .value{font-size:26px; font-weight:800;}
  .stat .value.rub{background:linear-gradient(90deg,#7dffb2,#5ac8fa); -webkit-background-clip:text; background-clip:text; color:transparent;}

  .form{padding:16px; margin-top:14px;}
  .form h3{margin:0 0 12px; font-size:16px;}
  .field{margin-bottom:12px;}
  .field label{display:block; font-size:12px; color:var(--muted); margin-bottom:6px;}
  .field input[type=text], .field input[type=number]{
    width:100%; padding:12px 14px; border-radius:14px;
    background:rgba(255,255,255,.08); border:1px solid var(--stroke);
    color:#fff; font-size:15px; outline:none;
  }
  .field input::placeholder{color:rgba(255,255,255,.4);}

  .color-picker{display:flex; gap:12px; justify-content:center; flex-wrap:wrap;}
  .color-dot{
    width:38px; height:38px; border-radius:50%; border:2px solid transparent;
    cursor:pointer; transition:transform .2s, border-color .2s, box-shadow .2s;
  }
  .color-dot.active{
    border-color:#fff; transform:scale(1.12);
    box-shadow:0 0 0 3px rgba(255,255,255,.25), 0 0 16px var(--c);
  }

  .actions{display:flex; gap:10px; margin-top:8px;}
  .btn{
    flex:1; padding:13px; border-radius:16px; border:1px solid var(--stroke);
    background:var(--glass-strong); color:#fff; font-size:15px; font-weight:600; cursor:pointer;
    transition:transform .15s, background .2s;
  }
  .btn:active{transform:scale(.97);}
  .btn.primary{background:linear-gradient(135deg,#5ac8fa,#7a6bff); border:none;}

  .period{margin-top:14px; padding:16px;}
  .period-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:14px;}
  .period-head h2{margin:0; font-size:17px; font-weight:700; min-width:170px; text-align:center;}
  .summary{display:flex; gap:12px;}
  .summary .stat{flex:1; padding:16px 10px;}
  .summary .value{font-size:22px;}
  .bar{display:flex; align-items:flex-end; gap:4px; height:70px; margin-top:16px; padding:0 2px;}
  .bar div{
    flex:1; border-radius:6px 6px 0 0;
    background:linear-gradient(180deg,#7a6bff,#5ac8fa);
    min-height:4px; transition:height .4s ease;
  }
  .swipe-hint{text-align:center; font-size:11px; color:var(--muted); margin-top:10px;}

  .page-track{overflow:hidden;}
  .page-inner{display:flex; transition:transform .35s cubic-bezier(.34,1.3,.5,1);}
  .page-inner > *{min-width:100%; padding:0 2px;}

  .settings{padding:16px; margin-top:14px;}
  .settings h3{margin:0 0 12px; font-size:16px;}
  .lang-list{display:flex; flex-direction:column; gap:8px;}
  .lang{
    display:flex; align-items:center; gap:12px; padding:12px 14px;
    border-radius:14px; background:rgba(255,255,255,.06); border:1px solid var(--stroke);
    cursor:pointer; font-size:15px; transition:background .2s;
  }
  .lang:active{background:rgba(255,255,255,.14);}
  .lang.active{background:rgba(90,200,250,.18); border-color:var(--accent);}
  .flag{font-size:24px; line-height:1;}

  .agreement{
    margin-top:20px; padding:18px; text-align:center;
    display:flex; flex-direction:column; align-items:center; gap:12px;
  }
  .agreement a{color:var(--accent); text-decoration:none; font-size:14px;}
  .agreement .btn{padding:10px 40px; flex:none;}

  .tabbar{
    position:fixed; left:14px; right:14px; bottom:16px;
    height:66px; border-radius:33px;
    display:flex; align-items:center; justify-content:space-around;
    background:rgba(255,255,255,.14);
    border:1px solid rgba(255,255,255,.3);
    backdrop-filter:blur(28px) saturate(180%);
    -webkit-backdrop-filter:blur(28px) saturate(180%);
    box-shadow:0 12px 40px rgba(0,0,0,.4), inset 0 1px 0 rgba(255,255,255,.4);
    z-index:50; padding:0 6px; overflow:hidden;
  }
  .tabbar::before{
    content:""; position:absolute; inset:0; pointer-events:none;
    background:linear-gradient(120deg,rgba(255,255,255,.25),transparent 40%,transparent 60%,rgba(255,255,255,.15));
    opacity:.6;
  }
  .indicator{
    position:absolute; top:7px; height:52px; width:82px; border-radius:26px;
    background:linear-gradient(135deg,rgba(255,255,255,.35),rgba(255,255,255,.12));
    border:1px solid rgba(255,255,255,.4);
    box-shadow:0 4px 18px rgba(90,200,250,.35), inset 0 1px 0 rgba(255,255,255,.6);
    transition:transform .45s cubic-bezier(.34,1.56,.64,1), width .35s;
    z-index:0; backdrop-filter:blur(6px);
  }
  .tab{
    position:relative; z-index:1; flex:1; height:100%;
    display:flex; flex-direction:column; align-items:center; justify-content:center; gap:3px;
    background:none; border:none; color:rgba(255,255,255,.55); cursor:pointer;
    font-size:11px; font-weight:600; transition:color .3s, transform .3s;
  }
  .tab svg{width:24px; height:24px; stroke:currentColor; fill:none; stroke-width:1.9;
    stroke-linecap:round; stroke-linejoin:round; transition:transform .35s cubic-bezier(.34,1.56,.64,1);}
  .tab.active{color:#fff;}
  .tab.active svg{transform:scale(1.18); filter:drop-shadow(0 0 8px rgba(90,200,250,.8));}
</style>
</head>
<body>

  <header class="app-header">
    <div class="logo">ShiftFlow</div>
    <div class="tagline">Твои смены. Твой доход.</div>
  </header>

  <section class="screen active" id="screen-home">
    <div class="glass calendar">
      <div class="cal-head">
        <button class="nav-btn" onclick="changeMonth(-1)">‹</button>
        <h2 id="monthLabel">сентябрь 2026 г.</h2>
        <button class="nav-btn" onclick="changeMonth(1)">›</button>
      </div>
      <div class="weekdays">
        <span>Пн</span><span>Вт</span><span>Ср</span><span>Чт</span><span>Пт</span><span>Сб</span><span>Вс</span>
      </div>
      <div class="days" id="daysGrid"></div>
    </div>

    <div class="stats">
      <div class="glass stat">
        <div class="label">Смены</div>
        <div class="value" id="shiftCount">0</div>
      </div>
      <div class="glass stat">
        <div class="label">Доход</div>
        <div class="value rub" id="incomeValue">0 ₽</div>
      </div>
    </div>

    <div class="glass form">
      <h3>Добавить смену</h3>
      <div class="field">
        <label>Наименование работы</label>
        <input type="text" id="jobName" placeholder="Например: Кафе, смена днём">
      </div>
      <div class="field">
        <label>Цвет</label>
        <div class="color-picker" id="colorPicker">
          <button class="color-dot active" style="--c:#FF3B30;background:#FF3B30"></button>
          <button class="color-dot" style="--c:#FF9500;background:#FF9500"></button>
          <button class="color-dot" style="--c:#34C759;background:#34C759"></button>
          <button class="color-dot" style="--c:#007AFF;background:#007AFF"></button>
          <button class="color-dot" style="--c:#AF52DE;background:#AF52DE"></button>
          <button class="color-dot" style="--c:#FF2D95;background:#FF2D95"></button>
        </div>
      </div>
      <div class="field">
        <label>Доход, ₽</label>
        <input type="number" id="jobIncome" placeholder="0">
      </div>
      <div class="field">
        <label>Часы</label>
        <input type="number" id="jobHours" placeholder="0">
      </div>
      <div class="actions">
        <button class="btn" onclick="resetForm()">Отмена</button>
        <button class="btn primary" onclick="saveShift()">Сохранить</button>
      </div>
    </div>
  </section>

  <section class="screen" id="screen-finance">
    <div class="glass period">
      <div class="period-head">
        <button class="nav-btn" onclick="movePeriod('month',-1)">‹</button>
        <h2 id="finMonthLabel">Сентябрь 2026</h2>
        <button class="nav-btn" onclick="movePeriod('month',1)">›</button>
      </div>
      <div class="page-track">
        <div class="page-inner" id="monthTrack">
          <div>
            <div class="summary">
              <div class="glass stat"><div class="label">Доход</div><div class="value rub" id="mIncome">0 ₽</div></div>
              <div class="glass stat"><div class="label">Смен</div><div class="value" id="mShifts">0</div></div>
            </div>
            <div class="bar" id="mBar"></div>
          </div>
        </div>
      </div>
      <div class="swipe-hint">свайп или стрелки для перелистывания</div>
    </div>

    <div class="glass period">
      <div class="period-head">
        <button class="nav-btn" onclick="movePeriod('year',-1)">‹</button>
        <h2 id="finYearLabel">2026</h2>
        <button class="nav-btn" onclick="movePeriod('year',1)">›</button>
      </div>
      <div class="summary">
        <div class="glass stat"><div class="label">Доход за год</div><div class="value rub" id="yIncome">0 ₽</div></div>
        <div class="glass stat"><div class="label">Смен за год</div><div class="value" id="yShifts">0</div></div>
      </div>
      <div class="bar" id="yBar"></div>
    </div>
  </section>

  <section class="screen" id="screen-settings">
    <div class="glass settings">
      <h3>Язык</h3>
      <div class="lang-list" id="langList">
        <div class="lang active" data-lang="ru"><span class="flag">🇷🇺</span> Русский</div>
        <div class="lang" data-lang="en"><span class="flag">🇬🇧</span> English</div>
        <div class="lang" data-lang="de"><span class="flag">🇩🇪</span> Deutsch</div>
        <div class="lang" data-lang="es"><span class="flag">🇪🇸</span> Español</div>
      </div>
    </div>

    <div class="glass agreement">
      <div style="font-size:15px;font-weight:600;">Пользовательское соглашение</div>
      <a href="#">Открыть документ</a>
      <button class="btn primary" onclick="alert('Спасибо!')">ОК</button>
    </div>
  </section>

  <nav class="tabbar" id="tabbar">
    <div class="indicator" id="indicator"></div>

    <button class="tab active" data-tab="home" data-screen="screen-home">
      <svg viewBox="0 0 24 24"><path d="M3 10.5 12 3l9 7.5"/><path d="M5 9.5V21h14V9.5"/></svg>
      <span>Главная</span>
    </button>

    <button class="tab" data-tab="finance" data-screen="screen-finance">
      <svg viewBox="0 0 24 24"><path d="M5 20V10"/><path d="M12 20V4"/><path d="M19 20v-7"/></svg>
      <span>Финансы</span>
    </button>

    <button class="tab" data-tab="settings" data-screen="screen-settings">
      <svg viewBox="0 0 24 24"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1a2 2 0 1 1-2.8 2.8l-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.5V21a2 2 0 1 1-4 0v-.1a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1a2 2 0 1 1-2.8-2.8l.1-.1a1.7 1.7 0 0 0 .3-1.9 1.7 1.7 0 0 0-1.5-1H3a2 2 0 1 1 0-4h.1a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9l-.1-.1a2 2 0 1 1 2.8-2.8l.1.1a1.7 1.7 0 0 0 1.9.3H9a1.7 1.7 0 0 0 1-1.5V3a2 2 0 1 1 4 0v.1a1.7 1.7 0 0 0 1 1.5 1.7 1.7 0 0 0 1.9-.3l.1-.1a2 2 0 1 1 2.8 2.8l-.1.1a1.7 1.7 0 0 0-.3 1.9V9a1.7 1.7 0 0 0 1.5 1H21a2 2 0 1 1 0 4h-.1a1.7 1.7 0 0 0-1.5 1z"/></svg>
      <span>Настройки</span>
    </button>
  </nav>

<script>
let shifts = {};
let selectedColor = '#FF3B30';
let current = new Date(2026, 8, 1);
let selectedDate = null;

const monthNames = ["январь","февраль","март","апрель","май","июнь","июль","август","сентябрь","октябрь","ноябрь","декабрь"];

function renderCalendar(){
  const y = current.getFullYear(), m = current.getMonth();
  document.getElementById('monthLabel').textContent = `${monthNames[m]} ${y} г.`;

  const first = new Date(y, m, 1);
  const startDay = (first.getDay() + 6) % 7;
  const daysInMonth = new Date(y, m+1, 0).getDate();
  const prevDays = new Date(y, m, 0).getDate();

  const grid = document.getElementById('daysGrid');
  grid.innerHTML = '';
  const today = new Date();

  for(let i = startDay-1; i >= 0; i--){
    grid.insertAdjacentHTML('beforeend', `<div class="day other">${prevDays-i}</div>`);
  }
  for(let d = 1; d <= daysInMonth; d++){
    const key = `${y}-${String(m+1).padStart(2,'0')}-${String(d).padStart(2,'0')}`;
    const isToday = today.getFullYear()===y && today.getMonth()===m && today.getDate()===d;
    const isSel = selectedDate === key;
    const hasShift = shifts[key];
    const el = document.createElement('div');
    el.className = 'day' + (isToday?' today':'') + (isSel?' selected':'') + (hasShift?' has-shift':'');
    if(hasShift) el.style.background = isSel ? '' : hasShift.color;
    el.textContent = d;
    el.onclick = () => { selectedDate = key; renderCalendar(); };
    grid.appendChild(el);
  }
  const total = startDay + daysInMonth;
  const rest = (7 - total % 7) % 7;
  for(let i = 1; i <= rest; i++){
    grid.insertAdjacentHTML('beforeend', `<div class="day other">${i}</div>`);
  }
}

function changeMonth(delta){
  current.setMonth(current.getMonth() + delta);
  renderCalendar();
}

document.querySelectorAll('.color-dot').forEach(dot => {
  dot.onclick = () => {
    document.querySelectorAll('.color-dot').forEach(d=>d.classList.remove('active'));
    dot.classList.add('active');
    selectedColor = dot.style.background || getComputedStyle(dot).backgroundColor;
  };
});

function saveShift(){
  if(!selectedDate){ alert('Выберите дату в календаре'); return; }
  const income = +document.getElementById('jobIncome').value || 0;
  shifts[selectedDate] = { color: selectedColor, income, hours:+document.getElementById('jobHours').value||0 };
  resetForm();
  renderCalendar();
  updateStats();
}
function resetForm(){
  document.getElementById('jobName').value = '';
  document.getElementById('jobIncome').value = '';
  document.getElementById('jobHours').value = '';
}
function updateStats(){
  const totalShifts = Object.keys(shifts).length;
  const totalIncome = Object.values(shifts).reduce((s,v)=>s+v.income,0);
  document.getElementById('shiftCount').textContent = totalShifts;
  document.getElementById('incomeValue').textContent = totalIncome.toLocaleString('ru-RU') + ' ₽';
}

let finMonth = new Date(2026, 8, 1);
let finYear = 2026;
const fullMonths = ["Январь","Февраль","Март","Апрель","Май","Июнь","Июль","Август","Сентябрь","Октябрь","Ноябрь","Декабрь"];

function renderFinance(){
  document.getElementById('finMonthLabel').textContent =
    `${fullMonths[finMonth.getMonth()]} ${finMonth.getFullYear()}`;
  document.getElementById('finYearLabel').textContent = finYear;

  const y = finMonth.getFullYear(), m = finMonth.getMonth();
  let mIncome = 0, mShifts = 0;
  const dayBars = new Array(new Date(y,m+1,0).getDate()).fill(0);
  Object.entries(shifts).forEach(([k,v])=>{
    const [yy,mm,dd] = k.split('-').map(Number);
    if(yy===y && mm-1===m){ mIncome += v.income; mShifts++; dayBars[dd-1] += v.income; }
  });
  document.getElementById('mIncome').textContent = mIncome.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('mShifts').textContent = mShifts;
  drawBar('mBar', dayBars);

  let yIncome = 0, yShifts = 0;
  const monthBars = new Array(12).fill(0);
  Object.entries(shifts).forEach(([k,v])=>{
    const [yy,mm] = k.split('-').map(Number);
    if(yy===finYear){ yIncome += v.income; yShifts++; monthBars[mm-1] += v.income; }
  });
  document.getElementById('yIncome').textContent = yIncome.toLocaleString('ru-RU') + ' ₽';
  document.getElementById('yShifts').textContent = yShifts;
  drawBar('yBar', monthBars);
}

function drawBar(id, data){
  const el = document.getElementById(id);
  const max = Math.max(...data, 1);
  el.innerHTML = data.map(v=>`<div style="height:${Math.max(4, (v/max)*70)}px"></div>`).join('');
}

function movePeriod(type, delta){
  if(type==='month'){ finMonth.setMonth(finMonth.getMonth()+delta); }
  else { finYear += delta; }
  renderFinance();
}

(function(){
  let startX = null;
  const track = document.querySelector('.period .page-track');
  track.addEventListener('touchstart', e => startX = e.touches[0].clientX);
  track.addEventListener('touchend', e => {
    if(startX===null) return;
    const dx = e.changedTouches[0].clientX - startX;
    if(Math.abs(dx) > 50) movePeriod('month', dx < 0 ? 1 : -1);
    startX = null;
  });
})();

const tabs = document.querySelectorAll('.tab');
const indicator = document.getElementById('indicator');

function moveIndicator(tab){
  const bar = document.getElementById('tabbar');
  const barRect = bar.getBoundingClientRect();
  const r = tab.getBoundingClientRect();
  indicator.style.width = r.width - 8 + 'px';
  indicator.style.transform = `translateX(${r.left - barRect.left + 4}px)`;
}

tabs.forEach(tab => {
  tab.onclick = () => {
    tabs.forEach(t=>t.classList.remove('active'));
    tab.classList.add('active');
    moveIndicator(tab);

    document.querySelectorAll('.screen').forEach(s=>s.classList.remove('active'));
    docume
