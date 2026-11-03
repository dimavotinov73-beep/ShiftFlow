# Futurist (ofc), FunkT!de — "DON'T STOP"

## Концепт: «БЛОК 125» — *DON'T STOP · LIVE FROM BLOCK 125*

**Идея.** Один мультяшный городской квартал выходит в эфир: вход в метро, крыша с бельём, лестница доходного дома и подземный паркинг. Ретро-шоу по очереди представляет троих жителей, как героев комикса. У каждого свой солнечный «взрыв» лучей, своё звукоподражание, крупная вставка с глазами и именная плашка. Вступление трека — это знакомство: героиня вылетает из метро, парень щёлкает пальцами на крыше, третья опускает очки на лестнице. На последнем такте перед дропом в тёмном паркинге видны только три пары глаз. На дропе рубильник включает свет, паркинг становится танцполом, и весь квартал кричит «DON'T STOP!». В финале двое тянутся к поцелую, но диафрагма-кружок схлопывается раньше, и ролик уходит в петлю.

**Что взято из референса:**
- ретро-мультипликация в стиле поп-арт-комикса 50–60-х;
- солнечный «взрыв» лучей за персонажем;
- звукоподражания объёмными буквами;
- вставка-панель с глазами и именная плашка под каждым героем;
- переходы: смаз, «шторка», диафрагма, взрыв-клякса;
- финальный титр с выглядывающими героями и петля.

**Чего нет:** Хэллоуина. Никаких монстров, тыкв, летучих мышей, луны-страшилки и фиолетово-слизисто-оранжевой гаммы.

**Что осталось из брифа:**
- трек и его сетка;
- 9:16 и 20–25 секунд;
- три героя (ОНА, ОН, ПОДРУГА), теперь нарисованные люди;
- локации из брифа: метро, крыша, лестница, паркинг;
- настроение: свобода, уверенность, притяжение, движение, андеграунд.

**Формат:** Instagram Reels, 9:16 (1080×1920), **24,96 с** = 624 кадра при 25 к/с, 10 шотов.
**Музыка:** начало трека, с 0,070 по 25,030 с WAV-файла. Темп 125 BPM: 1 доля = 12 кадров, такт = 48 кадров.
- 0–17,28 с: отфильтрованное вступление (знакомство с героями).
- **17,28 с: дроп.**
- 20,82–21,57 с: вокальный хук «don't stop».
- 24,48 с: второе «don't», обрыв на 24,96 с.

---

## Визуальный язык

**Стиль.** Ретро-мультипликация в стиле поп-арт-комикса 1950–60-х:
- толстый чёрный контур, растровые точки (halftone) в тенях;
- плоские заливки, бумажная фактура, лёгкое несовпадение цветов при печати;
- преувеличенные пропорции, «резиновые» руки и ноги.

Герои одеты в образы 90-х из брифа: получаются «люди 90-х, нарисованные как мультфильм 50-х».

**Палитра (не хэллоуинская)**

| Цвет | Hex | Роль |
|---|---|---|
| Крем | `#F2E4C4` | основа, лучи, буквы |
| Чернила | `#1B1716` | контур, тени |
| Томатный | `#E0452B` | взрывы, акценты, ветровка Пиппы |
| Бирюзовый | `#2A9D8F` | лучи Лео, небо, плашки |
| Горчичный | `#F2B33D` | лучи Пиппы, свет в окнах |
| Терракота | `#C8693F` | лестница Веры |
| Серый костюм | `#8C8A86` | костюм Веры |
| Бетонно-голубой | `#5D7A8C` | паркинг |

**Типографика (всё делается в After Effects, не генерацией):**
- Звукоподражания и титры: Bangers / Bowlby One / Lilita One (бесплатные Google Fonts). Кремовая заливка, чёрная обводка 8–12 px, объём (extrude) 6–10 слоёв со смещением, цветная тень.
- Именные плашки: Lilita One на бирюзовой или томатной ленте, подпись строчными.

