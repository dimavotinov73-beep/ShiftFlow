/* ShiftFlow 3 — календарь смен и учёт дохода.
   Полностью офлайн: данные хранятся только в localStorage этого устройства.
   Ключи хранилища совпадают с прошлыми версиями, поэтому обновление не теряет данные. */
'use strict';

/* ════════════════════════ Переводы ════════════════════════ */
const DICT = {
  en: {
    'Календарь':'Calendar','Финансы':'Finance','Настройки':'Settings',
    'Загрузка…':'Loading…','Сегодня':'Today',
    'Пн':'Mo','Вт':'Tu','Ср':'We','Чт':'Th','Пт':'Fr','Сб':'Sa','Вс':'Su',
    'Выбрать период':'Select range','Период':'Range','Шаблон':'Pattern',
    'График по шаблону':'Pattern schedule','Место работы':'Workplace','Быстрый выбор':'Quick presets',
    'Смен подряд':'Shifts in a row','Выходных подряд':'Days off in a row',
    'Начать с':'Start from','Заполнить':'Fill','До конца месяца':'To month end',
    'До конца недели':'To week end','Часов за смену':'Hours per shift',
    'Применить шаблон':'Apply pattern','Выходной':'Day off','Часов':'Hours',
    'Часов (учёт, на оплату не влияет)':'Hours (tracking only)','Изменить':'Change','Очистить день':'Clear day',
    'Оплата':'Pay','Выбрать заново':'Reset selection',
    'Отметь на календаре первый день периода':'Tap the first day of the range',
    'Теперь отметь последний день':'Now tap the last day',
    'Итого за месяц':'Month total','Итого за год':'Year total',
    'Статистика за год':'Year statistics','Очистить месяц':'Clear month',
    'Экспорт в Excel':'Export to Excel','Скачать всё':'Download all','Все места работы':'All workplaces',
    'Дата':'Date','Сумма':'Amount','Заметка':'Note','Заметка (необязательно)':'Note (optional)',
    'Место работы (необязательно)':'Workplace (optional)','Все':'All','С':'From','По':'To',
    'Сохранить':'Save','Отмена':'Cancel','Удалить':'Delete','Да':'Yes','Закрыть':'Close','Готово':'Done',
    'Тема':'Theme','Авто':'Auto','Светлая':'Light','Тёмная':'Dark',
    'Язык':'Language','Места работы':'Workplaces','Название':'Name',
    'Тип оплаты':'Pay type','Почасовая':'Hourly','Фиксированная':'Fixed','Ставка (в час)':'Rate (per hour)',
    'Ставка (за смену)':'Rate (per shift)','Валюта':'Currency','Цвет':'Color',
    'Пользовательское соглашение':'Terms of use','Политика конфиденциальности':'Privacy policy',
    'О приложении':'About','Версия':'Version',
    'Достигнут лимит — 10 мест работы':'Limit reached — 10 workplaces',
    'Не удалось сохранить данные в этом браузере (возможно, включён приватный режим или закончилось место). Скачай резервную копию в настройках.':
      'Could not save data in this browser (private mode or no space left). Download a backup in Settings.',
    'Записать выплату':'Log a payment','Добавить внесение':'Add extra income','Добавить место работы':'Add workplace',
    'Выплачено':'Paid','Начислено':'Earned','Осталось получить':'Left to receive','Дополнительно':'Extra',
    'Смены ещё не отмечены':'No shifts yet',
    'Удалить запись?':'Delete this entry?',
    'Восстановить данные из файла? Текущие данные будут заменены.':'Restore data from file? Current data will be replaced.',
    'Файл не похож на резервную копию':'This file is not a ShiftFlow backup',
    'Введи сумму больше нуля':'Enter an amount greater than zero',
    'Название не может быть пустым':'Name cannot be empty',
    'День очищен':'Day cleared','Подтверди':'Confirm','Принять':'Accept','ч':'h','час':'hour','вых':'off',
    'Добавить':'Add','Восстановить':'Restore','Очистить':'Clear',
    'Очистить день?':'Clear this day?','Шаблон применён':'Pattern applied','Внесение добавлено':'Entry added',
    'Выплата записана':'Payment saved','Файл готов':'File is ready','Сохранено в CSV':'Saved as CSV',
    'Не удалось сохранить файл':'Could not save the file','Резервная копия готова':'Backup is ready',
    'Восстановлено':'Restored','Язык изменён':'Language changed','Выбери место работы':'Choose a workplace',
    'Очистить всё':'Clear all','Удалить всё':'Delete all','Очищено':'Cleared',
    'Твой график — твой доход':'Your schedule, your income',
    'Заметка ко дню':'Note for the day','Например: подменил смену':'e.g. covered a shift',
    'Очистить все смены и заметки месяца?':'Clear all shifts and notes of this month?',
    'Например: Кофейня':'e.g. Coffee shop','Сначала добавь место работы':'Add a workplace first',
    'Часов на смену по умолчанию':'Default hours per shift',
    'Корректировка к оплате за этот день':'Pay adjustment for this day',
    'Например: 500 — чай, −300 — вычет':'e.g. 500 — tip, −300 — deduction',
    'Показать по месяцам':'Show by month','Свернуть':'Collapse',
    'заработано':'earned','Свайп — сменить месяц':'Swipe to change month',
    'Оформление':'Appearance','Изменения видны сразу':'Every change previews instantly',
    'Сделай приложение своим':'Make the app feel like yours',
    'Тёмная тема':'Dark mode','Удобно для глаз вечером':'Easy on the eyes at night','Включено светлое оформление':'Light look is on',
    'Персонализация':'Personalization','Работа':'Work','Данные':'Data',
    'Цвет акцента':'Accent color','Размер текста':'Text size','Стиль интерфейса':'Interface style',
    'Мята':'Mint','Фиалка':'Violet','Океан':'Ocean','Роза':'Rose','Янтарь':'Amber','Небо':'Sky',
    'Мелкий':'Small','Обычный':'Default','Крупный':'Large','Очень крупный':'Extra large',
    'Округлый':'Rounded','Мягкий':'Soft','Чёткий':'Crisp',
    'Отменить':'Discard','Сохранено':'Saved',
    'Язык меню и подсказок':'The language the app speaks','Все языки':'All languages',
    'Меню и подсказки на русском':'Menus and hints in Russian','Меню и подсказки на английском':'Menus and hints in English',
    'Язык интерфейса не зависит от языка системы.':'Interface language does not depend on your system language.',
    'Ставки, валюта и цвет':'Rates, currency and color',
    'Мест работы пока нет':'No workplaces yet',
    'Добавь место работы, чтобы отмечать смены и считать доход.':'Add a workplace to mark shifts and track income.',
    'Резервная копия':'Backup','Перенос и восстановление':'Transfer and restore',
    'Всё хранится только на этом устройстве':'Everything stays on this device',
    'Скачать резервную копию':'Download backup','Файл .json со всеми данными':'A .json file with all your data',
    'Восстановить из файла':'Restore from file','Заменит текущие данные':'Replaces current data',
    'Опасная зона':'Danger zone','Удалить все данные':'Delete all data','Места, смены и выплаты':'Workplaces, shifts and payments',
    'Переезжаешь с сайта в приложение? Скачай копию на сайте и восстанови её здесь.':'Moving from the website to the app? Download a backup there and restore it here.',
    'Нет сервера, аккаунта и рекламы. Приложение не отправляет данные в сеть.':'No server, no account, no ads. The app never sends your data anywhere.',
    'Нажми, чтобы открыть':'Tap to open','Начать':'Get started','Читать полностью':'Read in full','Скрыть':'Hide',
    'Добро пожаловать':'Welcome',
    'Календарь смен':'Shift calendar','Отмечай смены и выходные в одно касание':'Mark shifts and days off in one tap',
    'Доход по ставкам':'Pay by rates','Почасовые и фиксированные ставки, корректировки':'Hourly and fixed rates, adjustments',
    'Только на устройстве':'Device only','Без аккаунта и интернета':'No account, no internet needed',
    'Сначала отметь согласие':'Please confirm the terms first',
    'Я прочитал условия и согласен, что данные хранятся только на этом устройстве.':'I have read the terms and agree that my data stays on this device.',
    'Назад':'Back','смена':'shift','Сменить':'Change',
    'Файлы создаются на устройстве — интернет не нужен.':'Files are created on your device — no internet needed.',
    'Лучший месяц':'Best month','Выбери столбик, чтобы увидеть месяц':'Tap a bar to see the month',
    'места работы':'workplaces','изменение':'change',
    'Тема и акцент':'Theme and accent','Русский':'Russian','Английский':'English',
    'Сделано с заботой о твоём времени.':'Made with care for your time.',
    'Отметь согласие, чтобы продолжить':'Confirm the terms to continue',
    'Перейти к сегодняшнему дню':'Go to today','Предыдущий месяц':'Previous month','Следующий месяц':'Next month',
    'Закрыть день':'Close day',
    'Период':'Range','Сумма за выбранные даты':'Totals for chosen dates','Шаблон':'Pattern','График 2/2, 5/2 или свой':'2/2, 5/2 or your own',
    'Подсчёт за период':'Range totals','Выбери даты или отметь их на календаре':'Pick dates or tap them on the calendar',
    'Эта неделя':'This week','Прошлая неделя':'Last week',
    'Отметит смены и выходные на выбранные даты':'Fills shifts and days off for the chosen dates',
    'Как чередовать':'How it repeats','Смены и выходные':'Shifts and days off','По дням недели':'By weekday',
    'Пн–Пт':'Mon–Fri','Пн–Сб':'Mon–Sat','Сб и Вс':'Sat & Sun',
    'И следующий месяц':'Plus next month','Заменить уже отмеченные дни':'Replace days already marked',
    'Отмеченные дни перезапишутся':'Marked days will be overwritten','Отмеченные дни останутся как есть':'Marked days stay as they are',
    'Предпросмотр':'Preview','Смена':'Shift','Уже отмечено':'Already marked','Будет отмечено':'Will be marked',
    'Примерный доход':'Estimated pay','Не тронем уже отмеченные дни':'Days already marked are kept','Применить':'Apply',
    'Отменено':'Undone','Выбери хотя бы один рабочий день':'Pick at least one working day',
    'Все дни уже отмечены — ничего не изменилось':'All days are already marked — nothing changed',
    'Подпись в календаре':'Calendar label','Например: Кофе':'e.g. Café',
    'Свой':'Custom','Свой цвет':'Custom color','Фон':'Background','Графит':'Graphite','Полночь':'Midnight','Контраст':'Contrast','Какао':'Cocoa',
    'Подсветка смен':'Shift highlight','Полоска':'Line','Мягкая':'Soft','Яркая':'Bold',
    'Подписи в днях':'Day labels','Название и сумма':'Name and pay',
    'Сумма за даты':'Totals for dates','2/2, 5/2 или свой':'2/2, 5/2 or custom','Всё':'All','и ещё':'and',
    'Резервная копия .json или выгрузка Excel':'A .json backup or an Excel export',
    'Переезжаешь со старой версии сайта? Открой там «Финансы», в «Экспорте» поставь дату «С» на свою первую смену и нажми «Скачать всё (все места работы)». Потом выбери этот файл здесь.':
      'Moving from the old website? Open Finance there, set the export “From” date to your first shift and tap “Download all (every workplace)”. Then pick that file here.',
    'Не получилось прочитать Excel-файл':'Could not read the Excel file','В файле не нашлось смен':'No shifts found in the file',
    'Импорт из Excel':'Import from Excel','Импортировать':'Import','Импортировано':'Imported',
    'Индиго':'Indigo','Орхидея':'Orchid','Коралл':'Coral','Солнце':'Sun','Лайм':'Lime','Серебро':'Silver'
  }
};

const MONTHS_I18N = {
  ru:['январь','февраль','март','апрель','май','июнь','июль','август','сентябрь','октябрь','ноябрь','декабрь'],
  en:['January','February','March','April','May','June','July','August','September','October','November','December']
};
const MONTHS_GEN = { ru:['января','февраля','марта','апреля','мая','июня','июля','августа','сентября','октября','ноября','декабря'] };
const MONTH_LETTER = { ru:['Я','Ф','М','А','М','И','И','А','С','О','Н','Д'], en:['J','F','M','A','M','J','J','A','S','O','N','D'] };
const WD_SHORT_I18N = { ru:['Пн','Вт','Ср','Чт','Пт','Сб','Вс'], en:['Mo','Tu','We','Th','Fr','Sa','Su'] };
const WD_LONG_I18N  = { ru:['воскресенье','понедельник','вторник','среда','четверг','пятница','суббота'], en:['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'] };
const PLURALS = {
  ru:{ shift:['смена','смены','смен'], hour:['час','часа','часов'], off:['выходной','выходных','выходных'],
       entry:['внесение','внесения','внесений'], payment:['выплата','выплаты','выплат'],
       place:['место работы','места работы','мест работы'], change:['изменение','изменения','изменений'], day:['день','дня','дней'] },
  en:{ shift:['shift','shifts','shifts'], hour:['hour','hours','hours'], off:['day off','days off','days off'],
       entry:['entry','entries','entries'], payment:['payment','payments','payments'],
       place:['workplace','workplaces','workplaces'], change:['change','changes','changes'], day:['day','days','days'] }
};
const LOCALES = { ru:'ru-RU', en:'en-US' };
let LANG = 'ru';

function t(s, p){
  let out = (LANG !== 'ru' && DICT[LANG] && DICT[LANG][s] !== undefined) ? DICT[LANG][s] : s;
  if(p){ for(const k in p){ out = out.split('{'+k+'}').join(String(p[k])); } }
  return out;
}
function plural(n, forms){
  if(LANG === 'en') return Math.abs(n) === 1 ? forms[0] : forms[1];
  const a = Math.abs(Math.round(n)) % 100, b = a % 10;
  if(Math.round(n) !== n) return forms[1];
  if(a > 10 && a < 20) return forms[2];
  if(b > 1 && b < 5) return forms[1];
  if(b === 1) return forms[0];
  return forms[2];
}
function cnt(n, kind){
  const set = (PLURALS[LANG] && PLURALS[LANG][kind]) || PLURALS.ru[kind];
  return num(n) + ' ' + plural(n, set);
}
function months(){ return MONTHS_I18N[LANG] || MONTHS_I18N.ru; }
function monthTitle(m){ const s = months()[m] || ''; return s ? s.charAt(0).toUpperCase() + s.slice(1) : ''; }
function wdShort(){ return WD_SHORT_I18N[LANG] || WD_SHORT_I18N.ru; }
function wdLong(){ return WD_LONG_I18N[LANG] || WD_LONG_I18N.ru; }

/* ════════════════════════ Константы и состояние ════════════════════════ */
const PREF_KEY = 'tabel-prefs';
const DATA_KEY = 'tabel-data';
const CURRENT_VERSION = 4;
const PREFS_VERSION = 2;
const AGREEMENT_VERSION = '2.0';
const APP_BUILD = '3.0.0';
const BRAND = 'ShiftFlow';

/* Цвета мест работы: проверены на различимость (в т.ч. при дальтонизме) в светлой и тёмной теме. */
const SWATCHES = ['#00AB89','#9260DA','#D08000','#00A2CE','#DA4786','#64A737','#4A81EB','#DE602F','#C54EBE','#A89219'];
const OLD_SWATCHES = { '#FF9500':'#D08000','#00E5FF':'#00A2CE','#FF2FE0':'#C54EBE','#39FF14':'#64A737','#FFEE00':'#A89219',
                       '#FF3B3B':'#DE602F','#7B2FFF':'#9260DA','#00FFA3':'#00AB89','#FF6EC7':'#DA4786','#3D5CFF':'#4A81EB' };
const ACCENTS = [
  { c:'#3DDCB0', n:'Мята' },   { c:'#38BDF8', n:'Небо' },   { c:'#4C8DFF', n:'Океан' },   { c:'#6E7BFF', n:'Индиго' },
  { c:'#9B7BFF', n:'Фиалка' }, { c:'#D16BFF', n:'Орхидея' }, { c:'#FF5C9A', n:'Роза' },  { c:'#FF7A59', n:'Коралл' },
  { c:'#FFA43A', n:'Янтарь' }, { c:'#FACC15', n:'Солнце' }, { c:'#A3E635', n:'Лайм' },   { c:'#C9D1D3', n:'Серебро' }
];
/* Фон: оттенок тёмной и светлой темы (значения дублируются в CSS как :root[data-bg=…]) */
const BACKGROUNDS = [
  { v:'graphite', n:'Графит',  d:'#08090B', ds:'#15191B', l:'#F3F5F4', ls:'#FFFFFF' },
  { v:'midnight', n:'Полночь', d:'#070912', ds:'#151A2C', l:'#EEF1F8', ls:'#FFFFFF' },
  { v:'oled',     n:'Контраст', d:'#000000', ds:'#111213', l:'#FFFFFF', ls:'#F1F2F2' },
  { v:'cocoa',    n:'Какао',   d:'#0D0A08', ds:'#1C1612', l:'#F5F0EA', ls:'#FFFCF8' }
];
const DAY_TINTS = [ { v:'line', n:'Полоска', k:'0%' }, { v:'soft', n:'Мягкая', k:'14%' }, { v:'bold', n:'Яркая', k:'34%' } ];
const DAY_LABELS = [ { v:'both', n:'Название и сумма', s:'Всё' }, { v:'name', n:'Название', s:'Название' }, { v:'sum', n:'Сумма', s:'Сумма' } ];
const OLD_ACCENTS = { '#FF9500':'#FFA43A','#00E5FF':'#38BDF8','#FF2FE0':'#FF5C9A','#39FF14':'#3DDCB0','#7B2FFF':'#9B7BFF','#3D5CFF':'#4C8DFF','#FF3B3B':'#FF5C9A','#8E8E93':'#3DDCB0' };
const TEXT_SIZES = [ { v:'s', n:'Мелкий', k:.92 }, { v:'m', n:'Обычный', k:1 }, { v:'l', n:'Крупный', k:1.08 }, { v:'xl', n:'Очень крупный', k:1.17 } ];
const UI_STYLES = [ { v:'round', n:'Округлый', k:1.3 }, { v:'soft', n:'Мягкий', k:1 }, { v:'crisp', n:'Чёткий', k:.45 } ];

let prefs = { theme:'auto', accent:'#3DDCB0', lang:'ru', agreement:null, textSize:'m', uiStyle:'soft',
              bg:'graphite', dayTint:'soft', dayLabel:'both', customHue:160, v:PREFS_VERSION };
let state = { version:CURRENT_VERSION, workplaces:[], shifts:{}, notes:{}, incomes:[], payments:[] };
let storageBroken = false;
let booted = false;

let ui = {
  tab:'calendar', page:null,
  view:{ y:0, m:0 },
  selected:null,
  rangeMode:false, rangeStart:null, rangeEnd:null,
  patternOpen:false,
  pattern:{ workplaceId:null, mode:'cycle', workDays:2, offDays:2, weekdays:[1,1,1,1,1,0,0], start:null, end:null, hours:8, hoursTouched:false, replace:false },
  statsYear:0, statsOpen:false, chartSel:null,
  sheet:null, confirm:null, picker:null, closing:null,
  slide:'', viewAnim:'tab', pendingPulse:false,
  legalChecked:false, legalOpen:false, editorPicker:false,
  export:{ from:'', to:'' },
  snapshot:null, scrollMemo:{}
};

function detectLang(){
  const n = (navigator.language || 'ru').toLowerCase();
  if(n.indexOf('ru') === 0 || n.indexOf('uk') === 0 || n.indexOf('be') === 0 || n.indexOf('kk') === 0) return 'ru';
  return 'en';
}

function loadPrefs(){
  let migrated = false;
  try{
    const raw = localStorage.getItem(PREF_KEY);
    if(raw){ const p = JSON.parse(raw); if(p && typeof p === 'object') prefs = Object.assign(prefs, p); }
  }catch(e){ storageBroken = true; }
  LANG = (prefs.lang === 'en' || prefs.lang === 'ru') ? prefs.lang : detectLang();
  prefs.lang = LANG;
  if(!prefs.v || prefs.v < PREFS_VERSION){
    prefs.accent = ACCENTS[0].c;           /* редизайн 3.0: новый фирменный акцент */
    prefs.v = PREFS_VERSION; migrated = true;
  }
  const up = String(prefs.accent || '').toUpperCase();
  if(OLD_ACCENTS[up]){ prefs.accent = OLD_ACCENTS[up]; migrated = true; }
  if(!prefs.accent || String(prefs.accent).charAt(0) !== '#') prefs.accent = ACCENTS[0].c;
  if(['auto','light','dark'].indexOf(prefs.theme) < 0) prefs.theme = 'auto';
  if(!TEXT_SIZES.some(function(x){ return x.v === prefs.textSize; })) prefs.textSize = 'm';
  if(!UI_STYLES.some(function(x){ return x.v === prefs.uiStyle; })) prefs.uiStyle = 'soft';
  if(!BACKGROUNDS.some(function(x){ return x.v === prefs.bg; })) prefs.bg = 'graphite';
  if(!DAY_TINTS.some(function(x){ return x.v === prefs.dayTint; })) prefs.dayTint = 'soft';
  if(!DAY_LABELS.some(function(x){ return x.v === prefs.dayLabel; })) prefs.dayLabel = 'both';
  prefs.customHue = Math.max(0, Math.min(359, parseInt(prefs.customHue, 10) || 0));
  if(migrated) savePrefs();
}
function savePrefs(){
  try{ localStorage.setItem(PREF_KEY, JSON.stringify(prefs)); }
  catch(e){ storageBroken = true; }
}
function isLight(){
  if(prefs.theme === 'light') return true;
  if(prefs.theme === 'dark') return false;
  const host = document.documentElement.getAttribute('data-theme'); /* тема встраивающей страницы, если она её задаёт */
  if(host === 'light' || host === 'dark') return host === 'light';
  return !!(window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches);
}
function hexRgb(hex){
  let h = String(hex || '').replace('#','');
  if(h.length === 3) h = h[0]+h[0]+h[1]+h[1]+h[2]+h[2];
  const n = parseInt(h, 16);
  if(isNaN(n)) return [61,220,176];
  return [(n>>16)&255, (n>>8)&255, n&255];
}
function luminance(rgb){
  const c = rgb.map(function(v){ v /= 255; return v <= 0.03928 ? v/12.92 : Math.pow((v+0.055)/1.055, 2.4); });
  return 0.2126*c[0] + 0.7152*c[1] + 0.0722*c[2];
}
function accentInks(hex){
  const c = hexRgb(hex);
  const dark = 'rgb(' + c.map(function(v){ return Math.min(255, Math.round(v*.38 + 158)); }).join(',') + ')';
  const light = 'rgb(' + c.map(function(v){ return Math.round(v*.58); }).join(',') + ')';
  const L = luminance(c);
  const on = (1.05/(L+.05)) > ((L+.05)/0.055) ? '#FFFFFF' : '#05110D';
  return { dark:dark, light:light, on:on };
}
function textScale(){ for(const x of TEXT_SIZES) if(x.v === prefs.textSize) return x.k; return 1; }
function radiusScale(){ for(const x of UI_STYLES) if(x.v === prefs.uiStyle) return x.k; return 1; }
function accentName(c){
  const up = String(c || '').toUpperCase();
  for(const a of ACCENTS) if(a.c === up) return t(a.n);
  return t('Свой');
}
function isCustomAccent(){ const up = String(prefs.accent || '').toUpperCase(); return !ACCENTS.some(function(a){ return a.c === up; }); }
/* Свой цвет: насыщенность и яркость зафиксированы, чтобы акцент всегда читался на обоих фонах */
function hslHex(h){
  const s = .78, l = .62, k = function(n){ return (n + h / 30) % 12; };
  const a = s * Math.min(l, 1 - l);
  const f = function(n){ return l - a * Math.max(-1, Math.min(k(n) - 3, Math.min(9 - k(n), 1))); };
  return '#' + [f(0), f(8), f(4)].map(function(x){ return Math.round(x * 255).toString(16).padStart(2, '0'); }).join('').toUpperCase();
}
function bgDef(){ for(const b of BACKGROUNDS) if(b.v === prefs.bg) return b; return BACKGROUNDS[0]; }
function optName(list, v){ for(const x of list) if(x.v === v) return t(x.n); return ''; }

