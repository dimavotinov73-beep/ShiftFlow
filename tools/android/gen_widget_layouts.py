"""Генерирует макеты виджетов (повторяющиеся клетки дней) и графику в android/app/src/main/res.
Запуск: python3 tools/android/gen_widget_layouts.py"""
import os
RES = os.path.join(os.path.dirname(__file__), '..', '..', 'android', 'app', 'src', 'main', 'res')
def w(path, text):
    p = os.path.join(RES, path); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(text)

NS = 'xmlns:android="http://schemas.android.com/apk/res/android"'


def cell(cid, wd=False, num_sp=14, name_h=12, name_max=9, bar_mb=4, margin_end=True):
    """Клетка дня: фон (тонируется), рамка «сегодня», [день недели], число, название смены, полоска цвета места."""
    end = ' android:layout_marginEnd="4dp"' if margin_end else ''
    wd_view = ''
    if wd:
        wd_view = f'''
                <TextView android:id="@+id/{cid}_wd" android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:layout_marginBottom="1dp" android:includeFontPadding="false"
                    android:textSize="9sp" android:fontFamily="@font/onest_bold" android:textColor="#68726F" android:text="ПН" android:textAllCaps="true" />'''
    return f'''
        <FrameLayout android:id="@+id/{cid}" android:layout_width="0dp" android:layout_height="match_parent" android:layout_weight="1"{end}>
            <ImageView android:id="@+id/{cid}_bg" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_cell" android:scaleType="fitXY" android:importantForAccessibility="no" />
            <ImageView android:id="@+id/{cid}_ring" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_cell_ring" android:scaleType="fitXY" android:visibility="gone" android:importantForAccessibility="no" />
            <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical"
                android:gravity="center" android:paddingBottom="{bar_mb + 2}dp">{wd_view}
                <TextView android:id="@+id/{cid}_num" android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:includeFontPadding="false" android:textSize="{num_sp}sp" android:fontFamily="@font/onest_bold" android:textColor="#F1F5F4" android:text="9" />
                <TextView android:id="@+id/{cid}_nm" android:layout_width="match_parent" android:layout_height="{name_h}dp" android:layout_marginTop="2dp"
                    android:gravity="center" android:maxLines="1" android:ellipsize="end" android:includeFontPadding="false"
                    android:paddingLeft="2dp" android:paddingRight="2dp"
                    android:autoSizeTextType="uniform" android:autoSizeMinTextSize="6sp" android:autoSizeMaxTextSize="{name_max}sp" android:autoSizeStepGranularity="0.5sp"
                    android:textSize="8sp" android:fontFamily="@font/onest_bold" android:textColor="#A2ADAA" android:text="" />
            </LinearLayout>
            <ImageView android:id="@+id/{cid}_bar" android:layout_width="14dp" android:layout_height="3dp"
                android:layout_gravity="bottom|center_horizontal" android:layout_marginBottom="{bar_mb}dp"
                android:src="@drawable/widget_bar" android:scaleType="fitXY" android:visibility="invisible" android:importantForAccessibility="no" />
        </FrameLayout>'''


def pill(idn, text):
    return f'''
        <FrameLayout android:id="@+id/{idn}" android:layout_width="match_parent" android:layout_height="38dp">
            <ImageView android:id="@+id/{idn}_bg" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_pill" android:scaleType="fitXY" android:importantForAccessibility="no" />
            <TextView android:id="@+id/{idn}_text" android:layout_width="match_parent" android:layout_height="match_parent"
                android:gravity="center" android:maxLines="1" android:ellipsize="end" android:paddingLeft="8dp" android:paddingRight="8dp"
                android:textSize="13sp" android:fontFamily="@font/onest_bold" android:textColor="#05110D" android:text="{text}" />
        </FrameLayout>'''


def head(title):
    return f'''
        <LinearLayout android:id="@+id/w_head" android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical">
            <ImageView android:id="@+id/w_mark" android:layout_width="22dp" android:layout_height="14dp" android:src="@drawable/widget_mark_dark"
                android:scaleType="fitCenter" android:importantForAccessibility="no" />
            <TextView android:id="@+id/w_title" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1"
                android:layout_marginStart="7dp" android:maxLines="1" android:ellipsize="end"
                android:textSize="12sp" android:fontFamily="@font/onest_bold" android:textColor="#A2ADAA" android:text="{title}" />
        </LinearLayout>'''


# Корень: фон и обводка — отдельные картинки, их цвет задаётся из приложения (тема и оттенок фона)
def root_open(pad):
    return f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Сгенерировано tools/android/gen_widget_layouts.py -->
<FrameLayout {NS}
    android:id="@android:id/background"
    android:layout_width="match_parent" android:layout_height="match_parent">
    <ImageView android:id="@+id/w_bg" android:layout_width="match_parent" android:layout_height="match_parent"
        android:src="@drawable/widget_bg" android:scaleType="fitXY" android:importantForAccessibility="no" />
    <ImageView android:id="@+id/w_edge" android:layout_width="match_parent" android:layout_height="match_parent"
        android:src="@drawable/widget_edge" android:scaleType="fitXY" android:importantForAccessibility="no" />
    <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:padding="{pad}">'''


ROOT_CLOSE = '''
    </LinearLayout>