**Анимация (After Effects, как в референсе):**
- Стоп-кадры героев и фонов генерируются отдельными слоями. Движение собирается в AE:
  - Puppet-пины («резиновые» руки и ноги);
  - параллакс слоёв;
  - появления с перелётом масштаба 0 → 115 → 100 % за 4–6 кадров;
  - тряска кадра на каждом звукоподражании.
- Стоп-кадры персонажей **на двойках** (12,5 к/с, Posterize Time), фон и камера — на 25 к/с.
- Лёгкое «дрожание» линий (line boil, Wiggle по Displacement 1–2 px).
- Лучи солнечного «взрыва» медленно вращаются, 6–10° за шот.
- Поверх всего: бумажная фактура (Multiply 15 %) и растр (CC Ball Action / Halftone 8 %).

**Безопасные зоны Reels.** Ключевое в центральной области 3:4. Нижние ~420 px и правые ~140 px свободны от текста. Именные плашки стоят на высоте 60–68 % кадра.

**Библиотека переходов**

| Переход | Где | Как |
|---|---|---|
| Диафрагма (iris) | SH01 → SH02, финал → петля | Круглая маска схлопывается в точку за 8 кадров |
| Смаз (whip) | SH02 → SH03 | Directional Blur 60–100 + сдвиг на ширину кадра за 6 кадров |
| Простыня | SH03 → SH04 | Слой простыни пролетает через кадр за 8 кадров |
| Жалюзи | SH04 → SH05 | 12 горизонтальных полос закрываются сверху вниз за 8 кадров |
| Взрыв-клякса | SH06 → SH07 (дроп) | Зубчатый взрыв в масштабе 0 → 300 % за 4 кадра |

---

## Герои: персонажный лист

> Блоки **PROMPT BLOCK** вставляются в промпты дословно. Для каждого героя сначала генерируется лист из 4–6 поз на нейтральном фоне, потом он используется как референс.

**PIPPA (ПОДРУГА)** — «full speed». Энергия, движение, смех.
```
PIPPA PROMPT BLOCK:
a cartoon young woman with a short messy black bob and a huge open grin, freckles, wearing an oversized tomato-red nylon windbreaker, navy track pants with white side stripes and no logos, and chunky white sneakers
```

**LEO (ОН)** — «steady groove». Спокойный, притягательный без усилий.
```
LEO PROMPT BLOCK:
a cartoon young man with a short cropped haircut, half-lidded calm eyes and a relaxed lopsided smile, wearing a plain black t-shirt, faded light-blue jeans and a thin silver chain
```

**VERA (ОНА)** — «no rush». Уверенная, чуть насмешливая.
```
VERA PROMPT BLOCK:
a cartoon young woman with dark hair in a messy updo, tiny oval sunglasses, one eyebrow raised in a confident, slightly mocking expression, wearing a white tank top under an oversized grey suit and flat leather sandals
```

**STYLE BLOCK** (в конце каждого промпта изображения):
```
retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering
```

---

## Звуковая сборка

**Трек:** фрагмент WAV с 0,070 по 25,030 с ставится с 0:00, уровень 0 дБ (пики −1 dBTP). В конце фейд 10 мс, жёсткий обрыв.
**Поверх — мультяшные шумы** (библиотечные): моно, уровни относительно трека. На пиках трека (дроп, хук) шумов меньше.