function applyPrefs(){
  const root = document.documentElement;
  const light = isLight();
  root.classList.toggle('light', light);
  root.setAttribute('lang', LANG);
  const ink = accentInks(prefs.accent);
  root.style.setProperty('--accent', prefs.accent);
  root.style.setProperty('--accent-ink', light ? ink.light : ink.dark);
  root.style.setProperty('--on-accent', ink.on);
  root.style.setProperty('--fs', textScale());
  root.style.setProperty('--rk', radiusScale());
  root.setAttribute('data-bg', prefs.bg);
  root.setAttribute('data-daylabel', prefs.dayLabel);
  for(const x of DAY_TINTS) if(x.v === prefs.dayTint) root.style.setProperty('--dt', x.k);
  const meta = document.querySelector('meta[name="theme-color"]');
  if(meta) meta.setAttribute('content', light ? bgDef().l : bgDef().d);
  if(window.AndroidApp && typeof window.AndroidApp.setStatusBar === 'function'){
    try{ window.AndroidApp.setStatusBar(light); }catch(e){}
  }
}

/* ════════════════════════ Данные ════════════════════════ */
function migrate(obj){
  let v = obj.version || 1;
  if(v < 2){ if(!Array.isArray(obj.incomes)) obj.incomes = []; v = 2; }
  if(v < 3){
    const list = Array.isArray(obj.workplaces) ? obj.workplaces : [];
    const auto = /^(Работа|Job)\s*1$/i;
    const used = {};
    if(obj.shifts && typeof obj.shifts === 'object'){
      Object.keys(obj.shifts).forEach(function(k){ const s = obj.shifts[k]; if(s && s.workplaceId) used[s.workplaceId] = true; });
    }
    (Array.isArray(obj.incomes) ? obj.incomes : []).forEach(function(x){ if(x && x.workplaceId) used[x.workplaceId] = true; });
    obj.workplaces = list.filter(function(w){
      if(!w) return false;
      if(!auto.test(String(w.name || ''))) return true;
      if(used[w.id]) return true;
      return parseFloat(w.rate) > 0;
    });
    v = 3;
  }
  if(v < 4){ if(!obj.notes || typeof obj.notes !== 'object') obj.notes = {}; v = 4; }
  obj.version = v;
  return obj;
}
function newId(prefix){ return prefix + Date.now().toString(36) + Math.floor(Math.random()*1e4).toString(36); }
function makeWorkplace(extra){
  return Object.assign({ id:newId('w'), name:'', color:SWATCHES[0], payType:'hourly', rate:0, currency:'₽', defaultHours:8 }, extra || {});
}
function normalize(){
  let list = Array.isArray(state.workplaces) ? state.workplaces.slice(0,10) : [];
  list = list.map(function(w,i){
    w = w || {};
    let color = (typeof w.color === 'string' && w.color.charAt(0) === '#') ? w.color.toUpperCase() : SWATCHES[i % SWATCHES.length];
    if(OLD_SWATCHES[color]) color = OLD_SWATCHES[color];
    return {
      id: w.id ? String(w.id) : ('w'+(i+1)),
      name: (w.name === undefined || w.name === null || String(w.name).trim() === '') ? t('Место работы') : String(w.name).slice(0,60),
      color: color,
      short: (w.short === undefined || w.short === null) ? '' : String(w.short).trim().slice(0,10),
      payType: (w.payType === 'daily') ? 'daily' : 'hourly',
      rate: isFinite(parseFloat(w.rate)) ? Math.max(0, parseFloat(w.rate)) : 0,
      currency: (w.currency === undefined || w.currency === null || String(w.currency).trim() === '') ? '₽' : String(w.currency).slice(0,4),
      defaultHours: isFinite(parseFloat(w.defaultHours)) ? Math.max(0, parseFloat(w.defaultHours)) : 8
    };
  });
  state.workplaces = list;
  const ids = {};
  state.workplaces.forEach(function(w){ ids[w.id] = true; });

  const shifts = {};
  if(state.shifts && typeof state.shifts === 'object'){
    Object.keys(state.shifts).forEach(function(k){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
      const s = state.shifts[k] || {};
      if(s.dayOff){ shifts[k] = { dayOff:true }; return; }
      if(s.workplaceId && ids[s.workplaceId]){
        const h = (s.hours === undefined || s.hours === null || s.hours === '') ? undefined : Math.max(0, parseFloat(s.hours) || 0);
        const a = (s.adjust === undefined || s.adjust === null || s.adjust === '') ? 0 : (parseFloat(s.adjust) || 0);
        shifts[k] = { workplaceId:s.workplaceId, hours:(isFinite(h) ? h : undefined), adjust:(a ? a : undefined), dayOff:false };
      }
    });
  }
  state.shifts = shifts;

  const notes = {};
  if(state.notes && typeof state.notes === 'object'){
    Object.keys(state.notes).forEach(function(k){
      if(!/^\d{4}-\d{2}-\d{2}$/.test(k)) return;
      const v = String(state.notes[k] === undefined || state.notes[k] === null ? '' : state.notes[k]).trim();
      if(v) notes[k] = v.slice(0,140);
    });
  }
  state.notes = notes;

  state.incomes = (Array.isArray(state.incomes) ? state.incomes : []).map(function(x){
    return {
      id: x && x.id ? String(x.id) : newId('i'),
      date: (x && /^\d{4}-\d{2}-\d{2}$/.test(x.date)) ? x.date : todayKey(),
      amount: (x && isFinite(parseFloat(x.amount))) ? parseFloat(x.amount) : 0,
      workplaceId: (x && x.workplaceId && ids[x.workplaceId]) ? x.workplaceId : '',
      note: (x && x.note) ? String(x.note).slice(0,80) : ''
    };
  });
  state.payments = (Array.isArray(state.payments) ? state.payments : []).map(function(p){
    return {
      id: p && p.id ? String(p.id) : newId('p'),
      periodFrom: (p && /^\d{4}-\d{2}-\d{2}$/.test(p.periodFrom)) ? p.periodFrom : todayKey(),
      periodTo: (p && /^\d{4}-\d{2}-\d{2}$/.test(p.periodTo)) ? p.periodTo : todayKey(),
      workplaceId: (p && p.workplaceId && ids[p.workplaceId]) ? p.workplaceId : '',
      amount: (p && isFinite(parseFloat(p.amount))) ? parseFloat(p.amount) : 0,
      note: (p && p.note) ? String(p.note).slice(0,80) : ''
    };
  });
}
function loadState(){
  try{
    const raw = localStorage.getItem(DATA_KEY);
    if(raw){
      const parsed = migrate(JSON.parse(raw));
      state.workplaces = parsed.workplaces || [];
      state.shifts = parsed.shifts || {};
      state.notes = parsed.notes || {};
      state.incomes = parsed.incomes || [];
      state.payments = parsed.payments || [];
      state.version = parsed.version;
    }
  }catch(e){ }
  normalize();
}
function saveState(){
  state.version = CURRENT_VERSION;
  try{ localStorage.setItem(DATA_KEY, JSON.stringify(state)); storageBroken = false; }
  catch(e){ storageBroken = true; }
}
function saveSoon(){
  if(saveSoon.t) clearTimeout(saveSoon.t);
  saveSoon.t = setTimeout(saveState, 180);
}

function wpById(id){
  for(let i=0;i<state.workplaces.length;i++){ if(state.workplaces[i].id === id) return state.workplaces[i]; }
  return null;
}
function basePay(s){
  if(!s || !s.workplaceId) return 0;
  const w = wpById(s.workplaceId);
  if(!w) return 0;
  if(w.payType === 'daily') return w.rate || 0;
  return (parseFloat(s.hours) || 0) * (w.rate || 0);
}
function calcPay(s){ return basePay(s) + (parseFloat(s && s.adjust) || 0); }
function inRange(k, from, to){
  if(from && k < from) return false;
  if(to && k > to) return false;
  return true;
}
function rangeStats(from, to){
  let f = from, tt = to;
  if(f && tt && tt < f){ const tmp = f; f = tt; tt = tmp; }
  const st = { from:f, to:tt, pay:0, total:0, hours:0, shifts:0, off:0, wpStats:{} };
  state.workplaces.forEach(function(w){ st.wpStats[w.id] = { pay:0, hours:0, days:0, shifts:0 }; });
  Object.keys(state.shifts).forEach(function(k){
    if(!inRange(k, f, tt)) return;
    const s = state.shifts[k];
    if(!s) return;
    if(s.dayOff){ st.off++; return; }
    if(!s.workplaceId) return;
    const pay = calcPay(s);
    st.pay += pay; st.shifts++; st.hours += (parseFloat(s.hours) || 0);
    const ws = st.wpStats[s.workplaceId];
    if(ws){ ws.pay += pay; ws.days++; ws.shifts++; ws.hours += (parseFloat(s.hours) || 0); }
  });
  st.total = st.pay;
  return st;
}
function monthRange(y, m){ return { from:dk(y,m,1), to:dk(y,m,daysInMonth(y,m)) }; }
function defaultCurrency(){ return (state.workplaces[0] && state.workplaces[0].currency) ? state.workplaces[0].currency : '₽'; }

