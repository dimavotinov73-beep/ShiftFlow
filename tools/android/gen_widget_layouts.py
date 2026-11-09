"""Генерирует макеты виджетов (повторяющиеся клетки дней) и графику в android/app/src/main/res.
Запуск: python3 tools/android/gen_widget_layouts.py"""
import os
RES = os.path.join(os.path.dirname(__file__), '..', '..', 'android', 'app', 'src', 'main', 'res')
def w(path, text):
    p = os.path.join(RES, path); os.makedirs(os.path.dirname(p), exist_ok=True)
    open(p, 'w', encoding='utf-8').write(text)

NS = 'xmlns:android="http://schemas.android.com/apk/res/android"'

def day_cells(prefix, n=7, names=False, h='match_parent'):
    out = []
    for i in range(n):
        end = '' if i == n - 1 else ' android:layout_marginEnd="4dp"'
        name = (f'''
                <TextView android:id="@+id/{prefix}{i}_nm" android:layout_width="match_parent" android:layout_height="wrap_content"
                    android:gravity="center" android:maxLines="1" android:ellipsize="end" android:paddingLeft="2dp" android:paddingRight="2dp"
                    android:textSize="8sp" android:fontFamily="@font/onest_bold" android:textColor="#A2ADAA" android:text="" />''' if names else '')
        out.append(f'''
        <FrameLayout android:id="@+id/{prefix}{i}" android:layout_width="0dp" android:layout_height="{h}" android:layout_weight="1"{end}>
            <ImageView android:id="@+id/{prefix}{i}_bg" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_cell" android:scaleType="fitXY" android:importantForAccessibility="no" />
            <ImageView android:id="@+id/{prefix}{i}_ring" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_cell_ring" android:scaleType="fitXY" android:visibility="gone" android:importantForAccessibility="no" />
            <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical" android:gravity="center">
                <TextView android:id="@+id/{prefix}{i}_wd" android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:textSize="9sp" android:fontFamily="@font/onest_bold" android:textColor="#68726F" android:text="ПН" android:textAllCaps="true" />
                <TextView android:id="@+id/{prefix}{i}_num" android:layout_width="wrap_content" android:layout_height="wrap_content"
                    android:textSize="14sp" android:fontFamily="@font/onest_bold" android:textColor="#F1F5F4" android:text="{10 + i}" />{name}
            </LinearLayout>
            <ImageView android:id="@+id/{prefix}{i}_bar" android:layout_width="16dp" android:layout_height="3dp"
                android:layout_gravity="bottom|center_horizontal" android:layout_marginBottom="5dp"
                android:src="@drawable/widget_bar" android:scaleType="fitXY" android:visibility="invisible" android:importantForAccessibility="no" />
        </FrameLayout>''')
    return ''.join(out)

def pill(idn, text):
    return f'''
        <FrameLayout android:id="@+id/{idn}" android:layout_width="0dp" android:layout_height="36dp" android:layout_weight="1">
            <ImageView android:id="@+id/{idn}_bg" android:layout_width="match_parent" android:layout_height="match_parent"
                android:src="@drawable/widget_pill" android:scaleType="fitXY" android:importantForAccessibility="no" />
            <TextView android:id="@+id/{idn}_text" android:layout_width="match_parent" android:layout_height="match_parent"
                android:gravity="center" android:maxLines="1" android:ellipsize="end" android:paddingLeft="8dp" android:paddingRight="8dp"
                android:textSize="12sp" android:fontFamily="@font/onest_bold" android:textColor="#F1F5F4" android:text="{text}" />
        </FrameLayout>'''

HEAD = lambda title: f'''
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical">
            <ImageView android:id="@+id/w_mark" android:layout_width="22dp" android:layout_height="14dp" android:src="@drawable/widget_mark_dark"
                android:scaleType="fitCenter" android:importantForAccessibility="no" />
            <TextView android:id="@+id/w_title" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1"
                android:layout_marginStart="7dp" android:maxLines="1" android:ellipsize="end"
                android:textSize="12sp" android:fontFamily="@font/onest_bold" android:textColor="#A2ADAA" android:text="{title}" />
        </LinearLayout>'''