| Время (кадр) | Музыка | Шум поверх | Уровень |
|---|---|---|---|
| 0:00–0:01.08 | Нарастание из тишины | Вечерний город: далёкие машины, гул метро | −22 дБ |
| **0:01.08 (к27)** | Первый удар | **POP**: зажигается вывеска ON AIR + электрический треск | −14 дБ |
| 0:01.60 (к40) | | Диафрагма закрывается, «зип» | −18 дБ |
| 0:01.92 (к48) | Грув | Свист: лучи въезжают | −18 дБ |
| 0:02.40 (к60) | | Пружинное «боинг» на прыжке Пиппы | −16 дБ |
| **0:02.88 (к72)** | | **ZOOM**: пролётный свист | −14 дБ |
| 0:03.84 / 0:04.32 (к96 / к108) | | Хлопок вставки с глазами; «динь» плашки | −20 дБ |
| 0:05.44–0:05.72 (к136–143) | | Свист смаза | −14 дБ |
| 0:05.76–0:09.60 | Грув + вокальная линия | Ветер, хлопанье белья | −24 дБ |
| 0:07.68 / **0:09.12** (к192 / **к228**) | Вокальный акцент на к228 | **SNAP**: щелчки пальцев, второй громче | −16 / **−14 дБ** |
| 0:08.16 / 0:08.64 (к204 / к216) | | Блик цепочки «тинь»; «динь» плашки | −20 дБ |
| 0:09.28–0:09.56 (к232–239) | | Простыня пролетает, «фшух» | −16 дБ |
| 0:10.56 (к264) | | Очки съезжают: «клик» + мультяшное «бвип» бровью | −16 дБ |
| **0:11.04 (к276)** | | **SMIRK**: короткий удар-акцент | −16 дБ |
| 0:12.00 (к300) | | «Динь» плашки | −20 дБ |
| 0:13.12–0:13.40 (к328–335) | | Дребезг закрывающихся жалюзи | −16 дБ |
| 0:13.44 / 13.92 / 14.40 / 14.88 | Пик хэтов | Шлепки панелей комикса, ровно на каждую долю | −16 дБ |
| 0:15.36–0:17.20 | Откат перед дропом | Темнота: капает вода, гул; три «моргания» (крошечные хлопки) | −20 дБ |
| **0:17.20 (к430)** | | **CLACK**: рубильник | **−12 дБ** |
| **0:17.28 (к432)** | **ДРОП** | Удар-взрыв под бочку | −14 дБ |
| 0:17.76 / 0:18.24 (к444 / к456) | | WHAM ×2: имена артистов бьют в кадр | −16 дБ |
| 0:19.20–0:20.79 | Полный грув | Толпа «у-у!», скрип кроссовок | −24 дБ |
| **0:20.82–0:21.57 (к520–539)** | **Хук «don't stop»** | Только лёгкий удар на «STOP» (к528), вокал звучит чисто | −18 дБ |
| 0:23.04 (к576) | Грув | «Та-дам»: блеск титра | −18 дБ |
| 0:24.48 (к612) | «Don't—» | Сердечки: «блуп-блуп» | −20 дБ |
| 0:24.72–0:24.96 (к618–623) | | Диафрагма схлопывается, «зип» | −16 дБ |
| **0:24.96 (к624)** | Обрыв перед «stop» | Тишина, петля | — |

---

## Раскадровка

| Шот | Название | Время | Кадры | Длит. | Локация |
|---|---|---|---|---|---|
| SH01 | В эфире | 0:00.00–0:01.92 | 0–47 | 48 к | Квартал, вечер |
| SH02 | PIPPA | 0:01.92–0:05.76 | 48–143 | 96 к | Вход в метро |
| SH03 | LEO | 0:05.76–0:09.60 | 144–239 | 96 к | Крыша с бельём |
| SH04 | VERA | 0:09.60–0:13.44 | 240–335 | 96 к | Лестница доходного дома |
| SH05 | Страница комикса | 0:13.44–0:15.36 | 336–383 | 48 к (4×12) | Все локации |
| SH06 | Глаза в темноте | 0:15.36–0:17.28 | 384–431 | 48 к | Тёмный паркинг |
| SH07 | ДРОП | 0:17.28–0:19.20 | 432–479 | 48 к | Паркинг, свет |
| SH08 | Танцпол | 0:19.20–0:20.80 | 480–519 | 40 к | Паркинг |
| SH09 | DON'T STOP! | 0:20.80–0:23.04 | 520–575 | 56 к | Паркинг |
| SH10 | Титр | 0:23.04–0:24.96 | 576–623 | 48 к | Титр → петля |

Во всех шотах есть анимированные люди: герои или прохожие и толпа.

---

### SH01 · «В эфире» — 0:00.00–0:01.92 · к0–47