/* ════════════════════════ Даты и форматирование ════════════════════════ */
function pad2(n){ return n < 10 ? '0'+n : ''+n; }
function dk(y,m,d){ return y + '-' + pad2(m+1) + '-' + pad2(d); }
function todayKey(){ const n = new Date(); return dk(n.getFullYear(), n.getMonth(), n.getDate()); }
function daysInMonth(y,m){ return new Date(y, m+1, 0).getDate(); }
function leadBlanks(y,m){ return (new Date(y, m, 1).getDay() + 6) % 7; }
function parseKey(k){ const p = String(k).split('-'); return [parseInt(p[0],10), parseInt(p[1],10)-1, parseInt(p[2],10)]; }
function fmtDate(k){
  if(!k) return '';
  const p = parseKey(k);
  const mn = (LANG === 'ru' ? MONTHS_GEN.ru : months())[p[1]] || '';
  return LANG === 'en' ? (mn + ' ' + p[2] + ', ' + p[0]) : (p[2] + ' ' + mn + ' ' + p[0]);
}
function fmtDayMonth(k){
  const p = parseKey(k);
  const mn = (LANG === 'ru' ? MONTHS_GEN.ru : months())[p[1]] || '';
  return LANG === 'en' ? (mn + ' ' + p[2]) : (p[2] + ' ' + mn);
}
function fmtWeekday(k){ const p = parseKey(k); return wdLong()[new Date(p[0], p[1], p[2]).getDay()]; }
function numStr(n, digits){
  const v = parseFloat(n) || 0;
  try{ return v.toLocaleString(LOCALES[LANG] || 'ru-RU', { maximumFractionDigits:(digits === undefined ? 2 : digits), minimumFractionDigits:0 }); }
  catch(e){ return String(Math.round(v*100)/100); }
}
function num(n){ return numStr(Math.round((parseFloat(n)||0)*100)/100); }
function money(n, cur){ return numStr(Math.round((parseFloat(n)||0)*100)/100) + ' ' + (cur || '₽'); }
function compact(n){
  const v = Math.abs(parseFloat(n) || 0);
  if(v >= 1e6) return numStr(n/1e6, 1) + (LANG === 'en' ? 'M' : ' млн');
  if(v >= 1e4) return numStr(n/1e3, 0) + (LANG === 'en' ? 'K' : ' тыс');
  return numStr(Math.round(n), 0);
}
function esc(s){
  return String(s === undefined || s === null ? '' : s).replace(/[&<>"']/g, function(c){
    return { '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c];
  });
}
/* Сумма с анимируемым числом: <span class="cv">12 345</span><span class="cur">₽</span> */
function moneyHtml(n, cur, cls){
  const v = Math.round((parseFloat(n)||0)*100)/100;
  return '<div class="'+cls+'" data-count="'+v+'"><span class="cv">'+esc(numStr(v))+'</span><span class="cur">'+esc(cur || '₽')+'</span></div>';
}

/* ════════════════════════ Иконки ════════════════════════ */
function svg(inner, w){
  return '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="'+(w||1.8)+'" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">'+inner+'</svg>';
}
const ico = {
  calendar:function(){ return svg('<rect x="3.5" y="5" width="17" height="15.5" rx="4"/><path d="M3.5 10h17"/><path d="M8.5 3v4M15.5 3v4"/><path d="M8 14h.01M12 14h.01M16 14h.01M8 17.5h.01M12 17.5h.01"/>', 1.9); },
  finance:function(){ return svg('<path d="M4 20V11"/><path d="M9.3 20V6"/><path d="M14.7 20v-6"/><path d="M20 20V8.5"/>', 2.1); },
  settings:function(){ return svg('<path d="M4 7h9"/><path d="M17 7h3"/><circle cx="15" cy="7" r="2.2"/><path d="M4 17h3"/><path d="M11 17h9"/><circle cx="9" cy="17" r="2.2"/>', 1.9); },
  grid:function(){ return svg('<rect x="4" y="4" width="6.5" height="6.5" rx="2"/><rect x="13.5" y="4" width="6.5" height="6.5" rx="2"/><rect x="4" y="13.5" width="6.5" height="6.5" rx="2"/><path d="M16.75 14v5.5M14 16.75h5.5"/>'); },
  range:function(){ return svg('<path d="M4 12h16"/><path d="M8 8l-4 4 4 4"/><path d="M16 8l4 4-4 4"/>'); },
  target:function(){ return svg('<circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/><path d="M12 2v2.5M12 19.5V22M2 12h2.5M19.5 12H22"/>'); },
  plus:function(){ return svg('<path d="M12 5v14"/><path d="M5 12h14"/>', 2.2); },
  check:function(){ return svg('<path d="M5 12.5l4.5 4.5L19 7.5"/>', 2.8); },
  chevR:function(){ return svg('<path d="M9.5 6l6 6-6 6"/>', 2.2); },
  chevL:function(){ return svg('<path d="M14.5 6l-6 6 6 6"/>', 2.2); },
  chevD:function(){ return svg('<path d="M6 9.5l6 6 6-6"/>', 2.2); },
  x:function(){ return svg('<path d="M6 6l12 12M18 6L6 18"/>', 2.2); },
  down:function(){ return svg('<path d="M12 4v11"/><path d="M7.5 10.5L12 15l4.5-4.5"/><path d="M5 20h14"/>'); },
  up:function(){ return svg('<path d="M12 15V4"/><path d="M7.5 8.5L12 4l4.5 4.5"/><path d="M5 20h14"/>'); },
  trash:function(){ return svg('<path d="M4 7h16"/><path d="M9.5 7V5h5v2"/><path d="M6.5 7l1 13h9l1-13"/><path d="M10 11v5M14 11v5"/>'); },
  doc:function(){ return svg('<path d="M14 3H7.5A2.5 2.5 0 0 0 5 5.5v13A2.5 2.5 0 0 0 7.5 21h9a2.5 2.5 0 0 0 2.5-2.5V8z"/><path d="M14 3v5h5"/><path d="M9 13h6M9 16.5h4"/>'); },
  shield:function(){ return svg('<path d="M12 3l7 3v6c0 4.4-3 8-7 9-4-1-7-4.6-7-9V6z"/><path d="M9.3 12.2l1.9 1.9 3.6-3.8"/>'); },
  palette:function(){ return svg('<path d="M12 3a9 9 0 1 0 0 18h1.3a2.3 2.3 0 0 0 0-4.6H12.5a2 2 0 0 1 0-4h3A4.5 4.5 0 0 0 20 8c-1.4-3-4.5-5-8-5z"/><circle cx="7.8" cy="11" r="1.1" fill="currentColor"/><circle cx="11" cy="7.4" r="1.1" fill="currentColor"/><circle cx="15.4" cy="7.8" r="1.1" fill="currentColor"/>'); },
  globe:function(){ return svg('<circle cx="12" cy="12" r="9"/><path d="M3 12h18"/><path d="M12 3c2.6 2.6 2.6 15.4 0 18"/><path d="M12 3c-2.6 2.6-2.6 15.4 0 18"/>'); },
  briefcase:function(){ return svg('<rect x="3" y="7" width="18" height="13" rx="3.5"/><path d="M8.5 7V5.8A1.8 1.8 0 0 1 10.3 4h3.4a1.8 1.8 0 0 1 1.8 1.8V7"/><path d="M3 12.5h18"/><path d="M12 11.5v2"/>'); },
  database:function(){ return svg('<ellipse cx="12" cy="6" rx="7.5" ry="3"/><path d="M4.5 6v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3V6"/><path d="M4.5 12v6c0 1.7 3.4 3 7.5 3s7.5-1.3 7.5-3v-6"/>'); },
  info:function(){ return svg('<circle cx="12" cy="12" r="9"/><path d="M12 11v5.5"/><path d="M12 7.6h.01"/>', 2); },
  moon:function(){ return svg('<path d="M20 14.6A8.2 8.2 0 1 1 9.4 4a6.6 6.6 0 0 0 10.6 10.6z"/>'); },
  sun:function(){ return svg('<circle cx="12" cy="12" r="4"/><path d="M12 2.5v2M12 19.5v2M4.6 4.6L6 6M18 18l1.4 1.4M2.5 12h2M19.5 12h2M4.6 19.4L6 18M18 6l1.4-1.4"/>'); },
  type:function(){ return svg('<path d="M3.5 18L8.5 6l5 12"/><path d="M5.3 14h6.4"/><circle cx="17.3" cy="15.3" r="2.8"/><path d="M20.1 12.5V18"/>'); },
  swipe:function(){ return svg('<path d="M4 12h16"/><path d="M7 9l-3 3 3 3"/><path d="M17 9l3 3-3 3"/>'); },
  wallet:function(){ return svg('<rect x="3" y="6" width="18" height="13.5" rx="3.5"/><path d="M3 10.5h18"/><path d="M16 15h1.5"/>'); },
  sparkle:function(){ return svg('<path d="M12 3l1.8 5.2L19 10l-5.2 1.8L12 17l-1.8-5.2L5 10l5.2-1.8z"/><path d="M19 16l.7 2 2 .7-2 .7-.7 2-.7-2-2-.7 2-.7z"/>', 1.6); },
  lock:function(){ return svg('<rect x="5" y="10.5" width="14" height="10" rx="3"/><path d="M8 10.5V8a4 4 0 0 1 8 0v2.5"/>'); },
  clock:function(){ return svg('<circle cx="12" cy="12" r="9"/><path d="M12 7v5l3 2"/>'); },
  edit:function(){ return svg('<path d="M4 20h4l10.5-10.5a2.8 2.8 0 0 0-4-4L4 16z"/><path d="M13.5 6.5l4 4"/>'); }
};

/* Фирменный знак: «день» в изгибе линии потока. Та же форма, что у навигационной панели. */
function brandMark(){
  return '<span class="brand-mark" aria-hidden="true"><svg viewBox="10 27 80 48" fill="none">'
    + '<path d="M15 51.8L24.56 51.8A7 7 0 0 1 30.74 55.52A21.8 21.8 0 0 0 69.26 55.52A7 7 0 0 1 75.44 51.8L85 51.8" stroke="currentColor" stroke-width="8" stroke-linecap="round"/>'
    + '<circle class="ball" cx="50" cy="45.3" r="14" fill="var(--accent)"/></svg></span>';
}
function appIconImg(){ return '<img src="icons/icon.svg" alt="" width="92" height="92" style="display:block;width:100%;height:100%">'; }

/* ════════════════════════ Отрисовка: «морфинг» DOM ════════════════════════
   HTML-строка разворачивается во временный фрагмент и аккуратно накладывается
   на текущий DOM. Узлы, которые не изменились, остаются на месте — поэтому
   работают CSS-переходы, сохраняется фокус и прокрутка. Узлы с другим data-key
   заменяются целиком (и проигрывают анимацию появления). */
function morph(parent, html){
  const tpl = document.createElement('template');
  tpl.innerHTML = html;
  morphChildren(parent, tpl.content);
}
function keyOf(n){ return n.nodeType === 1 ? n.getAttribute('data-key') : null; }
function sameNode(a, b){
  if(a.nodeType !== b.nodeType) return false;
  if(a.nodeType !== 1) return true;
  return a.tagName === b.tagName && keyOf(a) === keyOf(b);
}
function morphChildren(from, to){
  let a = from.firstChild;
  let b = to.firstChild;
  while(b){
    const nextB = b.nextSibling;
    if(!a){ from.appendChild(b); b = nextB; continue; }
    if(sameNode(a, b)){ morphNode(a, b); a = a.nextSibling; b = nextB; continue; }
    const kb = keyOf(b);
    let match = null;
    if(kb){
      for(let c = a.nextSibling; c; c = c.nextSibling){
        if(keyOf(c) === kb && c.tagName === b.tagName){ match = c; break; }
      }
    }
    if(match){ from.insertBefore(match, a); morphNode(match, b); }
    else if(nextB && sameNode(a, nextB)){ from.insertBefore(b, a); }
    else if(a.nextSibling && sameNode(a.nextSibling, b) && !keyOf(a)){
      const dead = a; a = a.nextSibling; from.removeChild(dead); morphNode(a, b); a = a.nextSibling;
    }
    else { const n = a.nextSibling; from.replaceChild(b, a); a = n; }
    b = nextB;
  }
  while(a){ const n = a.nextSibling; from.removeChild(a); a = n; }
}
function morphNode(a, b){
  if(a.nodeType !== 1){ if(a.nodeValue !== b.nodeValue) a.nodeValue = b.nodeValue; return; }
  const ba = b.attributes;
  for(let i=0;i<ba.length;i++){
    const at = ba[i];
    if(a.getAttribute(at.name) !== at.value) a.setAttribute(at.name, at.value);
  }
  for(let i=a.attributes.length-1;i>=0;i--){
    const n = a.attributes[i].name;
    if(!b.hasAttribute(n)) a.removeAttribute(n);
  }
  if(a.tagName === 'INPUT' || a.tagName === 'TEXTAREA'){
    const v = b.getAttribute('value') || '';
    if(document.activeElement !== a && a.value !== v) a.value = v;
    return;
  }
  morphChildren(a, b);
}

/* ════════════════════════ Тосты и вибро ════════════════════════ */
function toast(msg, action){
  const host = document.getElementById('toasts');
  if(!host) return;
  const el = document.createElement('div');
  el.className = 'toast' + (action ? ' has-act' : '');
  el.innerHTML = '<i>' + ico.check() + '</i><span></span>' + (action ? '<button type="button" class="toast-act"></button>' : '');
  el.querySelector('span').textContent = msg;
  let gone = false;
  const dismiss = function(){
    if(gone) return; gone = true;
    el.classList.add('out');
    setTimeout(function(){ if(el.parentNode) el.parentNode.removeChild(el); }, 340);
  };
  if(action){
    const b = el.querySelector('.toast-act');
    b.textContent = action.label;
    b.addEventListener('click', function(e){ e.stopPropagation(); dismiss(); action.fn(); });
  }
  host.appendChild(el);
  setTimeout(dismiss, action ? 5200 : 2000);
}
function haptic(kind){
  try{
    if(window.AndroidApp && typeof window.AndroidApp.haptic === 'function'){ window.AndroidApp.haptic(String(kind || 'tap')); return; }
    if(navigator.vibrate) navigator.vibrate(kind === 'heavy' ? 14 : 6);
  }catch(e){}
}
function reduceMotion(){ return !!(window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches); }

/* ════════════════════════ Навигация ════════════════════════ */
const TABS = [
  { id:'calendar', label:'Календарь', icon:ico.calendar },
  { id:'finance',  label:'Финансы',   icon:ico.finance },
  { id:'settings', label:'Настройки', icon:ico.settings }
];
function tabIdx(){ for(let i=0;i<TABS.length;i++){ if(TABS[i].id === ui.tab) return i; } return 0; }
function viewKey(){ return ui.tab + (ui.page ? '-' + ui.page : ''); }

function navigate(kind, mutate){
  ui.scrollMemo[viewKey()] = window.pageYOffset || 0;
  const go = function(){
    mutate();
    ui.viewAnim = kind;
    render();
    const y = (kind === 'push') ? 0 : (ui.scrollMemo[viewKey()] || 0);
    window.scrollTo(0, y);
    onScroll();
  };
  if(document.startViewTransition && !reduceMotion()){
    const root = document.documentElement;
    root.setAttribute('data-nav', kind);
    try{
      const vt = document.startViewTransition(go);
      vt.finished.then(done, done);
    }catch(e){ go(); done(); }
    function done(){ root.removeAttribute('data-nav'); }
  } else go();
}

/* Прогресс прокрутки → крупный заголовок плавно «уезжает» в компактную шапку */
let scrollRaf = 0;
function onScroll(){
  if(scrollRaf) return;
  scrollRaf = requestAnimationFrame(function(){
    scrollRaf = 0;
    const y = window.pageYOffset || 0;
    const p = Math.max(0, Math.min(1, (y - 10) / 46));
    document.documentElement.style.setProperty('--sp', p.toFixed(3));
  });
}
window.addEventListener('scroll', onScroll, { passive:true });

/* ════════════════════════ Навигационная панель с «выемкой» ════════════════════════ */
const TabBar = (function(){
  const H = 62, R = 24, RB = 22, GAP = 4, LIFT = 3, K = 14, PAD = 10;
  let wrap, fade, bar, glass, edge, edgePath, bubble, tabEls = [], bubbleIcons = [];
  let built = false, W = 0, idx = -1, near = -1;
  let x = 0, v = 0, target = 0, sink = 0, raf = 0, last = 0;
  let drag = null;
  const canClip = !!(window.CSS && CSS.supports && CSS.supports('clip-path', 'path("M0 0H1V1Z")'));

  function centers(){
    const slot = (W - PAD*2) / TABS.length;
    return TABS.map(function(_, i){ return PAD + slot * (i + .5); });
  }
  function nearestIndex(px){
    const c = centers();
    let best = 0;
    for(let i=1;i<c.length;i++){ if(Math.abs(c[i]-px) < Math.abs(c[best]-px)) best = i; }
    return best;
  }

  /* Верхняя граница панели — «мягкий максимум» из скруглённых углов и полукруглой
     выемки под пузырём. Мягкий максимум сам даёт плавные плечи выемки и аккуратно
     сливает её с углом, когда пузырь у края. */
  function topAt(px, nx, cy){
    let base = 0;
    if(px < R){ const d = R - px; base = R - Math.sqrt(Math.max(0, R*R - d*d)); }
    else if(px > W - R){ const d = px - (W - R); base = R - Math.sqrt(Math.max(0, R*R - d*d)); }
    if(!canClip) return base;
    const rc = RB + GAP;
    const dx = px - nx, adx = Math.abs(dx);
    const notch = cy + Math.sqrt(Math.max(0, rc*rc - dx*dx)) - Math.max(0, adx - rc) * 3;
    const h = Math.max(K - Math.abs(base - notch), 0) / K;
    return Math.max(base, notch) + h*h*K*0.25;
  }
  function shape(nx, cy){
    const rc = RB + GAP;
    const f = function(n){ return Math.round(n*10)/10; };
    let d = 'M0 ' + (H - R) + ' ';
    let px = 0;
    while(px <= W){
      d += 'L' + f(px) + ' ' + f(topAt(px, nx, cy)) + ' ';
      const near = Math.abs(px - nx) < rc + 8;
      const edgeZone = px < 3 || px > W - 3;
      px += edgeZone ? 0.5 : (near ? 1 : 3);
    }
    d += 'L' + W + ' ' + f(topAt(W, nx, cy)) + ' ';
    d += 'L' + W + ' ' + (H - R) + ' A' + R + ' ' + R + ' 0 0 1 ' + (W - R) + ' ' + H
       + ' L' + R + ' ' + H + ' A' + R + ' ' + R + ' 0 0 1 0 ' + (H - R) + ' Z';
    return d;
  }
  function draw(){
    if(!W) return;
    const cy = -LIFT + sink;
    const d = shape(x, cy);
    if(canClip) glass.style.clipPath = 'path("' + d + '")';
    edgePath.setAttribute('d', d);
    const sp = Math.abs(v);
    const sx = 1 + Math.min(sp / 3200, .08), sy = 1 - Math.min(sp / 6400, .04);
    bubble.style.transform = 'translate(' + (x - RB).toFixed(2) + 'px,' + (cy - RB).toFixed(2) + 'px) scale(' + sx.toFixed(3) + ',' + sy.toFixed(3) + ')';
    const n = nearestIndex(x);
    if(n !== near){
      near = n;
      tabEls.forEach(function(el, i){ el.classList.toggle('lift', i === n); });
      bubbleIcons.forEach(function(el, i){ el.classList.toggle('on', i === n); });
    }
  }
  function tick(now){
    const dt = Math.min(0.032, Math.max(0.001, (now - last) / 1000));
    last = now;
    const T = drag && drag.moved ? drag.x : target;
    const k = drag && drag.moved ? 900 : 420, c = drag && drag.moved ? 52 : 30;
    v += (-k * (x - T) - c * v) * dt;
    x += v * dt;
    const sinkTarget = Math.min(Math.abs(v) / 70, 6);
    sink += (sinkTarget - sink) * Math.min(1, dt * 14);
    draw();
    if(!(drag && drag.moved) && Math.abs(x - T) < 0.25 && Math.abs(v) < 4 && sink < 0.1){
      x = T; v = 0; sink = 0; draw(); raf = 0; return;
    }
    raf = requestAnimationFrame(tick);
  }
  function kick(){
    if(reduceMotion()){ x = drag && drag.moved ? drag.x : target; v = 0; sink = 0; draw(); return; }
    if(!raf){ last = performance.now(); raf = requestAnimationFrame(tick); }
  }
  function measure(){
    const w = bar.clientWidth;
    if(!w || w === W) return;
    W = w;
    edge.setAttribute('width', W); edge.setAttribute('height', H);
    edge.setAttribute('viewBox', '0 0 ' + W + ' ' + H);
    target = centers()[Math.max(0, idx)];
    x = target; v = 0;
    draw();
  }
  function goTo(i){
    const tb = TABS[i];
    if(!tb) return;
    haptic('tap');
    A.tab({ id:tb.id });
  }
  function build(){
    built = true;
    fade = document.createElement('div');
    fade.className = 'tabbar-fade';
    wrap = document.createElement('div');
    wrap.className = 'tabbar-wrap';
    let h = '<nav class="tabbar" id="tabbar" role="tablist" aria-label="ShiftFlow">'
      + '<div class="tb-shadow"></div><div class="tb-glass"><div class="tb-sheen"></div></div>'
      + '<svg class="tb-edge" aria-hidden="true"><defs><linearGradient id="tbEdgeG" x1="0" y1="0" x2="0" y2="1">'
      + '<stop offset="0" style="stop-color:var(--edge-top)"/><stop offset="1" style="stop-color:var(--edge-bottom)"/></linearGradient></defs>'
      + '<path stroke="url(#tbEdgeG)"/></svg>'
      + '<div class="tb-bubble" aria-hidden="true">';
    TABS.forEach(function(tb){ h += '<span class="bi">' + tb.icon() + '</span>'; });
    h += '</div><div class="tb-tabs">';
    TABS.forEach(function(tb, i){
      h += '<button type="button" class="tb-tab" role="tab" data-i="' + i + '"><span class="ic">' + tb.icon() + '</span><span class="lb"></span></button>';
    });
    h += '</div></nav>';
    wrap.innerHTML = h;
    document.body.appendChild(fade);
    document.body.appendChild(wrap);
    bar = wrap.querySelector('.tabbar');
    glass = wrap.querySelector('.tb-glass');
    edge = wrap.querySelector('.tb-edge');
    edgePath = edge.querySelector('path');
    bubble = wrap.querySelector('.tb-bubble');
    tabEls = Array.prototype.slice.call(wrap.querySelectorAll('.tb-tab'));
    bubbleIcons = Array.prototype.slice.call(wrap.querySelectorAll('.bi'));
    if(!canClip) glass.style.borderRadius = R + 'px';

    bar.addEventListener('pointerdown', function(e){
      if(e.button !== undefined && e.button !== 0) return;
      const r = bar.getBoundingClientRect();
      drag = { id:e.pointerId, startX:e.clientX, left:r.left, x:x, moved:false };
      try{ bar.setPointerCapture(e.pointerId); }catch(err){}
    });
    bar.addEventListener('pointermove', function(e){
      if(!drag || e.pointerId !== drag.id) return;
      if(!drag.moved && Math.abs(e.clientX - drag.startX) < 7) return;
      const c = centers();
      drag.moved = true;
      drag.x = Math.max(c[0], Math.min(c[c.length-1], e.clientX - drag.left));
      kick();
    });
    function end(e, cancel){
      if(!drag || (e && e.pointerId !== drag.id)) return;
      const d = drag; drag = null;
      if(d.moved){
        const i = nearestIndex(d.x);
        target = centers()[i];
        if(i !== tabIdx()) goTo(i); else kick();
        return;
      }
      if(cancel) return;
      const el = document.elementFromPoint(e.clientX, e.clientY);
      const tab = el && el.closest ? el.closest('.tb-tab') : null;
      if(tab) goTo(parseInt(tab.getAttribute('data-i'), 10));
    }
    bar.addEventListener('pointerup', function(e){ end(e, false); });
    bar.addEventListener('pointercancel', function(e){ end(e, true); });
    bar.addEventListener('click', function(e){
      const tab = e.target.closest ? e.target.closest('.tb-tab') : null;
      if(tab && e.detail === 0) goTo(parseInt(tab.getAttribute('data-i'), 10)); /* клавиатура */
    });
    if(window.ResizeObserver) new ResizeObserver(measure).observe(bar);
    window.addEventListener('resize', measure);
  }
  function sync(){
    if(!built) build();
    tabEls.forEach(function(el, i){
      const on = TABS[i].id === ui.tab;
      el.classList.toggle('on', on);
      el.setAttribute('aria-selected', on ? 'true' : 'false');
      el.setAttribute('aria-label', t(TABS[i].label));
      el.querySelector('.lb').textContent = t(TABS[i].label);
    });
    const hidden = !!ui.page;
    wrap.classList.toggle('hide', hidden);
    fade.classList.toggle('hide', hidden);
    if(!W) measure();
    const i = tabIdx();
    if(i !== idx){
      const first = idx < 0;
      idx = i;
      if(W){
        target = centers()[i];
        if(first){ x = target; draw(); }
        else if(!(drag && drag.moved)){
          kick();
          bubble.classList.remove('ping'); void bubble.offsetWidth; bubble.classList.add('ping');
        }
      }
    }
  }
  return { sync:sync };
})();

/* ════════════════════════ Общие блоки разметки ════════════════════════ */
function topbar(title, opts){
  opts = opts || {};
  return '<header class="topbar">'
    + (opts.back ? '<button type="button" class="icon-btn sm back" data-act="back" aria-label="'+esc(t('Назад'))+'">'+ico.chevL()+'</button>' : '')
    + '<div class="tb-title">'+esc(title)+'</div>'
    + (opts.right ? '<div class="tb-right">'+opts.right+'</div>' : '')
    + '</header>';
}
function pageHead(title, sub, isSub){
  return '<div class="page-head'+(isSub ? ' sub' : '')+'"><h1 class="page-title">'+esc(title)+'</h1>'
    + (sub ? '<div class="page-sub">'+esc(sub)+'</div>' : '') + '</div>';
}
function label(text, val, tail){
  return '<div class="label"><span>'+esc(text)+'</span>'
    + (val ? '<span class="val">'+esc(val)+'</span>' : '')
    + (tail ? '<span class="tail">'+tail+'</span>' : '') + '</div>';
}
function row(o){
  const tag = o.act ? 'button type="button"' : 'div';
  const end = o.end !== undefined ? o.end : (o.act ? ico.chevR() : '');
  return '<'+tag+' class="row'+(o.act ? '' : ' static')+(o.on ? ' on' : '')+'"'+(o.act ? ' data-act="'+o.act+'"' : '')
    + (o.data || '') + (o.key ? ' data-key="'+o.key+'"' : '') + '>'
    + (o.tile || '')
    + '<span class="row-body"><span class="row-title">'+esc(o.title)+'</span>'
    + (o.sub ? '<span class="row-sub">'+esc(o.sub)+'</span>' : '') + '</span>'
    + '<span class="row-end">'+(o.value ? esc(o.value) : '')+end+'</span>'
    + '</'+(o.act ? 'button' : 'div')+'>';
}
function tile(icon, cls){ return '<span class="tile'+(cls ? ' '+cls : '')+'">'+icon+'</span>'; }
function segHtml(items, value, act){
  let i0 = 0;
  items.forEach(function(x,i){ if(x.v === value) i0 = i; });
  return '<div class="seg" style="--n:'+items.length+';--i:'+i0+'"><div class="thumb"></div>'
    + items.map(function(x){
        return '<button type="button" class="'+(x.v === value ? 'on' : '')+'" data-act="'+act+'" data-v="'+x.v+'">'+esc(x.raw ? x.label : t(x.label))+'</button>';
      }).join('') + '</div>';
}
function statLine(st){
  return esc(cnt(st.shifts,'shift')) + '<span class="dotsep"></span>' + esc(cnt(st.hours,'hour')) + '<span class="dotsep"></span>' + esc(cnt(st.off,'off'));
}
function segbar(st){
  const parts = state.workplaces.map(function(w){ return { w:w, pay:(st.wpStats[w.id] || {}).pay || 0 }; }).filter(function(x){ return x.pay > 0; });
  if(!parts.length || st.total <= 0) return '<div class="segbar"></div>';
  let out = '<div class="segbar" role="img" aria-label="'+esc(parts.map(function(p){ return p.w.name + ' ' + Math.round(p.pay/st.total*100) + '%'; }).join(', '))+'">';
  parts.forEach(function(p, i){
    out += '<span style="--i:'+i+';flex:'+p.pay.toFixed(2)+';background:'+p.w.color+'" title="'+esc(p.w.name)+'"></span>';
  });
  out += '</div><div class="legend">';
  parts.forEach(function(p){ out += '<span><i style="background:'+p.w.color+'"></i>'+esc(p.w.name)+' · '+Math.round(p.pay/st.total*100)+'%</span>'; });
  return out + '</div>';
}
function warnHtml(){ return '<div class="warn">' + esc(t('Не удалось сохранить данные в этом браузере (возможно, включён приватный режим или закончилось место). Скачай резервную копию в настройках.')) + '</div>'; }

/* ════════════════════════ Экран «Календарь» ════════════════════════ */
function calendarView(){
  const y = ui.view.y, m = ui.view.m;
  const nDays = daysInMonth(y,m), lead = leadBlanks(y,m), tKey = todayKey();
  const mr = monthRange(y, m), ms = rangeStats(mr.from, mr.to), cur = defaultCurrency();
  let out = topbar(monthTitle(m) + ' ' + y);
  out += '<div class="brandrow"><div class="brand">' + brandMark()
      + '<span style="min-width:0"><span class="brand-name">Shift<i>Flow</i></span><span class="brand-sub">'+esc(t('Твой график — твой доход'))+'</span></span></div>'
      + '<button type="button" class="icon-btn" data-act="goToday" aria-label="'+esc(t('Перейти к сегодняшнему дню'))+'">'+ico.target()+'</button></div>';
  if(storageBroken) out += warnHtml();

  out += '<section class="card hero" style="--d:0">'
      + '<div class="eyebrow"><span class="pip"></span>'+esc(monthTitle(m))+' · '+esc(t('заработано'))+'</div>'
      + moneyHtml(ms.total, cur, 'hero-num')
      + '<div class="sub">'+statLine(ms)+'</div>'
      + segbar(ms)
      + '</section>';

  out += '<div class="month-nav">'
      + '<button type="button" class="icon-btn" data-act="prevMonth" aria-label="'+esc(t('Предыдущий месяц'))+'">'+ico.chevL()+'</button>'
      + '<div class="ml" data-act="goToday"><span class="m" data-key="ml-'+y+'-'+m+'">'+esc(monthTitle(m))+' '+y+'</span></div>'
      + '<button type="button" class="icon-btn" data-act="nextMonth" aria-label="'+esc(t('Следующий месяц'))+'">'+ico.chevR()+'</button>'
      + '</div>';
  out += '<div class="tools">'
      + toolCard('toggleRange', ico.range(), t('Период'), t('Сумма за даты'), ui.rangeMode)
      + toolCard('openPattern', ico.grid(), t('Шаблон'), t('2/2, 5/2 или свой'), !!(ui.sheet && ui.sheet.type === 'pattern'))
      + '</div>';
  out += rangePanel();

  out += '<section class="card cal" style="--d:1">';
  out += '<div class="wd">' + wdShort().map(function(w,i){ return '<div'+(i>4 ? ' class="we"' : '')+'>'+w+'</div>'; }).join('') + '</div>';
  out += '<div class="grid'+(ui.slide === 'l' ? ' slide-l' : (ui.slide === 'r' ? ' slide-r' : ''))+'" data-key="g-'+y+'-'+m+'">';
  for(let i=0;i<lead;i++) out += '<div class="day blank"></div>';
  for(let d=1; d<=nDays; d++) out += dayCell(dk(y,m,d), d, tKey, (lead + d - 1) % 7 >= 5);
  out += '</div>';
  out += '<div class="cal-foot">'+ico.swipe()+esc(t('Свайп — сменить месяц'))+'</div>';
  out += '</section>';

  out += dayEditor();
  return out;
}
/* Подпись места работы в клетке календаря: своя или первое слово названия */
function shortLabel(w){
  if(w.short) return w.short;
  const first = String(w.name || '').replace(/[«»"“”„'()]/g, ' ').trim().split(/\s+/)[0] || '';
  return first.slice(0, 12);
}
function toolCard(act, icon, title, sub, on){
  return '<button type="button" class="tool'+(on ? ' on' : '')+'" data-act="'+act+'" aria-pressed="'+(on ? 'true' : 'false')+'">'
    + tile(icon) + '<span class="tool-t"><b>'+esc(title)+'</b><small>'+esc(sub)+'</small></span></button>';
}

function dayCell(k, d, tKey, weekend){
  const s = state.shifts[k];
  let cls = 'day' + (weekend ? ' we' : ''), a = '', nm = '', wc = '', bar = false;
  if(k === tKey) cls += ' today';
  if(ui.selected === k && !ui.rangeMode) cls += ' sel';
  if(ui.rangeMode && ui.rangeStart){
    const b = rangeBounds();
    if(k === b[0] || k === b[1]) cls += ' range-edge';
    else if(k > b[0] && k < b[1]) cls += ' range';
  }
  let label = fmtDate(k);
  if(s && s.dayOff){
    cls += ' off'; nm = t('вых'); bar = true; label += ', ' + t('Выходной');
  } else if(s && s.workplaceId){
    const w = wpById(s.workplaceId);
    if(w){
      const pay = calcPay(s);
      cls += ' work'; wc = w.color; bar = true;
      nm = shortLabel(w);
      a = pay > 0 ? compact(pay) : '';
      label += ', ' + w.name + (pay > 0 ? ', ' + money(pay, w.currency) : '');
    }
  }
  /* Что подписывать в клетке — выбирается в «Оформлении» */
  if(prefs.dayLabel === 'sum'){ if(cls.indexOf(' off') >= 0) a = nm; nm = ''; }
  else if(prefs.dayLabel === 'name') a = '';
  const note = (state.notes && state.notes[k]) ? String(state.notes[k]) : '';
  return '<div class="'+cls+'" style="--i:'+d+(wc ? ';--wc:'+wc : '')+'" data-act="dayTap" data-k="'+k+'" role="button" tabindex="0" aria-label="'+esc(label)+'">'
    + '<span class="n">'+d+'</span>'
    + (nm ? '<span class="nm">'+esc(nm)+'</span>' : '')
    + (a ? '<span class="a">'+esc(a)+'</span>' : '')
    + (note ? '<span class="note"></span>' : '') + (bar ? '<span class="bar"></span>' : '') + '</div>';
}

function wpChipsHtml(selectedId, act, opts){
  opts = opts || {};
  let out = '<div class="chips">';
  if(opts.all) out += '<button type="button" class="chip muted'+(selectedId === '' ? ' on' : '')+'" style="--cc:var(--text-2)" data-act="'+act+'" data-id="">'+esc(t('Все'))+'</button>';
  state.workplaces.forEach(function(w){
    out += '<button type="button" class="chip'+(selectedId === w.id ? ' on' : '')+'" style="--cc:'+w.color+'" data-act="'+act+'" data-id="'+w.id+'"><i></i>'+esc(w.name)+'</button>';
  });
  if(opts.off) out += '<button type="button" class="chip muted'+(opts.offOn ? ' on' : '')+'" style="--cc:var(--text-3)" data-act="pickOff"><i></i>'+esc(t('Выходной'))+'</button>';
  if(opts.add && !state.workplaces.length) out += '<button type="button" class="chip add" data-act="addWorkplace">'+esc('+ ' + t('Добавить место работы'))+'</button>';
  return out + '</div>';
}

function dayEditor(){
  const k = ui.selected;
  if(!k || ui.rangeMode) return '';
  const s = state.shifts[k] || {};
  const has = !!(s.workplaceId || s.dayOff);
  const w = s.workplaceId ? wpById(s.workplaceId) : null;
  const pc = w ? w.color : (s.dayOff ? 'var(--text-3)' : 'var(--accent)');
  let sub = fmtWeekday(k);
  if(w) sub += ' · ' + w.name; else if(s.dayOff) sub += ' · ' + t('Выходной');
  let out = '<section class="panel" style="--pc:'+pc+'" data-key="ed-'+k+'">';
  out += '<div class="panel-head"><div class="panel-title">'+esc(fmtDayMonth(k))+'<small>'+esc(sub)+'</small></div>'
      +  '<button type="button" class="icon-btn sm" data-act="closeEditor" aria-label="'+esc(t('Закрыть день'))+'">'+ico.x()+'</button></div>';

  if(!has || ui.editorPicker){
    out += wpChipsHtml(s.workplaceId, 'pickWp', { off:true, offOn:!!s.dayOff, add:true });
  } else {
    out += '<div class="chips">'
        + (s.dayOff
            ? '<button type="button" class="chip on" style="--cc:var(--text-3)" data-act="pickOff"><i></i>'+esc(t('Выходной'))+'</button>'
            : (w ? '<button type="button" class="chip on" style="--cc:'+w.color+'" data-act="pickWp" data-id="'+w.id+'"><i></i>'+esc(w.name)+'</button>' : ''))
        + '<button type="button" class="chip muted" data-act="reopenPicker">'+ico.edit().replace('<svg','<svg style="width:15px;height:15px"')+esc(t('Сменить'))+'</button></div>';
  }

  if(w && !s.dayOff){
    const daily = w.payType === 'daily';
    out += '<div class="row2">'
        +  '<div class="field"><label for="hours">'+esc(daily ? t('Часов (учёт, на оплату не влияет)') : t('Часов'))+'</label>'
        +  '<input id="hours" data-inp="hours" type="number" min="0" step="0.5" inputmode="decimal" value="'+esc(s.hours === undefined || s.hours === null ? '' : String(s.hours))+'"></div>'
        +  '<div class="field"><label for="dayAdjust">'+esc(t('Корректировка к оплате за этот день'))+'</label>'
        +  '<input id="dayAdjust" data-inp="dayAdjust" type="number" step="1" inputmode="decimal" value="'+esc(s.adjust === undefined || s.adjust === null || s.adjust === '' ? '' : String(s.adjust))+'" placeholder="±0"></div>'
        +  '</div>';
    out += '<div class="preview" id="payPreview">'+payPreviewHtml(k)+'</div>';
  }
  out += '<div class="field"><label for="dayNote">'+esc(t('Заметка ко дню'))+'</label>'
      +  '<input id="dayNote" data-inp="dayNote" type="text" maxlength="140" value="'+esc((state.notes && state.notes[k]) || '')+'" placeholder="'+esc(t('Например: подменил смену'))+'"></div>';
  if(has) out += '<div class="actions"><button type="button" class="link danger" data-act="clearDay">'+esc(t('Очистить день'))+'</button></div>';
  return out + '</section>';
}

function payPreviewHtml(k){
  const s = state.shifts[k];
  if(!s || !s.workplaceId) return '';
  const w = wpById(s.workplaceId);
  if(!w) return '';
  const base = basePay(s), adj = parseFloat(s.adjust) || 0, pay = base + adj;
  let html = '<span>'+esc(t('Оплата'))+'</span>';
  if(adj){
    html += '<span class="num">'+esc(money(base, w.currency))+'</span><span class="num '+(adj > 0 ? 'plus' : 'minus')+'">'+(adj > 0 ? '+ ' : '− ')+esc(money(Math.abs(adj), w.currency))+'</span><span>=</span>';
  }
  html += '<span class="v num">'+esc(money(pay, w.currency))+'</span>';
  if(w.payType === 'daily' && parseFloat(s.hours) > 0){
    html += '<span>≈ '+esc(money(pay / (parseFloat(s.hours) || 1), w.currency))+' / '+esc(t('час'))+'</span>';
  }
  return html;
}

function rangeBounds(){
  const rs = ui.rangeStart, re = ui.rangeEnd || ui.rangeStart;
  if(!rs) return null;
  return rs <= re ? [rs, re] : [re, rs];
}
function rangePresets(){
  const y = ui.view.y, m = ui.view.m, n = daysInMonth(y, m);
  const now = new Date();
  const mon = new Date(now.getFullYear(), now.getMonth(), now.getDate() - (now.getDay() + 6) % 7);
  const k = function(d){ return dk(d.getFullYear(), d.getMonth(), d.getDate()); };
  const add = function(d, x){ return new Date(d.getFullYear(), d.getMonth(), d.getDate() + x); };
  const pm = m === 0 ? 11 : m - 1, py = m === 0 ? y - 1 : y;
  return [
    { label:monthTitle(m), from:dk(y,m,1), to:dk(y,m,n) },
    { label:'1–15', from:dk(y,m,1), to:dk(y,m,15) },
    { label:'16–' + n, from:dk(y,m,16), to:dk(y,m,n) },
    { label:t('Эта неделя'), from:k(mon), to:k(add(mon, 6)) },
    { label:t('Прошлая неделя'), from:k(add(mon, -7)), to:k(add(mon, -1)) },
    { label:monthTitle(pm), from:dk(py,pm,1), to:dk(py,pm,daysInMonth(py,pm)) }
  ];
}
function rangePanel(){
  if(!ui.rangeMode) return '';
  const b = rangeBounds();
  const picking = !!(ui.rangeStart && !ui.rangeEnd);
  let out = '<section class="panel rangep" data-key="range">';
  out += '<div class="panel-head"><div class="panel-title">'+esc(t('Подсчёт за период'))
      +  '<small>'+esc(picking ? t('Теперь отметь последний день') : t('Выбери даты или отметь их на календаре'))+'</small></div>'
      +  '<button type="button" class="icon-btn sm" data-act="toggleRange" aria-label="'+esc(t('Закрыть'))+'">'+ico.x()+'</button></div>';
  out += '<div class="chips presets">';
  rangePresets().forEach(function(p){
    const on = !picking && b && b[0] === p.from && b[1] === p.to;
    out += '<button type="button" class="chip'+(on ? ' on' : '')+'" data-act="rangePreset" data-f="'+p.from+'" data-t="'+p.to+'">'+esc(p.label)+'</button>';
  });
  out += '</div>';
  out += '<div class="daterow">'
      +  '<div><span class="flabel">'+esc(t('С'))+'</span><div class="picker" data-act="openPicker" data-t="rangeFrom" role="button">'+esc(b ? fmtDayMonth(b[0]) : '—')+ico.calendar()+'</div></div>'
      +  '<span class="dr-arrow">'+ico.chevR()+'</span>'
      +  '<div><span class="flabel">'+esc(t('По'))+'</span><div class="picker'+(picking ? ' wait' : '')+'" data-act="openPicker" data-t="rangeTo" role="button">'+esc(picking ? '…' : (b ? fmtDayMonth(b[1]) : '—'))+ico.calendar()+'</div></div>'
      +  '</div>';
  if(b){
    const st = rangeStats(b[0], b[1]);
    const days = Math.round((new Date(parseKey(b[1])[0], parseKey(b[1])[1], parseKey(b[1])[2]) - new Date(parseKey(b[0])[0], parseKey(b[0])[1], parseKey(b[0])[2])) / 864e5) + 1;
    out += '<div class="range-res"><div class="eyebrow"><span class="pip"></span>'+esc(cnt(days, 'day'))+'</div>'
        +  moneyHtml(st.total, defaultCurrency(), 'big')
        +  '<div class="sub">'+statLine(st)+'</div>'
        +  (state.workplaces.length ? wpBreakdown(st) : '') + '</div>';
  }
  return out + '</section>';
}

/* ════════════════════════ Шаблон графика ════════════════════════ */
function patternDays(p){
  const out = [];
  if(!p.start || !p.end) return out;
  let a = p.start, z = p.end;
  if(z < a){ const tmp = a; a = z; z = tmp; }
  const s0 = parseKey(a);
  const d = new Date(s0[0], s0[1], s0[2]);
  const wd = Math.max(1, Math.round(parseFloat(p.workDays) || 1));
  const od = Math.max(0, Math.round(parseFloat(p.offDays) || 0));
  for(let i = 0; i < 800; i++){
    const k = dk(d.getFullYear(), d.getMonth(), d.getDate());
    if(k > z) break;
    const dow = (d.getDay() + 6) % 7;
    const work = p.mode === 'week' ? !!p.weekdays[dow] : (i % (wd + od)) < wd;
    out.push({ k:k, work:work, dow:dow, day:d.getDate() });
    d.setDate(d.getDate() + 1);
  }
  return out;
}
function stepper(field, value, label){
  return '<div class="stepper" role="group" aria-label="'+esc(label)+'">'
    + '<button type="button" data-act="patStep" data-f="'+field+'" data-d="-1" aria-label="−">−</button>'
    + '<input id="pat-'+field+'" data-inp="patField" data-f="'+field+'" type="number" inputmode="decimal" value="'+esc(String(value))+'" aria-label="'+esc(label)+'">'
    + '<button type="button" data-act="patStep" data-f="'+field+'" data-d="1" aria-label="+">+</button></div>';
}
function patternSheet(){
  const p = ui.pattern;
  const w = wpById(p.workplaceId);
  const days = patternDays(p);
  let works = 0, offs = 0, kept = 0, pay = 0;
  days.forEach(function(x){
    if(!p.replace && state.shifts[x.k]){ kept++; return; }
    if(x.work){ works++; if(w) pay += w.payType === 'daily' ? w.rate : w.rate * (parseFloat(p.hours) || 0); }
    else offs++;
  });
  const sameArr = function(a, b){ return a.join('') === b.join(''); };
  let inner = '<div class="sheet pat" role="dialog" aria-modal="true"><div class="grabber"></div>';
  inner += '<h2>'+esc(t('График по шаблону'))+'</h2><div class="hint">'+esc(t('Отметит смены и выходные на выбранные даты'))+'</div>';
  inner += '<div class="field"><label>'+esc(t('Место работы'))+'</label>'+wpChipsHtml(p.workplaceId, 'patWp', { add:true })+'</div>';
  inner += '<div class="field"><label>'+esc(t('Как чередовать'))+'</label>'+segHtml([ { v:'cycle', label:'Смены и выходные' }, { v:'week', label:'По дням недели' } ], p.mode, 'patMode')+'</div>';
  if(p.mode === 'week'){
    inner += '<div class="weekpick">' + wdShort().map(function(d, i){
      return '<button type="button" class="wdt'+(p.weekdays[i] ? ' on' : '')+(i > 4 ? ' we' : '')+'" data-act="patWeekday" data-i="'+i+'" aria-pressed="'+(p.weekdays[i] ? 'true' : 'false')+'">'+d+'</button>';
    }).join('') + '</div>';
    inner += '<div class="chips mini">' + [ ['Пн–Пт', [1,1,1,1,1,0,0]], ['Пн–Сб', [1,1,1,1,1,1,0]], ['Сб и Вс', [0,0,0,0,0,1,1]] ].map(function(x){
      return '<button type="button" class="chip'+(sameArr(p.weekdays, x[1]) ? ' on' : '')+'" data-act="patWeekPreset" data-v="'+x[1].join('')+'">'+esc(t(x[0]))+'</button>';
    }).join('') + '</div>';
  } else {
    inner += '<div class="chips mini">' + [[2,2],[3,3],[1,3],[2,1],[4,2],[5,2]].map(function(pr){
      const on = (parseFloat(p.workDays) === pr[0] && parseFloat(p.offDays) === pr[1]);
      return '<button type="button" class="chip'+(on ? ' on' : '')+'" data-act="patPreset" data-w="'+pr[0]+'" data-o="'+pr[1]+'">'+pr[0]+' / '+pr[1]+'</button>';
    }).join('') + '</div>';
    inner += '<div class="row2"><div class="field"><label>'+esc(t('Смен подряд'))+'</label>'+stepper('workDays', p.workDays, t('Смен подряд'))+'</div>'
          +  '<div class="field"><label>'+esc(t('Выходных подряд'))+'</label>'+stepper('offDays', p.offDays, t('Выходных подряд'))+'</div></div>';
  }
  inner += '<div class="row2"><div class="field"><label>'+esc(t('С'))+'</label><div class="picker" data-act="openPicker" data-t="patternStart" role="button">'+esc(fmtDayMonth(p.start))+ico.calendar()+'</div></div>'
        +  '<div class="field"><label>'+esc(t('По'))+'</label><div class="picker" data-act="openPicker" data-t="patternEnd" role="button">'+esc(fmtDayMonth(p.end))+ico.calendar()+'</div></div></div>';
  inner += '<div class="chips mini">' + [ ['week', 'До конца недели'], ['month', 'До конца месяца'], ['next', 'И следующий месяц'] ].map(function(x){
    return '<button type="button" class="chip'+(p.end === patternEndFor(x[0]) ? ' on' : '')+'" data-act="patEnd" data-v="'+x[0]+'">'+esc(t(x[1]))+'</button>';
  }).join('') + '</div>';
  inner += '<div class="field"><label>'+esc(w && w.payType === 'daily' ? t('Часов (учёт, на оплату не влияет)') : t('Часов за смену'))+'</label>'+stepper('hours', p.hours, t('Часов за смену'))+'</div>';
  inner += '<div class="switch-row"><span><b>'+esc(t('Заменить уже отмеченные дни'))+'</b><small>'+esc(p.replace ? t('Отмеченные дни перезапишутся') : t('Отмеченные дни останутся как есть'))+'</small></span>'
        +  '<button type="button" class="switch'+(p.replace ? ' on' : '')+'" data-act="patReplace" role="switch" aria-checked="'+(p.replace ? 'true' : 'false')+'" aria-label="'+esc(t('Заменить уже отмеченные дни'))+'"></button></div>';
  inner += '<div class="field"><label>'+esc(t('Предпросмотр'))+'</label><div class="pstrip">'
        +  days.slice(0, 14).map(function(x){
             const keep = !p.replace && !!state.shifts[x.k];
             return '<div class="pd'+(keep ? ' keep' : (x.work ? ' w' : ''))+'"'+(w ? ' style="--wc:'+w.color+'"' : '')+'><span>'+wdShort()[x.dow]+'</span><b>'+x.day+'</b></div>';
           }).join('')
        +  '</div><div class="plegend"><span><i class="w"'+(w ? ' style="--wc:'+w.color+'"' : '')+'></i>'+esc(t('Смена'))+'</span><span><i></i>'+esc(t('Выходной'))+'</span>'+(kept ? '<span><i class="keep"></i>'+esc(t('Уже отмечено'))+'</span>' : '')
        +  (days.length > 14 ? '<span class="pmore">'+esc(t('и ещё'))+' '+esc(cnt(days.length - 14, 'day'))+'</span>' : '')+'</div></div>';
  inner += '<div class="psum">'+esc(t('Будет отмечено'))+': <b>'+esc(cnt(works, 'shift'))+'</b> · <b>'+esc(cnt(offs, 'off'))+'</b>'
        +  (pay > 0 && w ? '<br>'+esc(t('Примерный доход'))+': <b class="num">'+esc(money(pay, w.currency))+'</b>' : '')
        +  (kept ? '<br><span>'+esc(t('Не тронем уже отмеченные дни'))+': '+kept+'</span>' : '') + '</div>';
  inner += '<div class="btns"><button type="button" class="btn ghost" data-act="ovlCloseBtn">'+esc(t('Отмена'))+'</button>'
        +  '<button type="button" class="btn primary'+(works + offs ? '' : ' off')+'" data-act="applyPattern">'+esc(t('Применить'))+'</button></div></div>';
  return ovl('pattern', '', inner);
}
function patternEndFor(kind){
  const p = ui.pattern;
  if(!p.start) return '';
  const s0 = parseKey(p.start);
  const d = new Date(s0[0], s0[1], s0[2]);
  if(kind === 'week'){ const e = new Date(s0[0], s0[1], s0[2] + (6 - (d.getDay() + 6) % 7)); return dk(e.getFullYear(), e.getMonth(), e.getDate()); }
  if(kind === 'next'){ const ny = s0[1] === 11 ? s0[0] + 1 : s0[0], nm = (s0[1] + 1) % 12; return dk(ny, nm, daysInMonth(ny, nm)); }
  return dk(s0[0], s0[1], daysInMonth(s0[0], s0[1]));
}

function wpBreakdown(st){
  let out = '';
  state.workplaces.forEach(function(w, i){
    const ws = st.wpStats[w.id] || { pay:0, hours:0, days:0 };
    const pct = st.total > 0 ? Math.max(0, Math.round((ws.pay / st.total) * 100)) : 0;
    out += '<div class="wp" style="--i:'+i+';--cc:'+w.color+'">'
        + '<span class="dot"></span>'
        + '<div class="wp-body"><div class="wp-name"><span>'+esc(w.name)+'</span><span>'+esc(cnt(ws.days,'shift'))+' · '+esc(num(ws.hours))+' '+esc(t('ч'))+'</span></div>'
        + '<div class="track"><div class="fill" style="--w:'+pct+'%;--i:'+i+'"></div></div></div>'
        + '<div class="wp-sum num">'+esc(money(ws.pay, w.currency))+'</div></div>';
  });
  return out;
}

/* ════════════════════════ Экран «Финансы» ════════════════════════ */
function financeView(){
  const y = ui.view.y, m = ui.view.m;
  const mr = monthRange(y, m), ms = rangeStats(mr.from, mr.to), cur = defaultCurrency();
  let out = topbar(t('Финансы'));
  out += pageHead(t('Финансы'), LANG === 'en' ? 'Shifts, rates and income' : 'Смены, ставки и доход');
  if(storageBroken) out += warnHtml();
  out += '<div class="month-nav">'
      + '<button type="button" class="icon-btn" data-act="prevMonth" aria-label="'+esc(t('Предыдущий месяц'))+'">'+ico.chevL()+'</button>'
      + '<div class="ml" data-act="goToday"><span class="m" data-key="fml-'+y+'-'+m+'">'+esc(monthTitle(m))+' '+y+'</span></div>'
      + '<button type="button" class="icon-btn" data-act="nextMonth" aria-label="'+esc(t('Следующий месяц'))+'">'+ico.chevR()+'</button></div>';

  out += label(t('Итого за месяц'));
  out += '<section class="card" style="--d:0">';
  out += '<div class="eyebrow"><span class="pip"></span>'+esc(monthTitle(m))+' '+y+'</div>';
  out += moneyHtml(ms.total, cur, 'hero-num');
  out += '<div class="sub">'+statLine(ms)+'</div>';
  if(state.workplaces.length) out += wpBreakdown(ms);
  else out += '<div class="empty" style="padding-bottom:4px"><div class="ill">'+ico.briefcase()+'</div>'+esc(t('Добавь место работы, чтобы отмечать смены и считать доход.'))
            + '<div style="margin-top:12px"><button type="button" class="pill solid" data-act="addWorkplace">'+ico.plus()+esc(t('Добавить место работы'))+'</button></div></div>';
  if(ms.shifts || ms.off) out += '<div class="actions"><button type="button" class="link danger" data-act="clearMonth">'+esc(t('Очистить месяц'))+'</button></div>';
  out += '</section>';

  /* Год */
  const sy = ui.statsYear;
  const ys = rangeStats(sy + '-01-01', sy + '-12-31');
  const now = new Date();
  const monthsStats = [];
  let maxV = 0, best = -1;
  for(let mi=0; mi<12; mi++){
    const s2 = rangeStats(dk(sy, mi, 1), dk(sy, mi, daysInMonth(sy, mi)));
    monthsStats.push(s2);
    if(s2.total > maxV){ maxV = s2.total; best = mi; }
  }
  out += label(t('Статистика за год'), '', '<button type="button" class="icon-btn sm" data-act="prevYear" aria-label="-1">'+ico.chevL()+'</button><span class="num" style="font-weight:800;color:var(--text);font-size:.9rem">'+sy+'</span><button type="button" class="icon-btn sm" data-act="nextYear" aria-label="+1">'+ico.chevR()+'</button>');
  out += '<section class="card" style="--d:1">';
  out += moneyHtml(ys.total, cur, 'big');
  out += '<div class="sub">'+statLine(ys)+'</div>';

  /* Столбики по месяцам: один ряд, акцент — текущий месяц, значение — в подписи над графиком */
  const sel = (ui.chartSel !== null && ui.chartSel !== undefined) ? ui.chartSel : (sy === now.getFullYear() ? now.getMonth() : best);
  const sm = sel >= 0 ? monthsStats[sel] : null;
  out += '<div class="chart"><div class="chart-cap">'
      + (sm ? '<span>'+esc(monthTitle(sel))+(sel === best && maxV > 0 ? ' · '+esc(t('Лучший месяц')) : '')+'</span><b class="num">'+esc(money(sm.total, cur))+'</b>'
            : '<span>'+esc(t('Выбери столбик, чтобы увидеть месяц'))+'</span>')
      + '</div><div class="cols" data-key="cols-'+sy+'" role="list">';
  monthsStats.forEach(function(s2, mi){
    const h = maxV > 0 ? Math.max(2, Math.round(s2.total / maxV * 100)) : 2;
    const cls = 'col' + (s2.total <= 0 ? ' zero' : '') + (sy === now.getFullYear() && mi === now.getMonth() ? ' now' : '') + (mi === sel ? ' sel' : '');
    out += '<div class="'+cls+'" role="listitem" data-act="chartSel" data-m="'+mi+'" title="'+esc(monthTitle(mi)+': '+money(s2.total, cur))+'" aria-label="'+esc(monthTitle(mi)+': '+money(s2.total, cur))+'"><span style="--h:'+h+'%;--i:'+mi+'"></span></div>';
  });
  out += '</div><div class="col-x">';
  (MONTH_LETTER[LANG] || MONTH_LETTER.ru).forEach(function(l, mi){ out += '<span class="'+(sy === now.getFullYear() && mi === now.getMonth() ? 'now' : '')+'">'+l+'</span>'; });
  out += '</div></div>';

  if(ui.statsOpen){
    out += '<div class="mlist">';
    monthsStats.forEach(function(s2, mi){
      const empty = !(s2.shifts || s2.hours || s2.off || s2.total);
      out += '<div class="mrow'+(empty ? ' empty' : '')+'" style="--i:'+mi+'"><div><div class="mn">'+esc(monthTitle(mi))+'</div>'
          + '<div class="ms">'+esc(cnt(s2.shifts,'shift'))+' · '+esc(cnt(s2.hours,'hour'))+' · '+esc(cnt(s2.off,'off'))+'</div></div>'
          + '<div class="mv num">'+esc(money(s2.total, cur))+'</div></div>';
    });
    out += '<div class="mrow total"><div><div class="mn">'+esc(t('Итого за год'))+'</div><div class="ms">'+esc(cnt(ys.shifts,'shift'))+' · '+esc(cnt(ys.hours,'hour'))+'</div></div>'
        + '<div class="mv num">'+esc(money(ys.total, cur))+'</div></div></div>';
  }
  out += '<div class="actions" style="justify-content:center"><button type="button" class="pill" data-act="toggleStats">'
      + esc(ui.statsOpen ? t('Свернуть') : t('Показать по месяцам'))
      + '<span style="display:inline-block;transition:transform .4s var(--spring);transform:rotate('+(ui.statsOpen ? 180 : 0)+'deg)">'+ico.chevD()+'</span></button></div>';
  out += '</section>';

  /* Экспорт */
  out += label(t('Экспорт в Excel'));
  out += '<section class="card" style="--d:2">';
  out += '<div class="row2">'
      +  '<div><span class="flabel">'+esc(t('С'))+'</span><div class="picker" data-act="openPicker" data-t="exportFrom" role="button">'+esc(fmtDate(ui.export.from))+ico.calendar()+'</div></div>'
      +  '<div><span class="flabel">'+esc(t('По'))+'</span><div class="picker" data-act="openPicker" data-t="exportTo" role="button">'+esc(fmtDate(ui.export.to))+ico.calendar()+'</div></div>'
      +  '</div></section>';
  out += '<div class="group" style="--d:3">';
  state.workplaces.forEach(function(w){
    out += row({ act:'exportWp', data:' data-id="'+w.id+'"', key:'ex-'+w.id, tile:'<span class="tile tw" style="--cc:'+w.color+'"><i></i></span>', title:w.name, sub:'.xlsx', end:ico.down() });
  });
  out += row({ act:'exportAll', key:'ex-all', tile:tile(ico.doc()), title:t('Скачать всё'), sub:t('Все места работы'), end:ico.down() });
  out += '</div>';
  out += '<div class="note">'+esc(t('Файлы создаются на устройстве — интернет не нужен.'))+'</div>';
  return out;
}

/* ════════════════════════ Экран «Настройки» и вложенные страницы ════════════════════════ */
function themeQuickRow(){
  const dark = !isLight();
  return '<div class="group" style="--d:0"><div class="row static">'
    + tile(dark ? ico.moon() : ico.sun())
    + '<span class="row-body"><span class="row-title">'+esc(t('Тёмная тема'))+'</span><span class="row-sub">'+esc(dark ? t('Удобно для глаз вечером') : t('Включено светлое оформление'))+'</span></span>'
    + '<button type="button" class="daynight'+(dark ? ' night' : '')+'" data-act="toggleDark" role="switch" aria-checked="'+dark+'" aria-label="'+esc(t('Тёмная тема'))+'">'
    + '<span class="knob"></span><span class="star"></span><span class="star"></span><span class="star"></span><span class="cloud"></span></button>'
    + '</div></div>';
}
function styleSummary(){
  return accentName(prefs.accent) + ' · ' + optName(BACKGROUNDS, prefs.bg) + ' · ' + optName(TEXT_SIZES, prefs.textSize);
}

function settingsView(){
  let out = topbar(t('Настройки'));
  out += pageHead(t('Настройки'), t('Сделай приложение своим'));
  if(storageBroken) out += warnHtml();
  out += themeQuickRow();
  out += label(t('Персонализация'));
  out += '<div class="group" style="--d:1">'
      + row({ act:'openPage', data:' data-p="appearance"', tile:tile(ico.palette()), title:t('Оформление'), sub:styleSummary() })
      + row({ act:'openPage', data:' data-p="language"', tile:tile(ico.globe()), title:t('Язык'), sub:LANG === 'en' ? 'English' : 'Русский' })
      + '</div>';
  out += label(t('Работа'));
  out += '<div class="group" style="--d:2">'
      + row({ act:'openPage', data:' data-p="workplaces"', tile:tile(ico.briefcase()), title:t('Места работы'),
              sub: state.workplaces.length ? cnt(state.workplaces.length, 'place') + ' · ' + state.workplaces.map(function(w){ return w.name; }).join(', ') : t('Мест работы пока нет') })
      + '</div>';
  out += label(t('Данные'));
  out += '<div class="group" style="--d:3">'
      + row({ act:'openPage', data:' data-p="data"', tile:tile(ico.database()), title:t('Резервная копия'), sub:t('Перенос и восстановление') })
      + '</div>';
  out += label(t('О приложении'));
  out += '<div class="group" style="--d:4">'
      + row({ act:'openAgreement', tile:tile(ico.doc()), title:t('Пользовательское соглашение'), value:prefs.agreement ? 'v'+prefs.agreement.version : '' })
      + row({ act:'openPrivacy', tile:tile(ico.shield()), title:t('Политика конфиденциальности') })
      + row({ tile:tile(ico.info()), title:t('Версия'), value:APP_BUILD, end:'' })
      + '</div>';
  out += '<div class="note">'+esc(t('Нет сервера, аккаунта и рекламы. Приложение не отправляет данные в сеть.'))+'<br>ShiftFlow '+APP_BUILD+' · '+esc(t('Сделано с заботой о твоём времени.'))+'</div>';
  return out;
}

function appearancePage(){
  let out = topbar(t('Оформление'), { back:true });
  out += pageHead(t('Оформление'), t('Изменения видны сразу'), true);
  const light = isLight();

  /* Живое превью: те же цвета мест работы, подсветка и подписи, что и в календаре */
  const wps = state.workplaces.length ? state.workplaces : [ { color:SWATCHES[0], name:t('Смена') }, { color:SWATCHES[1], name:t('Смена') } ];
  const w0 = wps[0], w1 = wps[1] || wps[0];
  const days = [ [null], [w0], [w0], [null, 't'], [w1], ['off'], [w0] ];
  out += '<section class="card demo" style="--d:0"><div class="demo-top"><div><div class="eyebrow"><span class="pip"></span>'+esc(monthTitle(ui.view.m))+' · '+esc(t('заработано'))+'</div>'
      + '<div class="big" style="margin-top:6px">'+esc(numStr(demoTotal()))+'<span class="cur">'+esc(defaultCurrency())+'</span></div></div>'
      + '<button type="button" class="pill solid" tabindex="-1">'+ico.plus()+esc(t('смена'))+'</button></div>'
      + '<div class="demo-days">' + days.map(function(d, i){
          const w = d[0] && d[0] !== 'off' ? d[0] : null;
          const nm = w ? shortLabel(w) : (d[0] === 'off' ? t('вых') : '');
          return '<div class="'+(d[1] || '')+(d[0] === 'off' ? ' off' : '')+'"'+(w ? ' style="--wc:'+w.color+'"' : '')+'><b>'+(i + 10)+'</b>'
            + (nm && prefs.dayLabel !== 'sum' ? '<em>'+esc(nm)+'</em>' : '') + (w ? '<i></i>' : '') + '</div>';
        }).join('') + '</div></section>';

  out += themeQuickRow();
  out += label(t('Тема'), prefs.theme === 'auto' ? t('Авто') : (prefs.theme === 'light' ? t('Светлая') : t('Тёмная')));
  out += segHtml([ { v:'auto', label:'Авто' }, { v:'light', label:'Светлая' }, { v:'dark', label:'Тёмная' } ], prefs.theme, 'setTheme');

  out += label(t('Цвет акцента'), accentName(prefs.accent));
  out += '<section class="card" style="--d:2"><div class="swatches grid6">';
  ACCENTS.forEach(function(a){
    const on = String(prefs.accent).toUpperCase() === a.c;
    out += '<button type="button" class="swatch'+(on ? ' on' : '')+'" style="--c:'+a.c+'" data-act="setAccent" data-v="'+a.c+'" aria-label="'+esc(t(a.n))+'" aria-pressed="'+on+'">'+ico.check()+'</button>';
  });
  out += '</div>';
  const custom = isCustomAccent();
  out += '<div class="custom">'
      +  '<button type="button" class="swatch'+(custom ? ' on' : '')+'" style="--c:'+hslHex(prefs.customHue)+'" data-act="useCustom" aria-label="'+esc(t('Свой цвет'))+'" aria-pressed="'+custom+'">'+ico.check()+'</button>'
      +  '<div class="hue"><label class="flabel" for="hue">'+esc(t('Свой цвет'))+'</label>'
      +  '<input id="hue" type="range" min="0" max="359" step="1" value="'+prefs.customHue+'" data-inp="hue"></div></div>';
  out += '</section>';

  out += label(t('Фон'), optName(BACKGROUNDS, prefs.bg));
  out += '<div class="bgs">' + BACKGROUNDS.map(function(b){
    return '<button type="button" class="bgc'+(prefs.bg === b.v ? ' on' : '')+'" data-act="setBg" data-v="'+b.v+'" style="--b:'+(light ? b.l : b.d)+';--s:'+(light ? b.ls : b.ds)+'" aria-pressed="'+(prefs.bg === b.v)+'">'
      + '<span class="bgp"><i></i><i></i></span>'+esc(t(b.n))+'</button>';
  }).join('') + '</div>';

  out += label(t('Размер текста'), optName(TEXT_SIZES, prefs.textSize));
  out += '<div class="sizes">';
  TEXT_SIZES.forEach(function(x, i){
    out += '<button type="button" class="'+(x.v === prefs.textSize ? 'on' : '')+'" style="font-size:'+(13 + i*3)+'px" data-act="setTextSize" data-v="'+x.v+'" aria-label="'+esc(t(x.n))+'">Aa</button>';
  });
  out += '</div>';

  out += label(t('Стиль интерфейса'), optName(UI_STYLES, prefs.uiStyle));
  out += '<div class="styles">';
  UI_STYLES.forEach(function(x){
    const r = Math.round(14 * x.k);
    out += '<button type="button" class="'+(x.v === prefs.uiStyle ? 'on' : '')+'" style="border-radius:'+r+'px" data-act="setUiStyle" data-v="'+x.v+'">'
        + '<div class="mini" style="border-radius:'+Math.round(9*x.k)+'px"></div>'+esc(t(x.n))+'</button>';
  });
  out += '</div>';

  out += label(t('Подсветка смен'), optName(DAY_TINTS, prefs.dayTint));
  out += segHtml(DAY_TINTS.map(function(x){ return { v:x.v, label:x.n }; }), prefs.dayTint, 'setDayTint');
  out += label(t('Подписи в днях'), optName(DAY_LABELS, prefs.dayLabel));
  out += segHtml(DAY_LABELS.map(function(x){ return { v:x.v, label:x.s }; }), prefs.dayLabel, 'setDayLabel');

  const n = changesCount();
  if(n){
    out += '<div class="changes"><div class="changes-in"><span class="cnt"><i></i>'+esc(cnt(n, 'change'))+'</span>'
        + '<button type="button" class="btn ghost sm" data-act="discardAppearance">'+esc(t('Отменить'))+'</button>'
        + '<button type="button" class="btn primary sm" data-act="commitAppearance">'+esc(t('Готово'))+'</button></div></div>';
  }
  return out;
}
function demoTotal(){
  const mr = monthRange(ui.view.y, ui.view.m);
  const v = rangeStats(mr.from, mr.to).total;
  return v > 0 ? Math.round(v) : 48600;
}
const LOOK_KEYS = ['theme', 'accent', 'textSize', 'uiStyle', 'bg', 'dayTint', 'dayLabel', 'customHue'];
function appearanceSnapshot(){
  const o = {};
  LOOK_KEYS.forEach(function(k){ o[k] = k === 'accent' ? String(prefs.accent).toUpperCase() : prefs[k]; });
  return o;
}
function changesCount(){
  if(ui.page !== 'appearance' || !ui.snapshot) return 0;
  const cur = appearanceSnapshot();
  let n = 0;
  for(const k in cur) if(k !== 'customHue' && cur[k] !== ui.snapshot[k]) n++;
  return n;
}

function languagePage(){
  let out = topbar(t('Язык'), { back:true });
  out += pageHead(t('Язык'), t('Язык меню и подсказок'), true);
  out += '<section class="card hello" style="--d:0"><div class="hw" data-key="hw-'+LANG+'">'+(LANG === 'en' ? 'Hello' : 'Привет')+'</div>'
      + '<div class="hs">'+esc(LANG === 'en' ? t('Меню и подсказки на английском') : t('Меню и подсказки на русском'))+'</div></section>';
  out += label(t('Все языки'));
  out += '<div class="group" style="--d:1">';
  [ { v:'ru', n:'Русский', s:'Russian' }, { v:'en', n:'English', s:'Английский' } ].forEach(function(l){
    out += row({ act:'setLang', data:' data-v="'+l.v+'"', on:LANG === l.v, title:l.n, sub:l.s, end:'<span class="radio">'+ico.check()+'</span>' });
  });
  out += '</div><div class="note">'+esc(t('Язык интерфейса не зависит от языка системы.'))+'</div>';
  return out;
}

function workplacesPage(){
  let out = topbar(t('Места работы'), { back:true, right: state.workplaces.length < 10 ? '<button type="button" class="icon-btn sm" data-act="addWorkplace" aria-label="'+esc(t('Добавить место работы'))+'">'+ico.plus()+'</button>' : '' });
  out += pageHead(t('Места работы'), t('Ставки, валюта и цвет'), true);
  if(!state.workplaces.length){
    out += '<section class="card"><div class="empty"><div class="ill">'+ico.briefcase()+'</div><b style="display:block;color:var(--text);font-size:1rem;margin-bottom:4px">'+esc(t('Мест работы пока нет'))+'</b>'
        + esc(t('Добавь место работы, чтобы отмечать смены и считать доход.'))
        + '<div style="margin-top:14px"><button type="button" class="pill solid" data-act="addWorkplace">'+ico.plus()+esc(t('Добавить место работы'))+'</button></div></div></section>';
    return out;
  }
  out += '<div class="group" style="--d:0">';
  state.workplaces.forEach(function(w, i){
    const rate = w.payType === 'daily' ? (t('Фиксированная') + ' · ' + money(w.rate, w.currency)) : (money(w.rate, w.currency) + ' / ' + t('час'));
    out += row({ act:'editWorkplace', data:' data-i="'+i+'"', key:'wp-'+w.id, tile:'<span class="tile tw" style="--cc:'+w.color+'"><i></i></span>', title:w.name, sub:rate });
  });
  out += '</div>';
  if(state.workplaces.length < 10){
    out += '<button type="button" class="btn primary" style="width:100%" data-act="addWorkplace">'+esc('+ ' + t('Добавить место работы'))+'</button>';
  } else {
    out += '<div class="note">'+esc(t('Достигнут лимит — 10 мест работы'))+'</div>';
  }
  return out;
}

function dataPage(){
  let out = topbar(t('Данные'), { back:true });
  out += pageHead(t('Данные'), t('Всё хранится только на этом устройстве'), true);
  out += '<section class="card" style="--d:0;display:flex;gap:14px;align-items:flex-start">'+tile(ico.lock())
      + '<div class="sub" style="margin:0">'+esc(t('Нет сервера, аккаунта и рекламы. Приложение не отправляет данные в сеть.'))+'</div></section>';
  out += label(t('Резервная копия'));
  out += '<div class="group" style="--d:1">'
      + row({ act:'backupExport', tile:tile(ico.down()), title:t('Скачать резервную копию'), sub:t('Файл .json со всеми данными'), end:'' })
      + row({ act:'backupImport', tile:tile(ico.up()), title:t('Восстановить из файла'), sub:t('Резервная копия .json или выгрузка Excel'), end:'' })
      + '</div>';
  out += '<div class="note" style="margin-top:0;margin-bottom:6px;text-align:left">'+esc(t('Переезжаешь со старой версии сайта? Открой там «Финансы», в «Экспорте» поставь дату «С» на свою первую смену и нажми «Скачать всё (все места работы)». Потом выбери этот файл здесь.'))+'</div>';
  out += label(t('Опасная зона'));
  out += '<div class="group" style="--d:2">'
      + row({ act:'clearWorkplaces', tile:tile(ico.trash(), 'danger'), title:t('Удалить все данные'), sub:t('Места, смены и выплаты'), end:'' })
      + '</div>';
  return out;
}

function viewHtml(){
  let body = '';
  if(ui.tab === 'settings' && ui.page === 'appearance') body = appearancePage();
  else if(ui.tab === 'settings' && ui.page === 'language') body = languagePage();
  else if(ui.tab === 'settings' && ui.page === 'workplaces') body = workplacesPage();
  else if(ui.tab === 'settings' && ui.page === 'data') body = dataPage();
  else if(ui.tab === 'finance') body = financeView();
  else if(ui.tab === 'settings') body = settingsView();
  else body = calendarView();
  return '<main class="view in-'+ui.viewAnim+'" data-key="v-'+viewKey()+'">' + body + '</main>';
}

/* ════════════════════════ Листы и диалоги ════════════════════════ */
const LEGAL_RU = ''
+'<p>Версия '+AGREEMENT_VERSION+'. Условия действуют с момента первого запуска ShiftFlow.</p>'
+'<h3>1. Что это за приложение</h3>'
+'<p>ShiftFlow — личный инструмент для учёта рабочих смен, ставок и дохода. Это не бухгалтерская программа и не замена документам работодателя: все расчёты носят справочный характер.</p>'
+'<h3>2. Где хранятся данные</h3>'
+'<p>Смены, места работы, ставки, дополнительные внесения и выплаты хранятся <b>только на твоём устройстве</b>. У приложения нет сервера и аккаунта, нет рекламы и аналитики: оно не собирает и не передаёт персональные данные и не обращается к сети.</p>'
+'<p>Очистка данных браузера, удаление приложения или сброс устройства удаляют и записи — восстановить их не получится. Копию расчётов можно выгрузить в Excel в разделе «Финансы».</p>'
+'<h3>3. Ответственность</h3>'
+'<p>Ты сам отвечаешь за точность введённых данных и за то, как используешь расчёты. Автор не несёт ответственности за решения, принятые на их основе, а также за потерю данных из-за очистки хранилища, сбоя устройства или удаления приложения.</p>'
+'<h3>4. Изменения условий</h3>'
+'<p>Условия могут обновляться вместе с приложением. Актуальная версия всегда доступна в настройках, а при существенном изменении приложение попросит подтвердить согласие заново.</p>';
const LEGAL_EN = ''
+'<p>Version '+AGREEMENT_VERSION+'. These terms apply from the first launch of ShiftFlow.</p>'
+'<h3>1. What this app is</h3>'
+'<p>ShiftFlow is a personal tool for tracking work shifts, rates and income. It is not accounting software and does not replace any employer document: every calculation is for reference only.</p>'
+'<h3>2. Where your data lives</h3>'
+'<p>Shifts, workplaces, rates, extra income and payments are stored <b>only on your device</b>. The app has no server and no account, no ads and no analytics: it does not collect or transmit personal data and makes no network requests.</p>'
+'<p>Clearing browser data, deleting the app or resetting the device also deletes your records, and they cannot be recovered. You can export a copy of your calculations to Excel in the Finance tab.</p>'
+'<h3>3. Liability</h3>'
+'<p>You are responsible for the accuracy of the data you enter and for how you use the calculations. The author is not liable for decisions made on their basis, nor for data loss caused by clearing storage, device failure or app removal.</p>'
+'<h3>4. Changes</h3>'
+'<p>These terms may be updated together with the app. The current version is always available in Settings, and on a material change the app will ask you to accept them again.</p>';
function legalHtml(){ return LANG === 'en' ? LEGAL_EN : LEGAL_RU; }

const PRIVACY_RU = ''
+'<p>Действует с 9 ноября 2026 г. Относится к приложению ShiftFlow для Android и веб-версии.</p>'
+'<h3>Какие данные мы собираем</h3>'
+'<p><b>Никаких.</b> ShiftFlow не собирает, не передаёт и не продаёт персональные данные. В приложении нет аккаунтов, рекламы, аналитики, трекеров и сторонних SDK.</p>'
+'<h3>Что хранится на устройстве</h3>'
+'<p>Смены, места работы, ставки, заметки и настройки оформления хранятся только в памяти приложения на твоём устройстве. Разработчик не имеет к ним доступа.</p>'
+'<h3>Доступ к сети и разрешения</h3>'
+'<p>Приложение работает без интернета и не запрашивает доступ к контактам, местоположению, камере или микрофону. Файлы (Excel, резервная копия) создаются только по твоему запросу и сохраняются туда, куда ты выберешь.</p>'
+'<h3>Удаление данных</h3>'
+'<p>Удалить все данные можно в «Настройки → Резервная копия → Удалить все данные» или удалив приложение.</p>'
+'<h3>Дети</h3>'
+'<p>Приложение не предназначено для детей младше 13 лет и не собирает их данные.</p>'
+'<h3>Контакты</h3>'
+'<p>Вопросы о конфиденциальности: github.com/dimavotinov73-beep/ShiftFlow/issues</p>';
const PRIVACY_EN = ''
+'<p>Effective November 9, 2026. Applies to the ShiftFlow Android app and web version.</p>'
+'<h3>What data we collect</h3>'
+'<p><b>None.</b> ShiftFlow does not collect, transmit or sell personal data. There are no accounts, ads, analytics, trackers or third-party SDKs.</p>'
+'<h3>What is stored on your device</h3>'
+'<p>Shifts, workplaces, rates, notes and appearance settings are stored only in the app storage on your device. The developer has no access to them.</p>'
+'<h3>Network access and permissions</h3>'
+'<p>The app works offline and does not request access to contacts, location, camera or microphone. Files (Excel, backup) are created only when you ask and saved where you choose.</p>'
+'<h3>Deleting data</h3>'
+'<p>Delete everything in Settings → Backup → Delete all data, or uninstall the app.</p>'
+'<h3>Children</h3>'
+'<p>The app is not directed at children under 13 and does not collect their data.</p>'
+'<h3>Contact</h3>'
+'<p>Privacy questions: github.com/dimavotinov73-beep/ShiftFlow/issues</p>';

function ovl(kind, extra, inner, closable){
  const closing = ui.closing === kind ? ' closing' : '';
  return '<div class="overlay'+(extra || '')+closing+'" data-key="ov-'+kind+'"'+(closable === false ? '' : ' data-act="ovlClose"')+'>'+inner+'</div>';
}
function overlayHtml(){
  let out = '';
  if(ui.sheet) out += sheetHtml();
  if(ui.confirm) out += confirmHtml();
  if(ui.picker) out += pickerHtml();
  return out;
}
function confirmHtml(){
  const c = ui.confirm;
  return ovl('confirm', ' center', '<div class="sheet" role="alertdialog" aria-modal="true">'
    + '<h2>'+esc(c.title || t('Подтверди'))+'</h2>'
    + '<div class="hint">'+esc(c.message)+'</div>'
    + '<div class="btns">'
    + '<button type="button" class="btn ghost" data-act="confirmNo">'+esc(t('Отмена'))+'</button>'
    + '<button type="button" class="btn '+(c.danger ? 'danger' : 'primary')+'" data-act="confirmYes">'+esc(c.label || t('Да'))+'</button>'
    + '</div></div>');
}
function pickerHtml(){
  const p = ui.picker;
  const nDays = daysInMonth(p.y, p.m), lead = leadBlanks(p.y, p.m);
  const cur = pickerValue(p.target), tKey = todayKey();
  let inner = '<div class="sheet dp" role="dialog" aria-modal="true"><div class="grabber"></div>';
  inner += '<div class="dp-head"><button type="button" class="icon-btn sm" data-act="pickerNav" data-d="-1" aria-label="-1">'+ico.chevL()+'</button>'
        +  '<div class="t" data-key="dp-'+p.y+'-'+p.m+'">'+esc(monthTitle(p.m))+' '+p.y+'</div>'
        +  '<button type="button" class="icon-btn sm" data-act="pickerNav" data-d="1" aria-label="+1">'+ico.chevR()+'</button></div>';
  inner += '<div class="wd">'+wdShort().map(function(w,i){ return '<div'+(i>4 ? ' class="we"' : '')+'>'+w+'</div>'; }).join('')+'</div>';
  inner += '<div class="grid" data-key="dpg-'+p.y+'-'+p.m+'">';
  for(let i=0;i<lead;i++) inner += '<div class="day blank"></div>';
  for(let d=1; d<=nDays; d++){
    const k = dk(p.y, p.m, d);
    inner += '<div class="day'+(k === cur ? ' range-edge' : (k === tKey ? ' today' : ''))+'" style="--i:'+d+'" data-act="pickerPick" data-k="'+k+'" role="button"><span class="n">'+d+'</span></div>';
  }
  inner += '</div><div class="btns"><button type="button" class="btn ghost" data-act="pickerClose">'+esc(t('Закрыть'))+'</button></div></div>';
  return ovl('picker', '', inner);
}
function pickerValue(target){
  if(target === 'patternStart') return ui.pattern.start;
  if(target === 'patternEnd') return ui.pattern.end;
  if(target === 'rangeFrom'){ const b = rangeBounds(); return b ? b[0] : null; }
  if(target === 'rangeTo'){ const b = rangeBounds(); return b ? b[1] : null; }
  if(target === 'exportFrom') return ui.export.from;
  if(target === 'exportTo') return ui.export.to;
  if(!ui.sheet) return null;
  if(target === 'income') return ui.sheet.date;
  if(target === 'payFrom') return ui.sheet.from;
  if(target === 'payTo') return ui.sheet.to;
  return null;
}
function setPickerValue(target, k){
  if(target === 'patternStart'){
    ui.pattern.start = k;
    if(!ui.pattern.end || ui.pattern.end < k){ const p = parseKey(k); ui.pattern.end = dk(p[0], p[1], daysInMonth(p[0], p[1])); }
    return;
  }
  if(target === 'patternEnd'){ ui.pattern.end = k < ui.pattern.start ? ui.pattern.start : k; return; }
  if(target === 'rangeFrom' || target === 'rangeTo'){
    const b = rangeBounds() || [k, k];
    let f = target === 'rangeFrom' ? k : b[0], to = target === 'rangeTo' ? k : b[1];
    if(to < f){ const tmp = f; f = to; to = tmp; }
    ui.rangeStart = f; ui.rangeEnd = to;
    showRangeMonth(f, to);
    return;
  }
  if(target === 'exportFrom'){ ui.export.from = k; return; }
  if(target === 'exportTo'){ ui.export.to = k; return; }
  if(!ui.sheet) return;
  if(target === 'income') ui.sheet.date = k;
  else if(target === 'payFrom') ui.sheet.from = k;
  else if(target === 'payTo') ui.sheet.to = k;
}
function sheetHtml(){
  const s = ui.sheet;
  if(s.type === 'agreement') return s.mode === 'first' ? welcomeSheet() : docSheet(t('Пользовательское соглашение'), legalHtml());
  if(s.type === 'privacy') return docSheet(t('Политика конфиденциальности'), LANG === 'en' ? PRIVACY_EN : PRIVACY_RU);
  if(s.type === 'income') return incomeSheet(s);
  if(s.type === 'payment') return paymentSheet(s);
  if(s.type === 'workplace') return workplaceSheet(s);
  if(s.type === 'pattern') return patternSheet();
  return '';
}
function docSheet(title, html){
  return ovl('doc', '', '<div class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div><h2>'+esc(title)+'</h2><div class="legal" style="margin-top:12px">'+html+'</div>'
    + '<div class="btns"><button type="button" class="btn ghost" data-act="ovlCloseBtn">'+esc(t('Закрыть'))+'</button></div></div>');
}
function welcomeSheet(){
  const feats = [
    [ico.calendar(), t('Календарь смен'), t('Отмечай смены и выходные в одно касание')],
    [ico.finance(), t('Доход по ставкам'), t('Почасовые и фиксированные ставки, корректировки')],
    [ico.lock(), t('Только на устройстве'), t('Без аккаунта и интернета')]
  ];
  let inner = '<div class="sheet welcome" role="dialog" aria-modal="true">';
  inner += '<div class="logo-xl">'+appIconImg()+'</div>';
  inner += '<h2>'+esc(t('Добро пожаловать'))+'</h2><div class="hint">'+esc(t('Твой график — твой доход'))+'</div>';
  inner += '<div class="feats">' + feats.map(function(f, i){
    return '<div class="feat" style="--i:'+i+'">'+tile(f[0])+'<div class="ft"><b>'+esc(f[1])+'</b><span>'+esc(f[2])+'</span></div></div>';
  }).join('') + '</div>';
  inner += '<div class="legal-wrap'+(ui.legalOpen ? ' open' : '')+'"><button type="button" class="link acc" data-act="toggleLegalText">'
        +  esc(t('Пользовательское соглашение'))+' · '+esc(ui.legalOpen ? t('Скрыть') : t('Читать полностью'))+'</button>'
        +  '<div class="legal">'+legalHtml()+'</div></div>';
  inner += '<div class="checks" data-act="toggleLegal" role="checkbox" aria-checked="'+(ui.legalChecked ? 'true' : 'false')+'"><div class="box'+(ui.legalChecked ? ' on' : '')+'">'+ico.check()+'</div>'
        +  '<div class="txt" style="text-align:left">'+esc(t('Я прочитал условия и согласен, что данные хранятся только на этом устройстве.'))+'</div></div>';
  inner += '<div class="btns"><button type="button" class="btn primary'+(ui.legalChecked ? '' : ' off')+'" data-act="acceptAgreement" aria-disabled="'+(ui.legalChecked ? 'false' : 'true')+'">'+esc(t('Начать'))+'</button></div>';
  inner += '</div>';
  return ovl('welcome', ' center', inner, false);
}
function incomeSheet(s){
  return ovl('income', '', '<div class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div>'
    + '<h2>'+esc(t('Добавить внесение'))+'</h2>'
    + '<div class="field"><label>'+esc(t('Дата'))+'</label><div class="picker" data-act="openPicker" data-t="income" role="button">'+esc(fmtDate(s.date))+ico.calendar()+'</div></div>'
    + '<div class="field"><label for="incAmount">'+esc(t('Сумма'))+'</label><input id="incAmount" data-inp="incAmount" type="number" min="0" step="0.01" inputmode="decimal" value="'+esc(s.amount)+'"></div>'
    + '<div class="field"><label>'+esc(t('Место работы (необязательно)'))+'</label>'+wpChipsHtml(s.workplaceId, 'sheetWp', { all:true })+'</div>'
    + '<div class="field"><label for="incNote">'+esc(t('Заметка (необязательно)'))+'</label><input id="incNote" data-inp="incNote" type="text" value="'+esc(s.note)+'"></div>'
    + '<div class="btns"><button type="button" class="btn ghost" data-act="ovlCloseBtn">'+esc(t('Отмена'))+'</button><button type="button" class="btn primary" data-act="saveIncome">'+esc(t('Сохранить'))+'</button></div></div>');
}
function paymentSheet(s){
  return ovl('payment', '', '<div class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div>'
    + '<h2>'+esc(t('Записать выплату'))+'</h2>'
    + '<div class="row2"><div class="field"><label>'+esc(t('С'))+'</label><div class="picker" data-act="openPicker" data-t="payFrom" role="button">'+esc(fmtDate(s.from))+'</div></div>'
    + '<div class="field"><label>'+esc(t('По'))+'</label><div class="picker" data-act="openPicker" data-t="payTo" role="button">'+esc(fmtDate(s.to))+'</div></div></div>'
    + '<div class="field"><label for="payAmount">'+esc(t('Сумма'))+'</label><input id="payAmount" data-inp="payAmount" type="number" min="0" step="0.01" inputmode="decimal" value="'+esc(s.amount)+'"></div>'
    + '<div class="field"><label>'+esc(t('Место работы (необязательно)'))+'</label>'+wpChipsHtml(s.workplaceId, 'sheetWp', { all:true })+'</div>'
    + '<div class="field"><label for="payNote">'+esc(t('Заметка (необязательно)'))+'</label><input id="payNote" data-inp="payNote" type="text" value="'+esc(s.note)+'"></div>'
    + '<div class="btns"><button type="button" class="btn ghost" data-act="ovlCloseBtn">'+esc(t('Отмена'))+'</button><button type="button" class="btn primary" data-act="savePayment">'+esc(t('Сохранить'))+'</button></div></div>');
}
function workplaceSheet(s){
  const editing = s.index !== null && s.index !== undefined;
  let inner = '<div class="sheet" role="dialog" aria-modal="true"><div class="grabber"></div>';
  inner += '<div style="display:flex;align-items:center;gap:12px"><span class="tile tw" style="--cc:'+s.color+';width:44px;height:44px"><i></i></span>'
        +  '<h2 style="margin:0">'+esc(editing ? t('Место работы') : t('Добавить место работы'))+'</h2></div>';
  inner += '<div class="field"><label for="wpName">'+esc(t('Название'))+'</label><input id="wpName" data-inp="wpName" type="text" value="'+esc(s.name)+'" maxlength="60" placeholder="'+esc(t('Например: Кофейня'))+'"></div>';
  inner += '<div class="field"><label for="wpShort">'+esc(t('Подпись в календаре'))+'</label><input id="wpShort" data-inp="wpShort" type="text" value="'+esc(s.short || '')+'" maxlength="10" placeholder="'+esc(String(s.name || '').trim().split(/\s+/)[0] || t('Например: Кофе'))+'"></div>';
  inner += '<div class="field"><label>'+esc(t('Тип оплаты'))+'</label>'+segHtml([ { v:'hourly', label:'Почасовая' }, { v:'daily', label:'Фиксированная' } ], s.payType, 'sheetPayType')+'</div>';
  inner += '<div class="row2">'
        +  '<div class="field" style="flex:2"><label for="wpRate">'+esc(s.payType === 'daily' ? t('Ставка (за смену)') : t('Ставка (в час)'))+'</label><input id="wpRate" data-inp="wpRate" type="number" min="0" step="1" inputmode="decimal" value="'+esc(s.rate)+'"></div>'
        +  '<div class="field"><label for="wpCur">'+esc(t('Валюта'))+'</label><input id="wpCur" data-inp="wpCur" type="text" value="'+esc(s.currency)+'" maxlength="4"></div>'
        +  '</div>';
  inner += '<div class="field"><label for="wpDefHours">'+esc(t('Часов на смену по умолчанию'))+'</label><input id="wpDefHours" data-inp="wpDefHours" type="number" min="0" step="0.5" inputmode="decimal" value="'+esc(String(s.defaultHours === undefined ? 8 : s.defaultHours))+'"></div>';
  inner += '<div class="field"><label>'+esc(t('Цвет'))+'</label><div class="swatches sm">';
  SWATCHES.forEach(function(c){
    inner += '<button type="button" class="swatch'+(s.color === c ? ' on' : '')+'" style="--c:'+c+'" data-act="sheetColor" data-v="'+c+'" aria-label="'+c+'">'+ico.check()+'</button>';
  });
  inner += '</div></div><div class="btns">';
  inner += editing ? '<button type="button" class="btn ghost" style="color:var(--danger)" data-act="deleteWorkplace">'+esc(t('Удалить'))+'</button>'
                   : '<button type="button" class="btn ghost" data-act="ovlCloseBtn">'+esc(t('Отмена'))+'</button>';
  inner += '<button type="button" class="btn primary" data-act="saveWorkplace">'+esc(t('Сохранить'))+'</button></div></div>';
  return ovl('workplace', '', inner);
}

/* ════════════════════════ Рендер ════════════════════════ */
function render(){
  if(!booted) return;
  const app = document.getElementById('app');
  if(!app) return;
  morph(app, viewHtml() + overlayHtml());
  app.classList.toggle('subpage', !!ui.page);
  app.classList.toggle('has-bar', changesCount() > 0);
  const locked = !!(ui.sheet || ui.confirm || ui.picker);
  document.documentElement.classList.toggle('lock', locked);
  document.body.classList.toggle('lock', locked);
  TabBar.sync();
  afterRender();
}
function afterRender(){
  runCounters();
  if(ui.pendingPulse){
    ui.pendingPulse = false;
    const el = document.querySelector('.grid .day.today');
    if(el){ el.classList.add('pulse'); setTimeout(function(){ el.classList.remove('pulse'); }, 750); }
  }
  syncBack();
}

/* Плавный «набег» чисел при смене суммы */
function runCounters(){
  const els = document.querySelectorAll('[data-count]');
  for(let i=0;i<els.length;i++){
    const el = els[i];
    const to = parseFloat(el.getAttribute('data-count')) || 0;
    const prev = el.__v;
    el.__v = to;
    const from = prev === undefined ? 0 : prev;
    if(from === to || reduceMotion()) continue;
    const span = el.querySelector('.cv');
    if(!span) continue;
    const t0 = performance.now(), dur = prev === undefined ? 900 : 650;
    const digits = Math.round(to) === to ? 0 : 2;
    if(el.__raf) cancelAnimationFrame(el.__raf);
    span.textContent = numStr(from, digits);
    const step = function(now){
      const p = Math.min(1, (now - t0) / dur);
      const e = 1 - Math.pow(1 - p, 4);
      span.textContent = numStr(from + (to - from) * e, p < 1 ? 0 : digits);
      if(p < 1) el.__raf = requestAnimationFrame(step); else el.__raf = 0;
    };
    el.__raf = requestAnimationFrame(step);
  }
}

/* ════════════════════════ «Назад» (Android и жест в PWA) ════════════════════════ */
function canGoBack(){
  if(ui.picker || ui.confirm) return true;
  if(ui.sheet) return !(ui.sheet.type === 'agreement' && ui.sheet.mode === 'first');
  return !!(ui.page || ui.rangeMode || ui.tab !== 'calendar');
}
function handleBack(){
  if(ui.picker || ui.confirm || ui.sheet){
    if(ui.sheet && ui.sheet.type === 'agreement' && ui.sheet.mode === 'first' && !ui.picker && !ui.confirm) return true;
    closeTop(); return true;
  }
  if(ui.page){ A.back(); return true; }
  if(ui.rangeMode){ A.toggleRange(); return true; }
  if(ui.tab !== 'calendar'){ A.tab({ id:'calendar' }); return true; }
  return false;
}
let histGuard = false, histIgnore = 0;
function syncBack(){
  const need = canGoBack();
  if(window.AndroidApp){
    if(typeof window.AndroidApp.setCanGoBack === 'function'){ try{ window.AndroidApp.setCanGoBack(need); }catch(e){} }
    return;
  }
  if(!window.history || !history.pushState || window.top !== window) return;
  if(need && !histGuard){ try{ history.pushState({ sf:1 }, ''); histGuard = true; }catch(e){} }
  else if(!need && histGuard){ histGuard = false; histIgnore++; try{ history.back(); }catch(e){ histIgnore--; } }
}
window.addEventListener('popstate', function(){
  if(histIgnore > 0){ histIgnore--; return; }
  if(histGuard){ histGuard = false; handleBack(); syncBack(); }
});

/* ════════════════════════ Excel-экспорт (XLSX без библиотек) ════════════════════════ */
let CRC_TABLE = null;
function crcTable(){
  if(CRC_TABLE) return CRC_TABLE;
  const tb = new Array(256);
  for(let n=0;n<256;n++){ let c = n; for(let k=0;k<8;k++) c = (c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1); tb[n] = c >>> 0; }
  CRC_TABLE = tb; return tb;
}
function crc32(bytes){ const tb = crcTable(); let crc = 0xFFFFFFFF; for(let i=0;i<bytes.length;i++) crc = tb[(crc ^ bytes[i]) & 0xFF] ^ (crc >>> 8); return (crc ^ 0xFFFFFFFF) >>> 0; }
function strBytes(s){
  const out = []; s = String(s);
  for(let i=0;i<s.length;i++){
    let c = s.charCodeAt(i);
    if(c < 0x80) out.push(c);
    else if(c < 0x800) out.push(0xC0 | (c>>6), 0x80 | (c & 0x3F));
    else if(c >= 0xD800 && c <= 0xDBFF && i+1 < s.length){
      const c2 = s.charCodeAt(i+1); const cp = 0x10000 + ((c - 0xD800) << 10) + (c2 - 0xDC00);
      out.push(0xF0 | (cp>>18), 0x80 | ((cp>>12) & 0x3F), 0x80 | ((cp>>6) & 0x3F), 0x80 | (cp & 0x3F)); i++;
    } else out.push(0xE0 | (c>>12), 0x80 | ((c>>6) & 0x3F), 0x80 | (c & 0x3F));
  }
  return out;
}
function u16(v){ return [v & 0xFF, (v>>>8) & 0xFF]; }
function u32(v){ return [v & 0xFF, (v>>>8) & 0xFF, (v>>>16) & 0xFF, (v>>>24) & 0xFF]; }
function push(dst, src){ for(let i=0;i<src.length;i++) dst.push(src[i] & 0xFF); }
function zipStore(files){
  const parts = [], central = []; let offset = 0;
  files.forEach(function(f){
    const name = strBytes(f.name), crc = crc32(f.data), size = f.data.length;
    const lh = [];
    push(lh, u32(0x04034b50)); push(lh, u16(20)); push(lh, u16(0x0800)); push(lh, u16(0)); push(lh, u16(0)); push(lh, u16(0));
    push(lh, u32(crc)); push(lh, u32(size)); push(lh, u32(size)); push(lh, u16(name.length)); push(lh, u16(0)); push(lh, name);
    parts.push(lh); parts.push(f.data);
    const cd = [];
    push(cd, u32(0x02014b50)); push(cd, u16(20)); push(cd, u16(20)); push(cd, u16(0x0800)); push(cd, u16(0)); push(cd, u16(0)); push(cd, u16(0));
    push(cd, u32(crc)); push(cd, u32(size)); push(cd, u32(size)); push(cd, u16(name.length)); push(cd, u16(0)); push(cd, u16(0)); push(cd, u16(0)); push(cd, u16(0));
    push(cd, u32(0)); push(cd, u32(offset)); push(cd, name);
    central.push(cd); offset += lh.length + size;
  });
  const cdBytes = []; central.forEach(function(c){ push(cdBytes, c); });
  const eocd = [];
  push(eocd, u32(0x06054b50)); push(eocd, u16(0)); push(eocd, u16(0)); push(eocd, u16(files.length)); push(eocd, u16(files.length));
  push(eocd, u32(cdBytes.length)); push(eocd, u32(offset)); push(eocd, u16(0));
  const all = []; parts.forEach(function(p){ push(all, p); }); push(all, cdBytes); push(all, eocd);
  return new Uint8Array(all);
}
function xmlEsc(s){
  return String(s === undefined || s === null ? '' : s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/[\x00-\x08\x0B\x0C\x0E-\x1F]/g,'');
}
function colName(i){ let s = ''; i = i + 1; while(i > 0){ const r = (i - 1) % 26; s = String.fromCharCode(65 + r) + s; i = Math.floor((i - 1) / 26); } return s; }
function sheetXml(rows){
  let x = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetData>';
  rows.forEach(function(r, ri){
    x += '<row r="'+(ri+1)+'">';
    r.forEach(function(cell, c){
      const ref = colName(c) + (ri+1);
      if(typeof cell === 'number' && isFinite(cell)) x += '<c r="'+ref+'"><v>'+cell+'</v></c>';
      else x += '<c r="'+ref+'" t="inlineStr"><is><t xml:space="preserve">'+xmlEsc(cell)+'</t></is></c>';
    });
    x += '</row>';
  });
  return x + '</sheetData></worksheet>';
}
function safeSheetName(name, used){
  let s = String(name || 'Sheet').replace(/[:\\\/\?\*\[\]]/g,' ').replace(/\s+/g,' ').trim();
  if(!s) s = 'Sheet';
  s = s.slice(0,28);
  let n = s, i = 2;
  while(used[n]){ n = s.slice(0,26) + '_' + i; i++; }
  used[n] = true; return n;
}
function buildXlsx(sheets){
  const used = {}, names = sheets.map(function(s){ return safeSheetName(s.name, used); }), files = [];
  let ct = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types">'
    + '<Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/>'
    + '<Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>';
  let wbSheets = '', wbRels = '';
  sheets.forEach(function(s, i){
    const n = i + 1;
    ct += '<Override PartName="/xl/worksheets/sheet'+n+'.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>';
    wbSheets += '<sheet name="'+xmlEsc(names[i])+'" sheetId="'+n+'" r:id="rId'+n+'"/>';
    wbRels += '<Relationship Id="rId'+n+'" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet'+n+'.xml"/>';
    files.push({ name:'xl/worksheets/sheet'+n+'.xml', data:strBytes(sheetXml(s.rows)) });
  });
  ct += '</Types>';
  const rels = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>';
  const wb = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>'+wbSheets+'</sheets></workbook>';
  const wbRelsXml = '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">'+wbRels+'</Relationships>';
  return zipStore([
    { name:'[Content_Types].xml', data:strBytes(ct) }, { name:'_rels/.rels', data:strBytes(rels) },
    { name:'xl/workbook.xml', data:strBytes(wb) }, { name:'xl/_rels/workbook.xml.rels', data:strBytes(wbRelsXml) }
  ].concat(files));
}
function download(blob, filename){
  if(window.AndroidApp && typeof window.AndroidApp.saveFile === 'function'){
    try{
      const fr = new FileReader();
      fr.onload = function(){
        try{
          const s = String(fr.result || ''), i = s.indexOf(',');
          window.AndroidApp.saveFile(filename, blob.type || 'application/octet-stream', i >= 0 ? s.slice(i + 1) : '');
        }catch(e){ toast(t('Не удалось сохранить файл')); }
      };
      fr.onerror = function(){ toast(t('Не удалось сохранить файл')); };
      fr.readAsDataURL(blob);
      return;
    }catch(e){ }
  }
  try{
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.rel = 'noopener';
    document.body.appendChild(a); a.click();
    setTimeout(function(){ if(a.parentNode) a.parentNode.removeChild(a); URL.revokeObjectURL(url); }, 2000);
  }catch(e){ toast(t('Не удалось сохранить файл')); }
}
function fileNameSafe(s){ return String(s || 'shiftflow').replace(/[\\\/:*?"<>|]+/g,' ').replace(/\s+/g,' ').trim().slice(0,50) || 'shiftflow'; }
function csvEscape(v){ const s = String(v === undefined || v === null ? '' : v); return /[";\n]/.test(s) ? '"' + s.replace(/"/g,'""') + '"' : s; }
function csvFromRows(rows){ let out = '﻿'; rows.forEach(function(r){ out += r.map(csvEscape).join(';') + '\r\n'; }); return out; }
function wpRows(wpId, from, to){
  const w = wpById(wpId);
  const rows = [[ t('Дата'), t('Часов'), t('Оплата'), t('Место работы') ]];
  Object.keys(state.shifts).filter(function(k){ const s = state.shifts[k]; return s && !s.dayOff && s.workplaceId === wpId && inRange(k, from, to); })
    .sort().forEach(function(k){ const s = state.shifts[k]; rows.push([ k, (s.hours === undefined ? '' : s.hours), Math.round(calcPay(s) * 100) / 100, w ? w.name : '' ]); });
  return rows;
}
function allRows(from, to){
  const rows = [[ t('Дата'), t('Место работы'), t('Часов'), t('Оплата') ]];
  Object.keys(state.shifts).filter(function(k){ const s = state.shifts[k]; return s && !s.dayOff && s.workplaceId && inRange(k, from, to); })
    .sort().forEach(function(k){ const s = state.shifts[k], w = wpById(s.workplaceId); rows.push([ k, w ? w.name : '', (s.hours === undefined ? '' : s.hours), Math.round(calcPay(s) * 100) / 100 ]); });
  return rows;
}
function exportSheets(sheets, base){
  const name = fileNameSafe(base);
  try{
    download(new Blob([buildXlsx(sheets)], { type:'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' }), name + '.xlsx');
    toast(t('Файл готов'));
  }catch(e){
    try{ download(new Blob([csvFromRows(sheets[0].rows)], { type:'text/csv;charset=utf-8' }), name + '.csv'); toast(t('Сохранено в CSV')); }
    catch(e2){ toast(t('Не удалось сохранить файл')); }
  }
}

/* ════════════════════════ Действия ════════════════════════ */
function closeTop(){
  const kind = ui.picker ? 'picker' : (ui.confirm ? 'confirm' : (ui.sheet ? ui.sheet.type : null));
  if(!kind) return;
  if(kind === 'agreement' && ui.sheet.mode === 'first' && !ui.picker && !ui.confirm) return;
  if(ui.closing) return;
  const ovKind = ui.picker ? 'picker' : (ui.confirm ? 'confirm' : ({ agreement:'doc', privacy:'doc' }[kind] || kind));
  ui.closing = ovKind;
  render();
  setTimeout(function(){
    ui.closing = null;
    if(ui.picker) ui.picker = null;
    else if(ui.confirm) ui.confirm = null;
    else if(ui.returnToPattern && ui.sheet && ui.sheet.type === 'workplace'){ ui.returnToPattern = false; ui.sheet = { type:'pattern' }; }
    else ui.sheet = null;
    render();
  }, reduceMotion() ? 0 : 220);
}
function askConfirm(message, lbl, danger, action){
  ui.confirm = { title:t('Подтверди'), message:message, label:lbl, danger:!!danger, action:action };
  render();
}
function openSheet(obj){ ui.sheet = obj; render(); }
function viewedDay(){
  const now = new Date();
  if(ui.view.y === now.getFullYear() && ui.view.m === now.getMonth()) return todayKey();
  return dk(ui.view.y, ui.view.m, 1);
}
/* Если выбранный период не попадает в открытый месяц — показываем месяц его начала */
function showRangeMonth(from, to){
  const mr = monthRange(ui.view.y, ui.view.m);
  if(to < mr.from || from > mr.to){ const p = parseKey(from); ui.view = { y:p[0], m:p[1] }; }
}
function shiftMonth(delta){
  ui.view.m += delta;
  if(ui.view.m < 0){ ui.view.m = 11; ui.view.y--; }
  if(ui.view.m > 11){ ui.view.m = 0; ui.view.y++; }
  ui.selected = null; ui.slide = delta > 0 ? 'l' : 'r';
  render();
}
function setAccentVars(){ applyPrefs(); }

const A = {
  noop:function(){},
  tab:function(d){
    if(ui.tab === d.id){
      if(ui.page){ A.back(); return; }
      window.scrollTo({ top:0, behavior:reduceMotion() ? 'auto' : 'smooth' });
      return;
    }
    navigate('tab', function(){
      ui.tab = d.id; ui.page = null;
      ui.selected = ui.tab === 'calendar' ? ui.selected : null;
      ui.rangeMode = false; ui.rangeStart = null; ui.rangeEnd = null;
      ui.patternOpen = false; ui.editorPicker = false; ui.slide = ''; ui.chartSel = null;
    });
  },
  openPage:function(d){
    navigate('push', function(){
      ui.page = d.p;
      ui.snapshot = d.p === 'appearance' ? appearanceSnapshot() : null;
    });
  },
  back:function(){ if(!ui.page) return; navigate('pop', function(){ ui.page = null; ui.snapshot = null; }); },

  prevMonth:function(){ shiftMonth(-1); },
  nextMonth:function(){ shiftMonth(1); },
  goToday:function(){
    const now = new Date();
    const same = ui.view.y === now.getFullYear() && ui.view.m === now.getMonth();
    const delta = (now.getFullYear() - ui.view.y) * 12 + (now.getMonth() - ui.view.m);
    ui.view = { y:now.getFullYear(), m:now.getMonth() };
    if(ui.tab === 'calendar'){ ui.selected = todayKey(); ui.pendingPulse = true; }
    ui.slide = same ? '' : (delta > 0 ? 'l' : 'r');
    render();
  },
  prevYear:function(){ ui.statsYear--; ui.chartSel = null; render(); },
  nextYear:function(){ ui.statsYear++; ui.chartSel = null; render(); },
  toggleStats:function(){ ui.statsOpen = !ui.statsOpen; render(); },
  chartSel:function(d){ ui.chartSel = parseInt(d.m, 10); render(); },

  toggleRange:function(){
    ui.rangeMode = !ui.rangeMode;
    ui.patternOpen = false;
    if(ui.rangeMode){
      const mr = monthRange(ui.view.y, ui.view.m);
      ui.rangeStart = mr.from; ui.rangeEnd = mr.to;
    } else { ui.rangeStart = null; ui.rangeEnd = null; }
    render();
  },
  resetRange:function(){ ui.rangeStart = null; ui.rangeEnd = null; render(); },
  rangePreset:function(d){
    ui.rangeStart = d.f; ui.rangeEnd = d.t;
    showRangeMonth(d.f, d.t);
    haptic('tick'); render();
  },
  dayTap:function(d){
    const k = d.k;
    if(ui.rangeMode){
      if(!ui.rangeStart || ui.rangeEnd){ ui.rangeStart = k; ui.rangeEnd = null; }
      else { ui.rangeEnd = k; if(ui.rangeEnd < ui.rangeStart){ const tmp = ui.rangeStart; ui.rangeStart = ui.rangeEnd; ui.rangeEnd = tmp; } }
      haptic('tick'); render(); return;
    }
    ui.selected = (ui.selected === k) ? null : k;
    ui.editorPicker = false;
    render();
  },
  closeEditor:function(){ ui.selected = null; ui.editorPicker = false; render(); },
  pickWp:function(d){
    const k = ui.selected; if(!k) return;
    const prev = state.shifts[k] || {};
    const same = (prev.workplaceId === d.id);
    const wp = wpById(d.id);
    const defH = (wp && isFinite(parseFloat(wp.defaultHours))) ? parseFloat(wp.defaultHours) : undefined;
    state.shifts[k] = { workplaceId:d.id, hours:(same ? prev.hours : defH), adjust:(same ? prev.adjust : undefined), dayOff:false };
    ui.editorPicker = false;
    haptic('tick');
    saveState(); render();
  },
  pickOff:function(){
    const k = ui.selected; if(!k) return;
    const cur = state.shifts[k];
    if(cur && cur.dayOff) delete state.shifts[k];
    else state.shifts[k] = { dayOff:true };
    ui.editorPicker = false;
    saveState(); render();
  },
  reopenPicker:function(){ ui.editorPicker = true; render(); },
  clearDay:function(){
    const k = ui.selected; if(!k) return;
    askConfirm(t('Очистить день?') + ' ' + fmtDate(k), t('Очистить'), true, function(){
      delete state.shifts[k];
      ui.editorPicker = false;
      saveState(); render(); toast(t('День очищен'));
    });
  },

  togglePattern:function(){ A.openPattern(); },
  openPattern:function(){
    const p = ui.pattern;
    const now = new Date();
    const curMonth = ui.view.y === now.getFullYear() && ui.view.m === now.getMonth();
    p.start = ui.selected || (curMonth ? todayKey() : dk(ui.view.y, ui.view.m, 1));
    p.end = patternEndFor('month');
    if(!wpById(p.workplaceId)) p.workplaceId = state.workplaces.length ? state.workplaces[0].id : null;
    const w = wpById(p.workplaceId);
    if(w && !p.hoursTouched) p.hours = w.defaultHours;
    ui.rangeMode = false; ui.rangeStart = null; ui.rangeEnd = null;
    openSheet({ type:'pattern' });
  },
  patWp:function(d){
    ui.pattern.workplaceId = d.id;
    const w = wpById(d.id);
    if(w && !ui.pattern.hoursTouched) ui.pattern.hours = w.defaultHours;
    render();
  },
  patMode:function(d){ ui.pattern.mode = d.v; render(); },
  patPreset:function(d){ ui.pattern.workDays = parseInt(d.w, 10); ui.pattern.offDays = parseInt(d.o, 10); haptic('tick'); render(); },
  patWeekday:function(d){ const i = parseInt(d.i, 10); ui.pattern.weekdays[i] = ui.pattern.weekdays[i] ? 0 : 1; haptic('tick'); render(); },
  patWeekPreset:function(d){ ui.pattern.weekdays = String(d.v).split('').map(Number); render(); },
  patStep:function(d){
    const f = d.f, lim = { workDays:[1, 14, 1], offDays:[0, 14, 1], hours:[0, 24, .5] }[f];
    if(!lim) return;
    let v = (parseFloat(ui.pattern[f]) || 0) + lim[2] * (parseFloat(d.d) > 0 ? 1 : -1);
    v = Math.max(lim[0], Math.min(lim[1], Math.round(v * 2) / 2));
    ui.pattern[f] = v;
    if(f === 'hours') ui.pattern.hoursTouched = true;
    haptic('tick'); render();
  },
  patEnd:function(d){ ui.pattern.end = patternEndFor(d.v); render(); },
  patReplace:function(){ ui.pattern.replace = !ui.pattern.replace; haptic('tick'); render(); },
  applyPattern:function(){
    const p = ui.pattern;
    if(!state.workplaces.length){ toast(t('Сначала добавь место работы')); A.addWorkplace(); return; }
    if(!wpById(p.workplaceId)){ toast(t('Выбери место работы')); return; }
    if(p.mode === 'week' && !p.weekdays.some(Boolean)){ toast(t('Выбери хотя бы один рабочий день')); return; }
    const days = patternDays(p);
    if(!days.length) return;
    const hours = Math.max(0, parseFloat(p.hours) || 0);
    const undo = {};
    let changed = 0;
    days.forEach(function(x){
      if(!p.replace && state.shifts[x.k]) return;
      undo[x.k] = state.shifts[x.k] ? JSON.parse(JSON.stringify(state.shifts[x.k])) : null;
      state.shifts[x.k] = x.work ? { workplaceId:p.workplaceId, hours:hours, dayOff:false } : { dayOff:true };
      changed++;
    });
    const s0 = parseKey(days[0].k);
    ui.view = { y:s0[0], m:s0[1] };
    ui.selected = null; ui.slide = '';
    haptic('heavy');
    saveState();
    closeTop();
    if(!changed){ toast(t('Все дни уже отмечены — ничего не изменилось')); return; }
    toast(t('Шаблон применён') + ': ' + cnt(changed, 'day'), { label:t('Отменить'), fn:function(){
      Object.keys(undo).forEach(function(k){ if(undo[k]) state.shifts[k] = undo[k]; else delete state.shifts[k]; });
      saveState(); render(); toast(t('Отменено'));
    } });
  },

  openPicker:function(d){
    const cur = pickerValue(d.t) || todayKey();
    const p = parseKey(cur);
    ui.picker = { target:d.t, y:p[0], m:p[1] };
    render();
  },
  pickerNav:function(d){
    if(!ui.picker) return;
    ui.picker.m += parseInt(d.d,10);
    if(ui.picker.m < 0){ ui.picker.m = 11; ui.picker.y--; }
    if(ui.picker.m > 11){ ui.picker.m = 0; ui.picker.y++; }
    render();
  },
  pickerPick:function(d){ if(!ui.picker) return; setPickerValue(ui.picker.target, d.k); closeTop(); },
  pickerClose:function(){ closeTop(); },

  addWorkplace:function(){
    if(state.workplaces.length >= 10){ toast(t('Достигнут лимит — 10 мест работы')); return; }
    if(ui.sheet && ui.sheet.type === 'pattern') ui.returnToPattern = true;
    const used = {};
    state.workplaces.forEach(function(w){ used[w.color] = true; });
    let color = SWATCHES[state.workplaces.length % SWATCHES.length];
    for(const c of SWATCHES){ if(!used[c]){ color = c; break; } }
    openSheet({ type:'workplace', index:null, name:'', short:'', payType:'hourly', rate:'', currency:defaultCurrency(), defaultHours:8, color:color });
  },
  editWorkplace:function(d){
    const w = state.workplaces[parseInt(d.i,10)];
    if(!w) return;
    openSheet({ type:'workplace', index:parseInt(d.i,10), name:w.name, short:w.short || '', payType:w.payType, rate:String(w.rate), currency:w.currency, defaultHours:w.defaultHours, color:w.color });
  },
  sheetPayType:function(d){ if(ui.sheet) ui.sheet.payType = d.v; render(); },
  sheetColor:function(d){ if(ui.sheet) ui.sheet.color = d.v; render(); },
  sheetWp:function(d){ if(ui.sheet){ ui.sheet.workplaceId = d.id; render(); } },
  saveWorkplace:function(){
    const s = ui.sheet; if(!s || s.type !== 'workplace') return;
    const name = String(s.name || '').trim();
    if(!name){ toast(t('Название не может быть пустым')); const el = document.getElementById('wpName'); if(el) el.focus(); return; }
    const data = {
      name:name.slice(0,60), short:String(s.short || '').trim().slice(0,10), payType:(s.payType === 'daily' ? 'daily' : 'hourly'),
      rate:Math.max(0, parseFloat(s.rate) || 0), currency:String(s.currency || '₽').slice(0,4) || '₽',
      defaultHours:Math.max(0, parseFloat(s.defaultHours) || 0), color:s.color
    };
    if(s.index === null || s.index === undefined){
      if(state.workplaces.length >= 10){ toast(t('Достигнут лимит — 10 мест работы')); return; }
      const w = Object.assign(makeWorkplace(), data);
      state.workplaces.push(w);
      if(!wpById(ui.pattern.workplaceId)) ui.pattern.workplaceId = w.id;
    } else {
      const w = state.workplaces[s.index];
      if(!w) return;
      Object.assign(w, data);
    }
    normalize(); saveState();
    if(ui.returnToPattern){
      ui.returnToPattern = false;
      const nw = state.workplaces[state.workplaces.length - 1];
      if(s.index === null || s.index === undefined){ ui.pattern.workplaceId = nw.id; if(!ui.pattern.hoursTouched) ui.pattern.hours = nw.defaultHours; }
      ui.sheet = { type:'pattern' }; render(); toast(t('Готово')); return;
    }
    closeTop(); toast(t('Готово'));
  },
  deleteWorkplace:function(){
    const s = ui.sheet; if(!s || s.index === null || s.index === undefined) return;
    const w = state.workplaces[s.index];
    if(!w) return;
    ui.sheet = null;
    askConfirm(LANG === 'en'
        ? 'Delete “' + w.name + '”? All its shifts and extra income will be removed too.'
        : 'Удалить «' + w.name + '»? Все смены и внесения по этому месту работы тоже будут удалены.',
      t('Удалить'), true, function(){
        Object.keys(state.shifts).forEach(function(k){ if(state.shifts[k] && state.shifts[k].workplaceId === w.id) delete state.shifts[k]; });
        state.incomes = state.incomes.filter(function(x){ return x.workplaceId !== w.id; });
        state.payments = state.payments.map(function(p){ return p.workplaceId === w.id ? Object.assign({}, p, { workplaceId:'' }) : p; });
        state.workplaces = state.workplaces.filter(function(x){ return x.id !== w.id; });
        if(ui.pattern.workplaceId === w.id) ui.pattern.workplaceId = state.workplaces[0] ? state.workplaces[0].id : null;
        normalize(); saveState(); render(); toast(t('Готово'));
      });
  },
  clearWorkplaces:function(){
    askConfirm(LANG === 'en'
        ? 'Delete all workplaces together with every shift, extra income and payment? This cannot be undone.'
        : 'Удалить все места работы вместе со всеми сменами, внесениями и выплатами? Действие нельзя отменить.',
      t('Удалить всё'), true, function(){
        state.workplaces = []; state.shifts = {}; state.notes = {}; state.incomes = []; state.payments = [];
        ui.pattern.workplaceId = null; ui.selected = null; ui.patternOpen = false;
        ui.rangeMode = false; ui.rangeStart = null; ui.rangeEnd = null;
        normalize(); saveState(); render(); toast(t('Очищено'));
      });
  },

  addIncomeToday:function(){ A.openIncome({ k:viewedDay() }); },
  openIncome:function(d){ openSheet({ type:'income', date:(d && d.k) || viewedDay(), amount:'', workplaceId:'', note:'' }); },
  saveIncome:function(){
    const s = ui.sheet; if(!s || s.type !== 'income') return;
    const amount = parseFloat(s.amount);
    if(!isFinite(amount) || amount <= 0){ toast(t('Введи сумму больше нуля')); return; }
    state.incomes.push({ id:newId('i'), date:s.date || todayKey(), amount:amount, workplaceId:s.workplaceId || '', note:String(s.note || '').slice(0,80) });
    saveState(); closeTop(); toast(t('Внесение добавлено'));
  },
  delIncome:function(d){
    askConfirm(t('Удалить запись?'), t('Удалить'), true, function(){
      state.incomes = state.incomes.filter(function(x){ return x.id !== d.id; }); saveState(); render();
    });
  },
  openPayment:function(d){ openSheet({ type:'payment', from:d.from || todayKey(), to:d.to || todayKey(), amount:'', workplaceId:'', note:'' }); },
  savePayment:function(){
    const s = ui.sheet; if(!s || s.type !== 'payment') return;
    const amount = parseFloat(s.amount);
    if(!isFinite(amount) || amount <= 0){ toast(t('Введи сумму больше нуля')); return; }
    state.payments.push({ id:newId('p'), periodFrom:s.from || todayKey(), periodTo:s.to || s.from || todayKey(), workplaceId:s.workplaceId || '', amount:amount, note:String(s.note || '').slice(0,80) });
    saveState(); closeTop(); toast(t('Выплата записана'));
  },
  delPayment:function(d){
    askConfirm(t('Удалить запись?'), t('Удалить'), true, function(){
      state.payments = state.payments.filter(function(p){ return p.id !== d.id; }); saveState(); render();
    });
  },

  clearMonth:function(){
    const y = ui.view.y, m = ui.view.m;
    askConfirm(t('Очистить все смены и заметки месяца?') + ' ' + monthTitle(m) + ' ' + y, t('Очистить'), true, function(){
      const prefix = y + '-' + pad2(m+1) + '-';
      Object.keys(state.shifts).forEach(function(k){ if(k.indexOf(prefix) === 0) delete state.shifts[k]; });
      Object.keys(state.notes || {}).forEach(function(k){ if(k.indexOf(prefix) === 0) delete state.notes[k]; });
      ui.selected = null;
      saveState(); render();
    });
  },
  exportWp:function(d){
    const w = wpById(d.id); if(!w) return;
    exportSheets([{ name:w.name, rows:wpRows(w.id, ui.export.from, ui.export.to) }], w.name + ' ' + ui.export.from + ' ' + ui.export.to);
  },
  exportAll:function(){
    const sheets = [{ name:t('Все'), rows:allRows(ui.export.from, ui.export.to) }];
    state.workplaces.forEach(function(w){ sheets.push({ name:w.name, rows:wpRows(w.id, ui.export.from, ui.export.to) }); });
    exportSheets(sheets, BRAND + ' ' + ui.export.from + ' ' + ui.export.to);
  },
  backupExport:function(){
    try{
      const payload = { app:'shiftflow', version:CURRENT_VERSION, exportedAt:new Date().toISOString(), workplaces:state.workplaces, shifts:state.shifts, notes:state.notes, incomes:state.incomes, payments:state.payments };
      download(new Blob([JSON.stringify(payload, null, 2)], { type:'application/json' }), 'shiftflow-backup-' + todayKey() + '.json');
      toast(t('Резервная копия готова'));
    }catch(e){ toast(t('Не удалось сохранить файл')); }
  },
  backupImport:function(){ const el = document.getElementById('backupFile'); if(el) el.click(); },

  toggleDark:function(){
    prefs.theme = isLight() ? 'dark' : 'light';
    savePrefs(); applyPrefs(); haptic('tick'); render();
  },
  setTheme:function(d){ prefs.theme = d.v; savePrefs(); applyPrefs(); render(); },
  setAccent:function(d){ prefs.accent = d.v; savePrefs(); applyPrefs(); haptic('tick'); render(); },
  setTextSize:function(d){ prefs.textSize = d.v; savePrefs(); applyPrefs(); render(); TabBar.sync(); },
  setUiStyle:function(d){ prefs.uiStyle = d.v; savePrefs(); applyPrefs(); render(); },
  setBg:function(d){ prefs.bg = d.v; savePrefs(); applyPrefs(); haptic('tick'); render(); },
  setDayTint:function(d){ prefs.dayTint = d.v; savePrefs(); applyPrefs(); render(); },
  setDayLabel:function(d){ prefs.dayLabel = d.v; savePrefs(); applyPrefs(); render(); },
  useCustom:function(){ prefs.accent = hslHex(prefs.customHue); savePrefs(); applyPrefs(); haptic('tick'); render(); },
  discardAppearance:function(){
    const s = ui.snapshot; if(!s) return;
    LOOK_KEYS.forEach(function(k){ prefs[k] = s[k]; });
    savePrefs(); applyPrefs(); render();
  },
  commitAppearance:function(){ ui.snapshot = appearanceSnapshot(); toast(t('Сохранено')); A.back(); },
  setLang:function(d){
    if(LANG === d.v) return;
    prefs.lang = d.v; LANG = d.v; savePrefs(); applyPrefs();
    render(); toast(t('Язык изменён'));
  },

  openAgreement:function(){ openSheet({ type:'agreement', mode:'view' }); },
  openPrivacy:function(){ openSheet({ type:'privacy' }); },
  toggleLegalText:function(){ ui.legalOpen = !ui.legalOpen; render(); },
  toggleLegal:function(){ ui.legalChecked = !ui.legalChecked; haptic('tick'); render(); },
  acceptAgreement:function(){
    if(!ui.legalChecked){
      toast(t('Отметь согласие, чтобы продолжить'));
      const box = document.querySelector('.checks');
      if(box && box.animate) box.animate([{ transform:'translateX(0)' },{ transform:'translateX(-8px)' },{ transform:'translateX(8px)' },{ transform:'translateX(-4px)' },{ transform:'none' }], { duration:380 });
      return;
    }
    prefs.agreement = { version:AGREEMENT_VERSION, at:new Date().toISOString() };
    savePrefs();
    ui.sheet.mode = 'view';
    closeTop();
  },

  ovlClose:function(d, el, e){ if(e && e.target !== el) return; closeTop(); },
  ovlCloseBtn:function(){ closeTop(); },
  confirmYes:function(){
    const c = ui.confirm;
    ui.confirm = null;
    if(c && c.action) c.action(); else render();
  },
  confirmNo:function(){ closeTop(); }
};

const INP = {
  hours:function(v){
    const k = ui.selected; if(!k) return;
    const s = state.shifts[k]; if(!s) return;
    s.hours = (v === '') ? undefined : Math.max(0, parseFloat(v) || 0);
    saveSoon(); refreshLive(k);
  },
  dayAdjust:function(v){
    const k = ui.selected; if(!k) return;
    const s = state.shifts[k]; if(!s) return;
    const n = parseFloat(v);
    s.adjust = (v === '' || !isFinite(n) || n === 0) ? undefined : n;
    saveSoon(); refreshLive(k);
  },
  dayNote:function(v){
    const k = ui.selected; if(!k) return;
    const txt = String(v || '').trim();
    if(!state.notes) state.notes = {};
    if(txt) state.notes[k] = txt.slice(0,140); else delete state.notes[k];
    saveSoon();
    clearTimeout(INP._nt); INP._nt = setTimeout(render, 400);
  },
  wpName:function(v){ if(ui.sheet && ui.sheet.type === 'workplace') ui.sheet.name = v; },
  wpShort:function(v){ if(ui.sheet && ui.sheet.type === 'workplace') ui.sheet.short = v; },
  patField:function(v, d){
    if(!d || !d.f) return;
    ui.pattern[d.f] = v;
    if(d.f === 'hours') ui.pattern.hoursTouched = true;
    clearTimeout(INP._pt); INP._pt = setTimeout(render, 350);
  },
  hue:function(v){
    prefs.customHue = Math.max(0, Math.min(359, parseInt(v, 10) || 0));
    prefs.accent = hslHex(prefs.customHue);
    applyPrefs();
    clearTimeout(INP._ht); INP._ht = setTimeout(function(){ savePrefs(); render(); }, 120);
  },
  wpRate:function(v){ if(ui.sheet && ui.sheet.type === 'workplace') ui.sheet.rate = v; },
  wpCur:function(v){ if(ui.sheet && ui.sheet.type === 'workplace') ui.sheet.currency = v; },
  wpDefHours:function(v){ if(ui.sheet && ui.sheet.type === 'workplace') ui.sheet.defaultHours = v; },
  incAmount:function(v){ if(ui.sheet && ui.sheet.type === 'income') ui.sheet.amount = v; },
  incNote:function(v){ if(ui.sheet && ui.sheet.type === 'income') ui.sheet.note = v; },
  payAmount:function(v){ if(ui.sheet && ui.sheet.type === 'payment') ui.sheet.amount = v; },
  payNote:function(v){ if(ui.sheet && ui.sheet.type === 'payment') ui.sheet.note = v; }
};
/* Пока вводятся часы — обновляем превью сразу, а календарь и итоги чуть позже (без потери фокуса) */
function refreshLive(k){
  const pv = document.getElementById('payPreview');
  if(pv) pv.innerHTML = payPreviewHtml(k);
  clearTimeout(refreshLive.t);
  refreshLive.t = setTimeout(render, 350);
}

function handleBackupFile(file){
  if(!file) return;
  const reader = new FileReader();
  reader.onload = function(e){
    const buf = e.target.result;
    const head = new Uint8Array(buf, 0, Math.min(4, buf.byteLength));
    if(head[0] === 0x50 && head[1] === 0x4B){ importExcel(buf); return; }   /* .xlsx — это zip-архив */
    let parsed = null;
    try{ parsed = JSON.parse(new TextDecoder('utf-8').decode(buf).replace(/^﻿/, '')); }
    catch(err){ toast(t('Файл не похож на резервную копию')); return; }
    if(!parsed || (!parsed.workplaces && !parsed.shifts)){ toast(t('Файл не похож на резервную копию')); return; }
    askConfirm(t('Восстановить данные из файла? Текущие данные будут заменены.'), t('Восстановить'), true, function(){
      const m = migrate(parsed);
      state.workplaces = Array.isArray(m.workplaces) ? m.workplaces : state.workplaces;
      state.shifts = (m.shifts && typeof m.shifts === 'object') ? m.shifts : {};
      state.notes = (m.notes && typeof m.notes === 'object') ? m.notes : {};
      state.incomes = Array.isArray(m.incomes) ? m.incomes : [];
      state.payments = Array.isArray(m.payments) ? m.payments : [];
      normalize(); saveState(); goHomeAfterImport(); toast(t('Восстановлено'));
    });
  };
  reader.onerror = function(){ toast(t('Файл не похож на резервную копию')); };
  reader.readAsArrayBuffer(file);
}
/* После восстановления показываем календарь с месяцем последней смены (или текущим) */
function goHomeAfterImport(){
  const keys = Object.keys(state.shifts).sort();
  const last = keys.length ? parseKey(keys[keys.length - 1]) : null;
  const now = new Date();
  navigate('tab', function(){
    ui.view = last && (last[0] < now.getFullYear() || (last[0] === now.getFullYear() && last[1] < now.getMonth())) ? { y:last[0], m:last[1] } : { y:now.getFullYear(), m:now.getMonth() };
    ui.statsYear = ui.view.y;
    ui.tab = 'calendar'; ui.page = null; ui.snapshot = null;
    ui.selected = null; ui.rangeMode = false; ui.rangeStart = null; ui.rangeEnd = null;
  });
}

/* ════════════════════════ Импорт из Excel (выгрузка «Скачать всё» прошлых версий) ════════════════════════
   Читает .xlsx без библиотек: разбирает zip, при необходимости распаковывает (DecompressionStream),
   берёт листы с колонками «Дата / Место работы / Часов / Оплата». Из сумм восстанавливаются ставки,
   а разница с расчётом по ставке сохраняется как корректировка — итоги совпадают до копейки. */
async function readXlsx(buf){
  const u8 = new Uint8Array(buf);
  const dv = new DataView(buf);
  let eocd = -1;
  for(let i = u8.length - 22; i >= Math.max(0, u8.length - 65557); i--){
    if(dv.getUint32(i, true) === 0x06054b50){ eocd = i; break; }
  }
  if(eocd < 0) throw new Error('not a zip');
  const count = dv.getUint16(eocd + 10, true);
  let p = dv.getUint32(eocd + 16, true);
  const dec = new TextDecoder('utf-8');
  const files = {};
  for(let i = 0; i < count; i++){
    if(dv.getUint32(p, true) !== 0x02014b50) break;
    const method = dv.getUint16(p + 10, true), size = dv.getUint32(p + 20, true);
    const nlen = dv.getUint16(p + 28, true), xlen = dv.getUint16(p + 30, true), clen = dv.getUint16(p + 32, true);
    const lho = dv.getUint32(p + 42, true);
    const name = dec.decode(u8.subarray(p + 46, p + 46 + nlen));
    const start = lho + 30 + dv.getUint16(lho + 26, true) + dv.getUint16(lho + 28, true);
    files[name.replace(/^\//, '')] = { method:method, data:u8.subarray(start, start + size) };
    p += 46 + nlen + xlen + clen;
  }
  const text = async function(name){
    const f = files[name];
    if(!f) return null;
    if(f.method === 0) return dec.decode(f.data);
    if(f.method !== 8 || typeof DecompressionStream === 'undefined') throw new Error('unsupported compression');
    const out = await new Response(new Blob([f.data]).stream().pipeThrough(new DecompressionStream('deflate-raw'))).arrayBuffer();
    return dec.decode(out);
  };
  const xml = function(str){ return str ? new DOMParser().parseFromString(str, 'application/xml') : null; };
  const shared = [];
  const ss = xml(await text('xl/sharedStrings.xml'));
  if(ss) Array.prototype.forEach.call(ss.getElementsByTagName('si'), function(si){
    shared.push(Array.prototype.map.call(si.getElementsByTagName('t'), function(x){ return x.textContent; }).join(''));
  });
  const wb = xml(await text('xl/workbook.xml'));
  const rels = xml(await text('xl/_rels/workbook.xml.rels'));
  const target = {};
  if(rels) Array.prototype.forEach.call(rels.getElementsByTagName('Relationship'), function(r){ target[r.getAttribute('Id')] = r.getAttribute('Target'); });
  const sheets = [];
  const list = wb ? wb.getElementsByTagName('sheet') : [];
  for(let i = 0; i < list.length; i++){
    let path = target[list[i].getAttribute('r:id')] || ('worksheets/sheet' + (i + 1) + '.xml');
    path = path.charAt(0) === '/' ? path.slice(1) : 'xl/' + path.replace(/^\.\//, '');
    const doc = xml(await text(path));
    if(!doc) continue;
    const rows = [];
    Array.prototype.forEach.call(doc.getElementsByTagName('row'), function(rw){
      const row = [];
      Array.prototype.forEach.call(rw.getElementsByTagName('c'), function(c, ci){
        const ref = c.getAttribute('r') || '';
        let col = ci;
        const m = /^([A-Z]+)/.exec(ref);
        if(m){ col = 0; for(const ch of m[1]) col = col * 26 + (ch.charCodeAt(0) - 64); col--; }
        const tp = c.getAttribute('t');
        const v = c.getElementsByTagName('v')[0];
        let val;
        if(tp === 's') val = shared[parseInt(v ? v.textContent : '0', 10)] || '';
        else if(tp === 'inlineStr') val = Array.prototype.map.call(c.getElementsByTagName('t'), function(x){ return x.textContent; }).join('');
        else if(tp === 'str' || tp === 'b' || tp === 'e') val = v ? v.textContent : '';
        else val = v ? parseFloat(v.textContent) : '';
        row[col] = val;
      });
      rows.push(row);
    });
    sheets.push({ name:list[i].getAttribute('name') || '', rows:rows });
  }
  return sheets;
}
function excelDateKey(v){
  if(typeof v === 'number' && isFinite(v) && v > 20000 && v < 80000){
    const d = new Date(Date.UTC(1899, 11, 30) + Math.round(v) * 864e5);
    return dk(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  const sv = String(v || '').trim();
  let m = /^(\d{4})-(\d{1,2})-(\d{1,2})/.exec(sv);
  if(m) return dk(+m[1], +m[2] - 1, +m[3]);
  m = /^(\d{1,2})[.\/](\d{1,2})[.\/](\d{4})$/.exec(sv);
  if(m) return dk(+m[3], +m[2] - 1, +m[1]);
  return null;
}
function parseExcelShifts(sheets){
  const norm = function(x){ return String(x === undefined || x === null ? '' : x).trim().toLowerCase(); };
  const find = function(head, names){ for(let i = 0; i < head.length; i++){ if(names.indexOf(norm(head[i])) >= 0) return i; } return -1; };
  const byDate = {};
  sheets.forEach(function(sh){
    const head = sh.rows[0] || [];
    const cDate = find(head, ['дата', 'date']);
    const cWp = find(head, ['место работы', 'workplace']);
    const cHours = find(head, ['часов', 'hours', 'часы']);
    const cPay = find(head, ['оплата', 'pay', 'сумма']);
    if(cDate < 0 || cPay < 0) return;
    for(let r = 1; r < sh.rows.length; r++){
      const row = sh.rows[r] || [];
      const k = excelDateKey(row[cDate]);
      if(!k) continue;
      const wp = String((cWp >= 0 ? row[cWp] : '') || sh.name || t('Место работы')).trim().slice(0, 60);
      const hRaw = cHours >= 0 ? row[cHours] : '';
      const hours = (hRaw === '' || hRaw === undefined || isNaN(parseFloat(hRaw))) ? undefined : Math.max(0, parseFloat(hRaw));
      const pay = parseFloat(String(row[cPay]).replace(',', '.').replace(/[^\d.\-]/g, '')) || 0;
      byDate[k] = { date:k, wp:wp, hours:hours, pay:pay };
    }
  });
  return Object.keys(byDate).sort().map(function(k){ return byDate[k]; });
}
function mode(arr){
  const c = {}; let best = null, n = 0;
  arr.forEach(function(x){ c[x] = (c[x] || 0) + 1; if(c[x] > n){ n = c[x]; best = x; } });
  return best;
}
function buildFromExcel(recs){
  const groups = {}, order = [];
  recs.forEach(function(r){ if(!groups[r.wp]){ groups[r.wp] = []; order.push(r.wp); } groups[r.wp].push(r); });
  const cur = defaultCurrency();
  const wps = [], shifts = {};
  order.slice(0, 10).forEach(function(name, i){
    const g = groups[name];
    const withH = g.filter(function(r){ return r.hours > 0; });
    const ratio = withH.map(function(r){ return Math.round(r.pay / r.hours * 100) / 100; });
    const rRate = ratio.length ? mode(ratio) : null;
    const rShare = ratio.length ? ratio.filter(function(x){ return x === rRate; }).length / g.length : 0;
    const dRate = mode(g.map(function(r){ return Math.round(r.pay * 100) / 100; }));
    const dShare = g.filter(function(r){ return Math.round(r.pay * 100) / 100 === dRate; }).length / g.length;
    /* При равной «точности» выбираем круглую ставку: 3200 за смену вместо 266,67 в час */
    const isInt = function(x){ return x !== null && Math.abs(x - Math.round(x)) < 0.005; };
    let hourly;
    if(rRate === null) hourly = false;
    else if(Math.abs(rShare - dShare) > 0.05) hourly = rShare > dShare;
    else if(isInt(rRate) !== isInt(dRate)) hourly = isInt(rRate);
    else hourly = true;
    const hoursMode = mode(withH.map(function(r){ return r.hours; }));
    const w = makeWorkplace({ name:name, color:SWATCHES[i % SWATCHES.length], payType:hourly ? 'hourly' : 'daily',
                              rate:hourly ? rRate : dRate, currency:cur, defaultHours:hoursMode !== null ? hoursMode : 8 });
    wps.push(w);
    g.forEach(function(r){
      const base = hourly ? (r.hours || 0) * w.rate : w.rate;
      const adj = Math.round((r.pay - base) * 100) / 100;
      shifts[r.date] = { workplaceId:w.id, hours:r.hours, adjust:adj ? adj : undefined, dayOff:false };
    });
  });
  return { workplaces:wps, shifts:shifts };
}
async function importExcel(buf){
  let recs;
  try{ recs = parseExcelShifts(await readXlsx(buf)); }
  catch(e){ toast(t('Не получилось прочитать Excel-файл')); return; }
  if(!recs.length){ toast(t('В файле не нашлось смен')); return; }
  const built = buildFromExcel(recs);
  const total = recs.reduce(function(a, r){ return a + r.pay; }, 0);
  const msg = (LANG === 'en'
      ? 'Found ' + cnt(recs.length, 'shift') + ' (' + fmtDate(recs[0].date) + ' — ' + fmtDate(recs[recs.length - 1].date) + '), ' + cnt(built.workplaces.length, 'place') + ', ' + money(total, defaultCurrency()) + '. Days off and notes are not stored in Excel. Current data will be replaced.'
      : 'Найдено: ' + cnt(recs.length, 'shift') + ' (' + fmtDate(recs[0].date) + ' — ' + fmtDate(recs[recs.length - 1].date) + '), ' + cnt(built.workplaces.length, 'place') + ', ' + money(total, defaultCurrency()) + '. Выходные и заметки в Excel не сохраняются. Текущие данные будут заменены.');
  ui.confirm = { title:t('Импорт из Excel'), message:msg, label:t('Импортировать'), danger:false, action:function(){
    state.workplaces = built.workplaces;
    state.shifts = built.shifts;
    state.notes = {}; state.incomes = []; state.payments = [];
    ui.pattern.workplaceId = built.workplaces[0] ? built.workplaces[0].id : null;
    normalize(); saveState(); goHomeAfterImport();
    toast(t('Импортировано') + ': ' + cnt(recs.length, 'shift'));
  } };
  render();
}

/* ════════════════════════ События ════════════════════════ */
document.addEventListener('click', function(e){
  const el = e.target && e.target.closest ? e.target.closest('[data-act]') : null;
  if(!el) return;
  const fn = A[el.getAttribute('data-act')];
  if(!fn) return;
  e.preventDefault();
  if(el.getAttribute('data-act') !== 'ovlClose') haptic('tap');
  try{ fn(el.dataset || {}, el, e); }
  catch(err){ if(window.console) console.error('action ' + el.getAttribute('data-act'), err); }
}, false);
document.addEventListener('keydown', function(e){
  if(e.key === 'Escape'){ closeTop(); return; }
  if((e.key === 'Enter' || e.key === ' ') && e.target && e.target.getAttribute && e.target.getAttribute('role') === 'button' && e.target.hasAttribute('data-act')){
    e.preventDefault(); e.target.click();
  }
}, false);
document.addEventListener('input', function(e){
  const el = e.target && e.target.closest ? e.target.closest('[data-inp]') : null;
  if(!el) return;
  const fn = INP[el.getAttribute('data-inp')];
  if(fn){ try{ fn(el.value, el.dataset || {}); }catch(err){ if(window.console) console.error(err); } }
}, false);
document.addEventListener('change', function(e){
  const el = e.target;
  if(el && el.id === 'backupFile'){ handleBackupFile(el.files && el.files[0]); el.value = ''; }
}, false);

/* Пока открыта клавиатура, панель навигации прячется и не закрывает поле ввода */
document.addEventListener('focusin', function(e){
  const tg = e.target;
  if(tg && (tg.tagName === 'INPUT' || tg.tagName === 'TEXTAREA')){ clearTimeout(document.__typingT); document.documentElement.classList.add('typing'); }
});
document.addEventListener('focusout', function(){
  clearTimeout(document.__typingT);
  document.__typingT = setTimeout(function(){
    const a = document.activeElement;
    if(!a || (a.tagName !== 'INPUT' && a.tagName !== 'TEXTAREA')) document.documentElement.classList.remove('typing');
  }, 120);
});

/* Свайп по календарю — смена месяца */
(function(){
  let sx = null, sy = 0;
  document.addEventListener('touchstart', function(e){
    const cal = e.target && e.target.closest ? e.target.closest('.cal') : null;
    if(!cal || e.touches.length !== 1){ sx = null; return; }
    sx = e.touches[0].clientX; sy = e.touches[0].clientY;
  }, { passive:true });
  document.addEventListener('touchend', function(e){
    if(sx === null) return;
    const dx = e.changedTouches[0].clientX - sx, dy = e.changedTouches[0].clientY - sy;
    sx = null;
    if(Math.abs(dx) > 56 && Math.abs(dx) > Math.abs(dy) * 1.4){ haptic('tick'); shiftMonth(dx < 0 ? 1 : -1); }
  }, { passive:true });
})();

/* Смахивание листа вниз — закрыть */
(function(){
  let startY = null, sheetEl = null, dy = 0;
  document.addEventListener('touchstart', function(e){
    const tg = e.target;
    const sheet = (tg && tg.closest) ? tg.closest('.sheet') : null;
    if(!sheet || sheet.closest('.overlay.center')) return;
    if(tg.closest('button, input, textarea, .chip, .swatch, .picker, .link, .row, .checks, .day')) return;
    const ov = sheet.closest('.overlay');
    if(ov && ov.scrollTop > 0) return;
    const r = sheet.getBoundingClientRect();
    const y = e.touches[0].clientY;
    if(y > r.top + Math.min(90, r.height * 0.35)) return;
    sheetEl = sheet; startY = y; dy = 0;
    sheet.style.transition = 'none';
  }, { passive:true });
  document.addEventListener('touchmove', function(e){
    if(startY === null || !sheetEl) return;
    dy = e.touches[0].clientY - startY;
    sheetEl.style.transform = 'translateY(' + Math.max(0, dy < 0 ? dy * .15 : dy) + 'px)';
  }, { passive:true });
  document.addEventListener('touchend', function(){
    if(startY !== null && sheetEl){
      const el = sheetEl;
      el.style.transition = 'transform .3s cubic-bezier(.16,1,.3,1)';
      if(dy > 90){ el.style.transform = 'translateY(110%)'; setTimeout(function(){ closeTop(); }, 120); }
      else el.style.transform = '';
    }
    startY = null; sheetEl = null; dy = 0;
  }, { passive:true });
})();

window.addEventListener('pagehide', saveState);
document.addEventListener('visibilitychange', function(){ if(document.visibilityState === 'hidden') saveState(); });
if(window.matchMedia){
  const mq = window.matchMedia('(prefers-color-scheme: light)');
  const onSys = function(){ if(prefs.theme === 'auto'){ applyPrefs(); render(); } };
  if(mq.addEventListener) mq.addEventListener('change', onSys); else if(mq.addListener) mq.addListener(onSys);
}

if(window.MutationObserver){
  new MutationObserver(function(){ if(booted && prefs.theme === 'auto'){ applyPrefs(); render(); } })
    .observe(document.documentElement, { attributes:true, attributeFilter:['data-theme'] });
}

/* Отступы от системных панелей, которые передаёт Android-обёртка (в CSS-пикселях) */
window.__setInsets = function(top, right, bottom, left){
  const r = document.documentElement.style;
  r.setProperty('--sat', (top || 0) + 'px'); r.setProperty('--sar', (right || 0) + 'px');
  r.setProperty('--sab', (bottom || 0) + 'px'); r.setProperty('--sal', (left || 0) + 'px');
};

/* ════════════════════════ Запуск ════════════════════════ */
function boot(){
  loadPrefs();
  applyPrefs();
  loadState();
  const now = new Date();
  ui.view = { y:now.getFullYear(), m:now.getMonth() };
  ui.statsYear = now.getFullYear();
  ui.pattern.workplaceId = state.workplaces.length ? state.workplaces[0].id : null;
  ui.selected = todayKey();
  ui.pattern.start = dk(now.getFullYear(), now.getMonth(), 1);
  ui.export = { from:now.getFullYear() + '-01-01', to:now.getFullYear() + '-12-31' };
  ui.viewAnim = 'tab';
  booted = true;
  if(!prefs.agreement || prefs.agreement.version !== AGREEMENT_VERSION){
    ui.sheet = { type:'agreement', mode:'first' };
  }
  const app = document.getElementById('app');
  if(app) app.innerHTML = '';
  render();
  onScroll();

  window.__save = function(){ saveState(); };
  window.__back = function(){ return handleBack(); };
  window.__canGoBack = function(){ return canGoBack(); };

  if(!window.AndroidApp && window.top === window && 'serviceWorker' in navigator && /^https?:$/.test(location.protocol)){
    window.addEventListener('load', function(){
      try{ navigator.serviceWorker.register('sw.js').catch(function(){}); }catch(e){}
    });
  }
}
boot();
