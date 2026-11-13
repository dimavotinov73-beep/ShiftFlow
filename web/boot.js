/* ShiftFlow — ранний запуск (отдельным файлом, чтобы политика безопасности запрещала встроенные скрипты). */
/* Ранний запуск: тема, акцент, размер текста и стиль применяются до первой отрисовки, чтобы не было вспышки. */
(function(){
  var p = {};
  try{ p = JSON.parse(localStorage.getItem('tabel-prefs')||'{}') || {}; }catch(e){}
  var OLD = { '#FF9500':'#FFA43A', '#00E5FF':'#38BDF8', '#FF2FE0':'#FF5C9A', '#39FF14':'#3DDCB0', '#7B2FFF':'#9B7BFF', '#3D5CFF':'#4C8DFF', '#FF3B3B':'#FF5C9A', '#8E8E93':'#3DDCB0' };
  var acc = p.accent || '#3DDCB0';
  if(!p.v || p.v < 2){ acc = '#3DDCB0'; }
  else if(OLD[String(acc).toUpperCase()]) acc = OLD[String(acc).toUpperCase()];
  var theme = p.theme || 'auto';
  var host = document.documentElement.getAttribute('data-theme');
  var light = theme === 'light' || (theme === 'auto' && (host ? host === 'light' : (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches)));
  var root = document.documentElement;
  if(light) root.classList.add('light');
  root.setAttribute('lang', p.lang || 'ru');
  root.style.setProperty('--accent', acc);
  try{
    var n = parseInt(String(acc).replace('#',''), 16), c = [(n>>16)&255, (n>>8)&255, n&255];
    root.style.setProperty('--accent-ink', 'rgb(' + c.map(function(v){ return light ? Math.round(v*.58) : Math.min(255, Math.round(v*.38 + 158)); }).join(',') + ')');
  }catch(e){}
  root.style.setProperty('--fs', ({ s:.92, m:1, l:1.08, xl:1.17 })[p.textSize] || 1);
  root.style.setProperty('--rk', ({ round:2, soft:1, crisp:.3 })[p.uiStyle] || 1);
  var bgs = { graphite:['#121315','#ECE7DA'], midnight:['#0C111C','#E3E8EF'], oled:['#000000','#FFFFFF'], cocoa:['#15100B','#DCCDB1'] };
  var bg = bgs[p.bg] ? p.bg : 'graphite';
  root.setAttribute('data-bg', bg);
  var mem = navigator.deviceMemory, cores = navigator.hardwareConcurrency;
  var rm = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if(p.perf === 'lite' || ((p.perf || 'auto') === 'auto' && ((mem && mem <= 3) || (cores && cores <= 4) || rm))) root.classList.add('lite');
  root.setAttribute('data-daylabel', p.dayLabel || 'both');
  root.setAttribute('data-daytint', ({ line:1, soft:1, bold:1 })[p.dayTint] ? p.dayTint : 'soft');
  root.style.setProperty('--dt', ({ line:'0%', soft:'9%', bold:'18%' })[p.dayTint] || '9%');
  var m = document.querySelector('meta[name="theme-color"]');
  if(m) m.setAttribute('content', bgs[bg][light ? 1 : 0]);

  window.addEventListener('error', function(ev){
    try{
      var app = document.getElementById('app');
      if(ev && ev.message && app && app.querySelector('.boot')){
        app.innerHTML = '<div style="padding:26px 20px;font:13px/1.6 system-ui,sans-serif;color:#FF5D6C;word-break:break-word">'
          + 'Ошибка запуска: ' + String((ev && ev.message) || 'неизвестная') + '<br>'
          + '<span style="color:#8A9491">' + String((ev && ev.filename) || '') + ':' + String((ev && ev.lineno) || '') + '</span></div>';
      }
    }catch(e){}
  });
  setTimeout(function(){
    try{
      var app = document.getElementById('app');
      if(app && app.querySelector('.boot')){
        app.innerHTML = '<div style="padding:26px 20px;font:13px/1.65 system-ui,sans-serif;color:#FFA43A"><b>Приложение не запустилось.</b><br><br>'
          + 'Проверь, что рядом с index.html лежит файл <b>app.js</b> (и папки icons, fonts), затем обнови страницу с очисткой кэша (Ctrl+Shift+R).</div>';
      }
    }catch(e){}
  }, 4000);
})();