1. **Визуальное описание.** Вечерний мультяшный квартал: доходный дом с бельём на крыше и антенной, внизу вход в метро с круглой вывеской «U», сбоку въезд в подземный паркинг. По тротуару идут крошечные прохожие, в окнах загорается свет. Из антенны на крыше расходятся зигзаги радиоволн. На первом ударе над антенной с хлопком загорается ретро-вывеска **ON AIR** (томатная, с лампочками).
2. **Ракурс и движение камеры.** Фронтальный общий план. Медленный 2.5D-наезд с параллаксом: небо, дом, фонарь на переднем плане. Лёгкая тряска при хлопке.
3. **Свет и атмосфера.** Бирюзовые сумерки с кремовыми звёздочками, горчичные окна. Уютно, без мрачности.
4. **Действия и эмоции моделей.** Прохожие идут, кто-то машет из окна, в окне третьего этажа силуэт танцует. Предвкушение вечера.
5. **Ритм монтажа.** Один шот на такт. Вывеска ON AIR вспыхивает **на к27** (первый удар). С к40 диафрагма-кружок сжимается на входе в метро и закрывается на к47. Переход в SH02.
6. **Промпты:**
   - **Кадр (изображение):**
```
A cartoon European city block at dusk in 1997: a five-storey tenement house with laundry lines and a TV antenna on the roof, a round metro entrance sign with the letter U at street level, an underground parking ramp on the side, warm mustard light in the windows, tiny cartoon passers-by on the pavement, a silhouette dancing in one window, zigzag radio waves coming from the antenna, a teal dusk sky with cream stars. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon illustration as limited 2D cartoon animation: tiny passers-by walk along the pavement with bouncy steps, a person in a window waves, a silhouette dances in another window, window lights pop on one by one, zigzag radio waves pulse from the rooftop antenna, laundry sways on the roof. Slow straight push-in toward the metro entrance with gentle parallax. Keep flat colors, bold ink outlines and halftone texture, slight line boil, no 3D, no camera rotation, real-time speed, vertical 9:16.
```

---

### SH02 · «PIPPA» — 0:01.92–0:05.76 · к48–143

1. **Визуальное описание.** Справа въезжают горчично-кремовые лучи. Из лестницы метро в прыжке вылетает **ПИППА**: ветровка раздута, лампасы, кроссовки, рот до ушей. Вокруг неё линии скорости. Огромное **ZOOM!** врезается по диагонали. В левом верхнем углу появляется наклонная панель с её широко распахнутыми глазами. Внизу плашка **PIPPA — full speed**.
2. **Ракурс и движение камеры.** Чуть снизу, средний план. Камера коротко «подпрыгивает» вместе с ней, на ZOOM трясётся (6 кадров, амплитуда 12 px).
3. **Свет и атмосфера.** Плоский мультяшный свет, горчичные лучи, растр в тенях. Утро-день, энергия.
4. **Действия и эмоции моделей.** Прыжок, приземление с «пружиной» (сплющивание и растяжение) на долях, волосы и ветровка хлопают, она хохочет и делает «V» пальцами. Чистая радость.
5. **Ритм монтажа.**
   - к48: лучи въезжают;
   - к60: прыжок;
   - **к72: ZOOM!**;
   - к96: панель с глазами;
   - к108: плашка с именем;
   - к136–143: смаз вправо, переход в SH03.
6. **Промпты:**
   - **Кадр (изображение):**