</FrameLayout>
'''

# «Сегодня»: что сегодня (и ближайшая смена, если сегодня не рабочий день) и одна кнопка «Открыть»
w('layout/widget_today.xml', root_open('14dp') + head('Понедельник, 9 ноября') + '''
        <FrameLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" />
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical">
            <ImageView android:id="@+id/w_dot" android:layout_width="10dp" android:layout_height="10dp" android:layout_marginEnd="8dp"
                android:src="@drawable/widget_dot" android:importantForAccessibility="no" />
            <TextView android:id="@+id/w_status" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1"
                android:maxLines="1" android:ellipsize="end" android:textSize="20sp" android:fontFamily="@font/unbounded_bold"
                android:textColor="#F1F5F4" android:text="Кофейня" />
        </LinearLayout>
        <TextView android:id="@+id/w_sub" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="4dp"
            android:maxLines="1" android:ellipsize="end" android:textSize="13sp" android:fontFamily="@font/onest_medium"
            android:textColor="#A2ADAA" android:text="8 ч · 2 560 ₽" />
        <FrameLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:minHeight="10dp" />''' + pill('w_open', 'Открыть') + ROOT_CLOSE)

# «Месяц»: «Ноябрь 2026», строка дней недели и до 6 недель — сколько поместится по высоте
weeks = ''.join(
    f'''
        <LinearLayout android:id="@+id/r{r}" android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1"
            android:layout_marginTop="4dp" android:orientation="horizontal">'''
    + ''.join(cell(f'd{r}{i}', num_sp=12, name_h=11, name_max=8.5, bar_mb=3, margin_end=i < 6) for i in range(7))
    + '''
        </LinearLayout>''' for r in range(6))
wdrow = ''.join(
    f'''
            <TextView android:id="@+id/h{i}" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1"{' android:layout_marginEnd="4dp"' if i < 6 else ''}
                android:gravity="center" android:textSize="9sp" android:fontFamily="@font/onest_bold" android:textColor="#68726F" android:text="ПН" android:textAllCaps="true" />'''
    for i in range(7))
w('layout/widget_month.xml', root_open('12dp') + head('Ноябрь 2026') + '''
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="8dp" android:orientation="horizontal">''' + wdrow + '''
        </LinearLayout>''' + weeks + ROOT_CLOSE)

# «Неделя»: семь дней с днём недели, числом и названием смены
w('layout/widget_week.xml', root_open('8dp') + '''
        <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="horizontal">'''
  + ''.join(cell(f'k{i}', wd=True, num_sp=15, name_h=12, name_max=9.5, bar_mb=5, margin_end=i < 6) for i in range(7)) + '''
        </LinearLayout>''' + ROOT_CLOSE)

# ───────── Графика ─────────
# Фон и обводка виджета: белые фигуры, цвет задаётся при отрисовке (setColorFilter / setImageAlpha)
w('drawable/widget_bg.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#FFFFFFFF" />
    <corners android:radius="24dp" />
</shape>
''')
# Прозрачная заливка обязательна: без неё GradientDrawable с цветовым фильтром закрашивает всю фигуру
w('drawable/widget_edge.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#00000000" />
    <stroke android:width="1dp" android:color="#FFFFFFFF" />
    <corners android:radius="24dp" />
</shape>
''')
for name, rad in [('widget_cell', '10dp'), ('widget_pill', '19dp')]:
    w(f'drawable/{name}.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#FFFFFFFF" />
    <corners android:radius="{rad}" />
</shape>
''')
w('drawable/widget_cell_ring.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#00000000" />
    <stroke android:width="2dp" android:color="#FFFFFFFF" />
    <corners android:radius="10dp" />
</shape>
''')
w('drawable/widget_bar.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#FFFFFFFF" />
    <corners android:radius="2dp" />
</shape>
''')
w('drawable/widget_dot.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="oval">
    <solid android:color="#FFFFFFFF" />
</shape>
''')
# Знак: линия + шар (та же геометрия, что в tools/brand/mark.mjs), для тёмной и светлой темы
for name, line in [('widget_mark_dark', '#FFF4FBF9'), ('widget_mark_light', '#FF0E1513')]:
    w(f'drawable/{name}.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<vector {NS} android:width="22dp" android:height="14dp" android:viewportWidth="80" android:viewportHeight="48">
    <group android:translateX="-10" android:translateY="-27">
        <path android:pathData="M15,51.8L24.56,51.8A7,7 0,0 1,30.74 55.52A21.8,21.8 0,0 0,69.26 55.52A7,7 0,0 1,75.44 51.8L85,51.8"
            android:strokeColor="{line}" android:strokeWidth="8" android:strokeLineCap="round" android:fillColor="#00000000" />
        <path android:fillColor="#FF3DDCB0" android:pathData="M36,45.3a14,14 0,1 0,28 0a14,14 0,1 0,-28 0" />
    </group>
</vector>
''')

# Описание виджетов для лаунчера
for name, mw, mh, cw, ch, desc in [('today', 110, 110, 2, 2, 'widget_today_desc'),
                                   ('month', 250, 110, 4, 3, 'widget_month_desc'),
                                   ('week', 250, 60, 4, 1, 'widget_week_desc')]:
    w(f'xml/widget_{name}_info.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<appwidget-provider {NS}
    android:minWidth="{mw}dp" android:minHeight="{mh}dp"
    android:minResizeWidth="{mw}dp" android:minResizeHeight="{mh}dp"
    android:targetCellWidth="{cw}" android:targetCellHeight="{ch}"
    android:resizeMode="horizontal|vertical"
    android:updatePeriodMillis="1800000"
    android:initialLayout="@layout/widget_{name}"
    android:previewImage="@drawable/widget_preview_{name}"
    android:previewLayout="@layout/widget_{name}"
    android:description="@string/{desc}"
    android:widgetCategory="home_screen" />
''')
print('widget resources written')