ROOT_OPEN = lambda pad: f'''<?xml version="1.0" encoding="utf-8"?>
<!-- Сгенерировано tools/android/gen_widget_layouts.py -->
<FrameLayout {NS}
    android:id="@android:id/background"
    android:layout_width="match_parent" android:layout_height="match_parent"
    android:background="@drawable/widget_bg_dark" android:padding="{pad}">
    <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="vertical">'''
ROOT_CLOSE = '''
    </LinearLayout>
</FrameLayout>
'''

w('layout/widget_today.xml', ROOT_OPEN('14dp') + HEAD('Сегодня · пн, 9 ноября') + '''
        <FrameLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" />
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal" android:gravity="center_vertical">
            <ImageView android:id="@+id/w_dot" android:layout_width="10dp" android:layout_height="10dp" android:layout_marginEnd="7dp"
                android:src="@drawable/widget_dot" android:importantForAccessibility="no" />
            <TextView android:id="@+id/w_status" android:layout_width="0dp" android:layout_height="wrap_content" android:layout_weight="1"
                android:maxLines="1" android:ellipsize="end" android:textSize="19sp" android:fontFamily="@font/unbounded_bold"
                android:textColor="#F1F5F4" android:text="Кофейня" />
        </LinearLayout>
        <TextView android:id="@+id/w_sub" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="3dp"
            android:maxLines="1" android:ellipsize="end" android:textSize="12sp" android:fontFamily="@font/onest_medium"
            android:textColor="#A2ADAA" android:text="8 ч · 2 560 ₽" />
        <FrameLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" />
        <LinearLayout android:layout_width="match_parent" android:layout_height="wrap_content" android:orientation="horizontal">''' + pill('w_btn1', 'Смена') + '''
            <FrameLayout android:layout_width="6dp" android:layout_height="1dp" />''' + pill('w_btn2', 'Выходной') + '''
        </LinearLayout>''' + ROOT_CLOSE)

w('layout/widget_month.xml', ROOT_OPEN('16dp') + HEAD('Ноябрь · заработано') + '''
        <TextView android:id="@+id/w_total" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="6dp"
            android:maxLines="1" android:ellipsize="end" android:textSize="28sp" android:fontFamily="@font/unbounded_bold"
            android:textColor="#F1F5F4" android:text="15 320 ₽" />
        <TextView android:id="@+id/w_meta" android:layout_width="match_parent" android:layout_height="wrap_content" android:layout_marginTop="2dp"
            android:maxLines="1" android:ellipsize="end" android:textSize="12sp" android:fontFamily="@font/onest_medium"
            android:textColor="#A2ADAA" android:text="5 смен · 52 ч" />
        <FrameLayout android:layout_width="match_parent" android:layout_height="0dp" android:layout_weight="1" android:minHeight="8dp" />
        <LinearLayout android:layout_width="match_parent" android:layout_height="58dp" android:orientation="horizontal">''' + day_cells('m', names=True) + '''
        </LinearLayout>''' + ROOT_CLOSE)

w('layout/widget_week.xml', ROOT_OPEN('8dp') + '''
        <LinearLayout android:layout_width="match_parent" android:layout_height="match_parent" android:orientation="horizontal">''' + day_cells('k') + '''
        </LinearLayout>''' + ROOT_CLOSE)

# drawables
w('drawable/widget_bg_dark.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <gradient android:angle="270" android:startColor="#F2171B1D" android:endColor="#F20E1113" />
    <stroke android:width="1dp" android:color="#1FFFFFFF" />
    <corners android:radius="24dp" />
</shape>
''')
w('drawable/widget_bg_light.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#F7FFFFFF" />
    <stroke android:width="1dp" android:color="#140C201B" />
    <corners android:radius="24dp" />
</shape>
''')
for name, rad in [('widget_cell', '10dp'), ('widget_pill', '18dp')]:
    w(f'drawable/{name}.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
    <solid android:color="#FFFFFFFF" />
    <corners android:radius="{rad}" />
</shape>
''')
w('drawable/widget_cell_ring.xml', f'''<?xml version="1.0" encoding="utf-8"?>
<shape {NS} android:shape="rectangle">
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
# brand mark: line + ball (same geometry as tools/brand/mark.mjs), light and dark variants
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

# provider info
for name, mw, mh, cw, ch, desc in [('today', 110, 110, 2, 2, 'widget_today_desc'), ('month', 250, 110, 4, 2, 'widget_month_desc'), ('week', 250, 50, 4, 1, 'widget_week_desc')]:
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