```
A cartoon young woman with a short messy black bob and a huge open grin, freckles, wearing an oversized tomato-red nylon windbreaker, navy track pants with white side stripes and no logos, and chunky white sneakers, leaps high out of a metro station staircase, one arm raised in a V sign, windbreaker puffed up, motion lines behind her, a mustard and cream radial speed-line sunburst background, the metro entrance and tiled pavement at the bottom. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon character as limited 2D cartoon animation on twos: she leaps out of the metro stairs, lands with a bouncy squash and stretch, bounces on the beat, her short black hair and red windbreaker flap, she laughs and flashes a V sign; the sunburst rays rotate slowly behind her and motion lines streak past. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH03 · «LEO» — 0:05.76–0:09.60 · к144–239

1. **Визуальное описание.** Крыша: бельевые верёвки с кремовыми простынями в бирюзовую полоску, кирпичная труба, антенна. За героем бирюзовые лучи. **ЛЕО** прислонился к трубе, полуприкрытые глаза, ленивая улыбка. Он щёлкает пальцами, и рядом с рукой вспыхивает **SNAP!**. На серебряной цепочке мигает искра-звёздочка. Панель с его полуприкрытыми глазами, плашка **LEO — steady groove**.
2. **Ракурс и движение камеры.** На уровне глаз, средний план. Медленный наезд, лёгкий параллакс простыней на переднем плане.
3. **Свет и атмосфера.** Бирюзовое небо, ветер, бельё колышется. Спокойствие и уверенность.
4. **Действия и эмоции моделей.** Покачивает головой в такт, два щелчка пальцами. На втором чуть поднимает подбородок и смотрит в сторону, где «кто-то» есть. Притягательный без усилий.
5. **Ритм монтажа.**
   - к144: лучи;
   - к180: панель с глазами;
   - к192: первый SNAP (маленький);
   - к204: искра на цепочке;
   - к216: плашка;
   - **к228: второй SNAP (большой)**, на вокальном акценте;
   - к232–239: простыня пролетает через кадр, переход в SH04.
6. **Промпты:**
   - **Кадр (изображение):**
```
A cartoon young man with a short cropped haircut, half-lidded calm eyes and a relaxed lopsided smile, wearing a plain black t-shirt, faded light-blue jeans and a thin silver chain, leans against a brick chimney on a flat rooftop, snapping his fingers, a little sparkle on his silver chain; laundry lines with cream sheets with teal stripes flutter around him, a TV antenna behind, a teal and cream radial speed-line sunburst background. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon character as limited 2D cartoon animation on twos: he leans on the chimney, nods to the beat, snaps his fingers twice, the second time lifting his chin with a cool half-smile; his silver chain sparkles, the striped sheets billow in the wind, the sunburst rays rotate slowly. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH04 · «VERA» — 0:09.60–0:13.44 · к240–335

1. **Визуальное описание.** Лестница доходного дома: пол в терракотово-кремовую клетку, белая стена, окно с жалюзи, полосы света лежат графичными линиями. За героиней томатные лучи. **ВЕРА** в сером оверсайз-костюме прислонилась к стене и одним пальцем опускает крошечные очки. Панель крупно: её глаза поверх очков, одна бровь вверх. Звукоподражание **SMIRK!**, плашка **VERA — no rush**.
2. **Ракурс и движение камеры.** Чуть снизу, полный рост. Наезд к лицу на SMIRK.
3. **Свет и атмосфера.** Полосатый свет жалюзи (кремовые и бирюзовые полосы), тёплая терракота. Прохлада и ирония.
4. **Действия и эмоции моделей.** Не торопится: опускает очки, приподнимает бровь, усмехается уголком рта, перекладывает пиджак на плечо. Уверенность и лёгкая насмешка.
5. **Ритм монтажа.**
   - к240: лучи;
   - к264: очки съезжают, панель с глазами;
   - **к276: SMIRK!**;
   - к300: плашка;
   - к328–335: жалюзи закрываются полосами, переход в SH05.
6. **Промпты:**
   - **Кадр (изображение):**
