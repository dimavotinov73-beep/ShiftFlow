// Демо-данные для скриншотов магазина: 3 места работы и смены за 2026 год (всё вымышленное).
function seed(lang){
  const en = lang === 'en';
  const wps = en ? [
    { id:'w1', name:'Bean & Leaf Café', color:'#00AB89', payType:'hourly', rate:18, currency:'$', defaultHours:8 },
    { id:'w2', name:'Warehouse', color:'#9260DA', payType:'daily', rate:180, currency:'$', defaultHours:12 },
    { id:'w3', name:'Tutoring', color:'#D08000', payType:'hourly', rate:40, currency:'$', defaultHours:2 }
  ] : [
    { id:'w1', name:'Кофейня «Зерно»', color:'#00AB89', payType:'hourly', rate:320, currency:'₽', defaultHours:8 },
    { id:'w2', name:'Склад', color:'#9260DA', payType:'daily', rate:3200, currency:'₽', defaultHours:12 },
    { id:'w3', name:'Репетитор', color:'#D08000', payType:'hourly', rate:900, currency:'₽', defaultHours:2 }
  ];
  const shifts = {}, notes = {};
  const pad = n => (n<10?'0':'')+n;
  let rnd = 7;
  const r = () => (rnd = (rnd*9301+49297)%233280)/233280;
  for(let m=0; m<11; m++){
    const dim = new Date(2026, m+1, 0).getDate();
    for(let d=1; d<=dim; d++){
      if(m===10 && d>9) break;
      const k = '2026-'+pad(m+1)+'-'+pad(d);
      const dow = new Date(2026,m,d).getDay();
      const x = r();
      if(dow===0){ shifts[k] = { dayOff:true }; continue; }
      if(x < 0.42) shifts[k] = { workplaceId:'w1', hours: 8 + (x<0.1?2:0) };
      else if(x < 0.62) shifts[k] = { workplaceId:'w2', hours:12 };
      else if(x < 0.74) shifts[k] = { workplaceId:'w3', hours:2 };
      else if(x < 0.85) shifts[k] = { dayOff:true };
    }
  }
  shifts['2026-11-03'] = { workplaceId:'w1', hours:8, adjust:en ? 35 : 600 };
  // Два места работы в один день: утром кофейня, вечером занятие
  shifts['2026-11-05'] = { items:[ { workplaceId:'w1', hours:6 }, { workplaceId:'w3', hours:2 } ] };
  shifts['2026-11-06'] = { items:[ { workplaceId:'w2', hours:12 }, { workplaceId:'w3', hours:1.5 } ] };
  notes['2026-11-03'] = en ? 'Covered for Alex, +tips' : 'Подменил Лёшу, +чаевые';
  notes['2026-11-07'] = en ? 'Stocktaking' : 'Инвентаризация';
  return { prefs:{ theme:'dark', accent:'#3DDCB0', lang:en ? 'en' : 'ru', agreement:{ version:'3.0', at:'2026-11-01T10:00:00Z' }, textSize:'m', uiStyle:'soft', v:2 },
           data:{ version:4, workplaces:wps, shifts, notes, incomes:[], payments:[] } };
}
module.exports = seed;