```
A cartoon young woman with dark hair in a messy updo, tiny oval sunglasses, one eyebrow raised in a confident, slightly mocking expression, wearing a white tank top under an oversized grey suit and flat leather sandals, leans against a white wall in an old tenement stairwell and lowers her sunglasses with one finger; terracotta and cream checkered floor tiles, a window with venetian blinds casting graphic stripes of light, a tomato red and cream radial speed-line sunburst background. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow plus terracotta, subtle paper texture, slight print misregistration, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon character as limited 2D cartoon animation on twos: she slowly lowers her tiny sunglasses with one finger, raises one eyebrow, gives a sly half-smile and swings her grey suit jacket over her shoulder; the stripes of light from the blinds shift slightly, the sunburst rays rotate slowly. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH05 · «Страница комикса» — 0:13.44–0:15.36 · к336–383

1. **Визуальное описание.** Вертикальная страница комикса собирается на каждую долю, по панели (наклонные рамки, кремовые поля):
   - кроссовки Пиппы отбивают ритм, **TAP TAP**;
   - пальцы Лео, **SNAP**;
   - очки Веры, **CLICK**;
   - все трое бегут к стрелке **PARKING ↓**.
2. **Ракурс и движение камеры.** Статичная «страница». Каждая панель врезается с перелётом масштаба и лёгким поворотом, камера дёргается на каждом шлепке.
3. **Свет и атмосфера.** Четыре цвета героев в четырёх панелях: горчичный, бирюзовый, томатный, бетонно-голубой. Максимальная энергия, пик хэтов.
4. **Действия и эмоции моделей.** Короткие петли движений (кроссовки, щелчок, очки, бег). Азарт.
5. **Ритм монтажа.** Ровно в доли: **к336, к348, к360, к372**, по 12 кадров. На к383 страница уходит в темноту.
6. **Промпты:**
   - **Кадр (изображение)** (4 отдельных кадра, затем сборка в AE):
```
Four separate retro comic panels, each a close-up: (1) chunky white sneakers and navy track pants with white side stripes tapping on a tiled pavement, mustard background; (2) a hand with a thin silver chain snapping its fingers, teal background; (3) tiny oval sunglasses sliding down a nose under a raised eyebrow, tomato red background; (4) three cartoon young people in a red windbreaker, a black t-shirt and a grey suit running toward an arrow pointing down into a parking garage, concrete blue background. Retro 1950s-60s cartoon pop-art illustration, bold black ink outlines, halftone dot shading, flat limited palette, subtle paper texture, slight print misregistration, no text, no lettering.
```
   - **Анимация (видео)** (для каждой панели отдельно, 2 секунды, берётся 12 кадров):
```
Animate this retro comic panel as a short limited 2D cartoon loop on twos: the sneakers tap twice / the fingers snap once / the sunglasses slide down and the eyebrow pops up / the three friends run toward the arrow with bouncy rubber-hose legs. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed.
```

---

### SH06 · «Глаза в темноте» — 0:15.36–0:17.28 · к384–431

1. **Визуальное описание.** Почти чёрный кадр подземного паркинга, только еле видны контуры колонн и разметки. В темноте моргают **три пары глаз**: широкие у Пиппы, полуприкрытые у Лео, у Веры поверх очков. Маленькими буквами шёпот: *…ready?* В конце мультяшная рука тянется к огромному рубильнику на стене.
2. **Ракурс и движение камеры.** Статика, очень медленный наезд на глаза.
3. **Свет и атмосфера.** Темнота, глаза кремовые, капли воды. Тишина перед взрывом.
4. **Действия и эмоции моделей.** Глаза переглядываются, моргают по очереди, хитро щурятся. Озорство и предвкушение.
5. **Ритм монтажа.**
   - Целый такт без склеек, пока музыка откатывается.
   - Моргания на долях: к384, к396, к408.
   - к420: рука на рубильнике.
   - **к430: CLACK!**, за 2 кадра до дропа.
6. **Промпты:**
   - **Кадр (изображение):**
```
A pitch-dark cartoon underground parking garage, barely visible outlines of concrete pillars and floor markings in deep blue-black, three pairs of bright cream cartoon eyes glowing in the darkness: one pair wide and excited, one pair half-lidded and calm, one pair peeking over tiny oval sunglasses; a cartoon hand reaching for a big old wall-mounted lever switch on the right. Retro 1950s-60s cartoon pop-art illustration, bold black ink outlines, halftone dot shading, flat limited palette, subtle paper texture, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon scene as limited 2D cartoon animation on twos: the three pairs of eyes in the dark blink one after another, glance at each other and narrow mischievously; a cartoon hand slowly reaches up and grabs the big wall lever. Keep flat colors, bold ink outlines and halftone texture, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH07 · «ДРОП» — 0:17.28–0:19.20 · к432–479

1. **Визуальное описание.** На дропе зубчатый томатно-горчичный **взрыв-клякса** заливает кадр, под потолком паркинга загораются ряды ламп (кремовые полосы). На фоне взрыва трое в прыжке: Пиппа с поднятыми руками, Лео в развороте, Вера, придерживающая очки. Имена артистов **врезаются** объёмными буквами: **FUTURIST (ofc)**, следом **FUNKT!DE**.
2. **Ракурс и движение камеры.** Взрыв от центра, сильная тряска на каждом ударе букв, быстрый наезд.
3. **Свет и атмосфера.** Резкая смена: из черноты в насыщенные томатный, горчичный и крем, лучи вращаются быстрее. Освобождение.
4. **Действия и эмоции моделей.** Прыжок втроём, «резиновые» руки и ноги, восторг.
5. **Ритм монтажа.**
   - **к432: взрыв точно на дроп**;
   - к444: FUTURIST (ofc);
   - к456: FUNKT!DE;
   - к479: склейка в SH08.
6. **Промпты:**
   - **Кадр (изображение):**
```
Three cartoon young people jump in the air together inside an underground parking garage as rows of fluorescent ceiling lights switch on: a girl with a short black bob in a red windbreaker and striped track pants throws both arms up, a guy in a black t-shirt and jeans with a silver chain spins mid-air, a girl in an oversized grey suit holds her tiny sunglasses in place; behind them a huge jagged tomato red and mustard comic explosion burst with radial speed lines. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon scene as limited 2D cartoon animation on twos: the comic explosion bursts outward, the ceiling lights flick on row by row, the three friends jump with stretchy rubber-hose arms and legs, land and start dancing; the speed lines rotate fast behind them. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH08 · «Танцпол» — 0:19.20–0:20.80 · к480–519

1. **Визуальное описание.** Паркинг стал танцполом: разметка как шахматный пол, на капоте ретро-машины стоит бумбокс, вокруг толпа мультяшной молодёжи 90-х (сетчатые майки, ветровки, панамки). На переднем плане Пиппа крутится волчком, Лео плавно двигается шагами в сторону, Вера минимально двигает плечами.
2. **Ракурс и движение камеры.** Общий план чуть сверху. Камера качается в такт (на каждую долю вниз-вверх на 6 px).
3. **Свет и атмосфера.** Кремовые полосы ламп, бетонно-голубые колонны, тёплые акценты одежды. Свобода.
4. **Действия и эмоции моделей.** Все танцуют по-своему, толпа подпрыгивает на долях. Радость, движение.
5. **Ритм монтажа.** 40 кадров. Склейка на к520, за кадр до вокального «don't».
6. **Промпты:**
   - **Кадр (изображение):**
```
A cartoon underground parking garage turned into a dance floor: painted floor markings forming a checkerboard, concrete pillars, rows of cream ceiling lights, a boombox standing on the hood of a rounded vintage car, a crowd of cartoon young people in 1990s outfits (mesh tops, windbreakers, bucket hats, baggy jeans) dancing; in front, a girl with a short black bob in a red windbreaker spins, a guy in a black t-shirt and jeans with a silver chain does a smooth side step, a girl in an oversized grey suit and tiny sunglasses grooves with her shoulders. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal, mustard yellow and concrete blue, subtle paper texture, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon scene as limited 2D cartoon animation on twos: the crowd bounces on every beat, the girl in the red windbreaker spins, the guy side-steps smoothly, the girl in the grey suit grooves her shoulders, the boombox speakers pump. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH09 · «DON'T STOP!» — 0:20.80–0:23.04 · к520–575

1. **Визуальное описание.** Вокальный хук. Трое на переднем плане, сложив руки рупором, кричат прямо в камеру, за ними подпрыгивает толпа. Над ними огромное объёмное **DON'T** (к520), затем с ударом **STOP!** (к528) на томатном взрыве. Потом буквы остаются и пульсируют, а герои танцуют.
2. **Ракурс и движение камеры.** Нижний ракурс, широкий угол. Сильная тряска на STOP!, затем покачивание в такт.
3. **Свет и атмосфера.** Томатно-кремовый взрыв, растр, максимум цвета. Главный пик.
4. **Действия и эмоции моделей.** Крик-кураж и общий прыжок на STOP!. Свобода и молодость.
5. **Ритм монтажа.**
   - **к520: DON'T**;
   - **к528: STOP!**, ровно на сильную долю 12-го такта, где в хуке звучит «stop»;
   - к540–575: удержание с пульсом букв на долях;
   - склейка на к576.
6. **Промпты:**
   - **Кадр (изображение):**
```
Low-angle view of three cartoon young people shouting joyfully toward the viewer with their hands cupped around their mouths: a girl with a short black bob in a red windbreaker, a guy in a black t-shirt with a silver chain, a girl in an oversized grey suit with tiny sunglasses pushed up on her head; behind them a crowd of cartoon young people in 1990s outfits jumping with arms up inside a parking garage, a huge jagged tomato red comic explosion burst with radial speed lines filling the upper half of the frame (empty space for lettering). Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, exaggerated rubber-hose proportions, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon scene as limited 2D cartoon animation on twos: the three friends shout with cupped hands, then everybody jumps at once and lands on the beat, the crowd bounces with arms up, the explosion burst pulses and the speed lines spin. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

### SH10 · «Титр» — 0:23.04–0:24.96 · к576–623

1. **Визуальное описание.** Финальный титр на горчично-кремовых лучах:
   - логотип **DON'T STOP** ретро-буквами;
   - под ним **FUTURIST (ofc), FUNKT!DE**;
   - круглый штамп **OUT NOW** (или дата релиза).

   Из углов выглядывают герои: Пиппа снизу слева машет, Лео и Вера справа. На «Don't—» Лео и Вера тянутся друг к другу, вылетают два сердечка, и **диафрагма-кружок схлопывается на них раньше, чем губы встретились**. Чёрная точка, петля в SH01.
2. **Ракурс и движение камеры.** Статика титра, лёгкое вращение лучей. В конце сжимается круглая маска.
3. **Свет и атмосфера.** Праздничный крем, горчица и томат. Финал-подмигивание.
4. **Действия и эмоции моделей.** Пиппа машет обеими руками. Лео и Вера переглядываются, тянутся к поцелую и почти касаются. Притяжение, напряжение важнее разрядки.
5. **Ритм монтажа.**
   - к576: титр и «та-дам»;
   - к588: штамп OUT NOW;
   - **к612: «Don't—»**, сердечки;
   - **к618–623: диафрагма закрывается**;
   - **к624: обрыв**, петля в SH01.
6. **Промпты:**
   - **Кадр (изображение)** (фон и герои отдельно, буквы делаются в AE):
```
A retro cartoon title card background: mustard and cream radial speed-line sunburst with a big empty central area for a logo; three cartoon young people peeking in from the corners: a girl with a short black bob in a red windbreaker waving with both hands from the lower left, and on the right a guy in a black t-shirt with a silver chain and a girl in an oversized grey suit with tiny sunglasses leaning toward each other, almost kissing, two small cartoon hearts above them. Retro 1950s-60s cartoon pop-art illustration, vintage comic book print style, bold black ink outlines, halftone dot shading, flat limited palette of cream, ink black, tomato red, teal and mustard yellow, subtle paper texture, slight print misregistration, vertical 9:16 composition, no text, no lettering.
```
   - **Анимация (видео):**
```
Animate this retro cartoon title card as limited 2D cartoon animation on twos: the sunburst rays rotate slowly, the girl in the lower left waves both hands, the couple on the right glance at each other and slowly lean in, two little hearts pop up above them, but they never quite kiss. Keep flat colors, bold ink outlines and halftone shading, slight line boil, no 3D, real-time speed, vertical 9:16.
```

---

## Как собрать (повторяет пайплайн референса)
1. **Изображения.**
   - Сначала персонажные листы трёх героев по PROMPT BLOCK.
   - Потом кадры по промптам шотов: персонажи на чистом фоне отдельно, фоны отдельно, без текста.
   - Апскейл (например, в Magnific).
2. **Движение.** Puppet-анимация и появления в After Effects или короткие клипы image-to-video по промптам «Анимация». Из каждого клипа берётся середина, на двойках.
3. **Графика.** Все буквы (звукоподражания, плашки, титр), лучи, растр, переходы и тряска делаются в AE по таймингам из раскадровки.
4. **Звук.** Трек плюс мультяшные шумы по таблице звуковой сборки.
