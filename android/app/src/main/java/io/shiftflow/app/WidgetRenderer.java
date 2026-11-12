package io.shiftflow.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.content.res.Configuration;
import android.graphics.Color;
import android.net.Uri;
import android.os.Build;
import android.os.Bundle;
import android.util.SizeF;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.Calendar;
import java.util.HashMap;
import java.util.Locale;
import java.util.Map;
import java.util.regex.Pattern;

/**
 * Отрисовка трёх виджетов: «Сегодня» (смена и кнопка «Открыть»), «Месяц» (календарь, по высоте —
 * от одной недели до всего месяца) и «Неделя» (семь дней с названиями смен).
 * Цвета берутся из снимка приложения: тема, оттенок фона и акцент — как в самом приложении.
 */
final class WidgetRenderer {
    private static final Pattern HEX = Pattern.compile("^#[0-9A-Fa-f]{6}$");
    /** Высота виджета «Месяц» (dp), начиная с которой помещается 1…6 недель. */
    private static final int[] MONTH_ROW_HEIGHTS = {0, 99, 135, 171, 207, 243, 279};

    private WidgetRenderer() {}

    /** Палитра виджета в цветах приложения. */
    private static final class Theme {
        boolean light;
        int bg, cell, off, text, text2, text3, red, accent, onAccent, todayNum, edge, edgeAlpha;
    }

    private static Theme theme(JSONObject snap) {
        Theme t = new Theme();
        t.light = snap != null && snap.optBoolean("light", false);
        t.accent = color(snap == null ? null : snap.optString("accent"), 0xFF3DDCB0);
        JSONObject pal = snap == null ? null : snap.optJSONObject("pal");
        if (t.light) {
            t.text = 0xFF1F1D1A; t.text2 = 0xFF5E5A50; t.text3 = 0xFF8D887A; t.red = 0xFFC8402C;
            t.bg = color(pal == null ? null : pal.optString("bg"), 0xFFF9F6EE);
            t.cell = color(pal == null ? null : pal.optString("cell"), 0xFFECE7DA);
            t.edge = 0xFF000000; t.edgeAlpha = 150;   // обводка в макете — 14% непрозрачности, здесь ещё ослабляем
            t.todayNum = mix(t.accent, 0xFF000000, .62f);
        } else {
            t.text = 0xFFECE7DA; t.text2 = 0xFFABA699; t.text3 = 0xFF79756B; t.red = 0xFFF2755F;
            t.bg = color(pal == null ? null : pal.optString("bg"), 0xFF16181A);
            t.cell = color(pal == null ? null : pal.optString("cell"), 0xFF25272A);
            t.edge = 0xFFFFFFFF; t.edgeAlpha = 255;
            t.todayNum = mix(t.accent, 0xFFFFFFFF, .5f);
        }
        t.off = mix(t.text3, t.cell, t.light ? .10f : .12f);
        double l = luminance(t.accent);
        t.onAccent = (1.05 / (l + .05)) > ((l + .05) / 0.055) ? 0xFFFFFFFF : 0xFF05110D;
        return t;
    }

    static int color(String hex, int fallback) {
        if (hex == null || !HEX.matcher(hex).matches()) return fallback;
        return Color.parseColor(hex);
    }

    private static double luminance(int c) {
        double[] v = {Color.red(c) / 255.0, Color.green(c) / 255.0, Color.blue(c) / 255.0};
        for (int i = 0; i < 3; i++) v[i] = v[i] <= 0.03928 ? v[i] / 12.92 : Math.pow((v[i] + 0.055) / 1.055, 2.4);
        return 0.2126 * v[0] + 0.7152 * v[1] + 0.0722 * v[2];
    }

    /** Смешивает цвет a поверх b с долей t. */
    private static int mix(int a, int b, float t) {
        return Color.rgb(
                Math.round(Color.red(a) * t + Color.red(b) * (1 - t)),
                Math.round(Color.green(a) * t + Color.green(b) * (1 - t)),
                Math.round(Color.blue(a) * t + Color.blue(b) * (1 - t)));
    }

    // ───────────── Обновление ─────────────

    static void updateAll(Context c) {
        AppWidgetManager m = AppWidgetManager.getInstance(c);
        JSONObject snap = WidgetStore.snapshot(c);
        update(c, m, snap, TodayWidget.class);
        update(c, m, snap, MonthWidget.class);
        update(c, m, snap, WeekWidget.class);
    }

    private static void update(Context c, AppWidgetManager m, JSONObject snap, Class<?> cls) {
        int[] ids = m.getAppWidgetIds(new ComponentName(c, cls));
        for (int id : ids) m.updateAppWidget(id, build(c, snap, cls, id));
    }

    static RemoteViews build(Context c, JSONObject snap, Class<?> cls, int widgetId) {
        if (cls == TodayWidget.class) return today(c, snap, widgetId);
        if (cls == MonthWidget.class) return monthResponsive(c, snap, widgetId);
        return week(c, snap, widgetId);
    }

    // ───────────── Интенты ─────────────

    private static PendingIntent openApp(Context c, String day, int rc) {
        Intent i = new Intent(c, MainActivity.class)
                .setAction(Intent.ACTION_VIEW)
                .setData(Uri.parse("shiftflow://day/" + (day == null ? "" : day) + "?rc=" + rc))
                .addFlags(Intent.FLAG_ACTIVITY_NEW_TASK | Intent.FLAG_ACTIVITY_CLEAR_TOP);
        if (day != null) i.putExtra(MainActivity.EXTRA_DAY, day);
        return PendingIntent.getActivity(c, rc, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // ───────────── Общие детали ─────────────

    /** Фон и обводка в цветах темы и выбранного оттенка фона. */
    private static void base(RemoteViews v, Theme th) {
        v.setInt(R.id.w_bg, "setColorFilter", th.bg);
        v.setInt(R.id.w_edge, "setColorFilter", th.edge);
        v.setInt(R.id.w_edge, "setImageAlpha", th.edgeAlpha);
    }

    private static void head(RemoteViews v, Theme th, String title) {
        v.setImageViewResource(R.id.w_mark, th.light ? R.drawable.widget_mark_light : R.drawable.widget_mark_dark);
        v.setTextViewText(R.id.w_title, title);
        v.setTextColor(R.id.w_title, th.text2);
    }

    private static String str(JSONObject L, String key, String fallback) {
        if (L == null) return fallback;
        String s = L.optString(key, fallback);
        return s.isEmpty() ? fallback : s;
    }

    private static String arr(JSONObject L, String key, int idx, String fallback) {
        JSONArray a = L == null ? null : L.optJSONArray(key);
        if (a == null || idx < 0 || idx >= a.length()) return fallback;
        return a.optString(idx, fallback);
    }

    private static boolean ru(JSONObject snap) {
        return snap == null || !"en".equals(snap.optString("lang"));
    }

    private static String money(JSONObject snap, double v, String cur) {
        NumberFormat f = NumberFormat.getIntegerInstance(ru(snap) ? new Locale("ru", "RU") : Locale.US);
        f.setGroupingUsed(true);
        return f.format(Math.round(v)) + " " + (cur == null || cur.isEmpty() ? "₽" : cur);
    }

    private static String hours(double h) {
        if (Math.abs(h - Math.round(h)) < 0.01) return String.valueOf(Math.round(h));
        return String.format(Locale.US, "%.1f", h);
    }

    private static String plural(JSONObject snap, double n, JSONArray forms) {
        if (forms == null || forms.length() < 3) return "";
        if (!ru(snap)) return Math.abs(n) == 1 ? forms.optString(0) : forms.optString(1);
        long a = Math.abs(Math.round(n)) % 100, b = a % 10;
        if (a > 10 && a < 20) return forms.optString(2);
        if (b > 1 && b < 5) return forms.optString(1);
        if (b == 1) return forms.optString(0);
        return forms.optString(2);
    }

    private static int dowMonday(Calendar cal) {
        return (cal.get(Calendar.DAY_OF_WEEK) + 5) % 7;   // 0 = понедельник
    }

    /** «12 ноября» / «November 12». */
    private static String dayMonth(JSONObject snap, JSONObject L, Calendar d) {
        String m = arr(L, "monthsGen", d.get(Calendar.MONTH), "");
        return ru(snap) ? d.get(Calendar.DAY_OF_MONTH) + " " + m : m + " " + d.get(Calendar.DAY_OF_MONTH);
    }

    /** Сколько смен в дне (в снимке v3 — массив ws; в старом снимке — одна). */
    private static int shiftCount(JSONObject day) {
        JSONArray ws = day == null ? null : day.optJSONArray("ws");
        return ws != null && ws.length() > 0 ? ws.length() : (day != null && day.has("w") ? 1 : 0);
    }

    /** «Кофейня + Склад» для заголовка: все места работы дня (без повторов), по полному названию. */
    private static String dayNames(JSONObject snap, JSONObject day) {
        JSONArray ws = day.optJSONArray("ws");
        if (ws == null || ws.length() < 2) {
            JSONObject wp = WidgetStore.findWorkplace(snap, day.optString("w"));
            return wp == null ? "" : wpName(wp, false);
        }
        StringBuilder sb = new StringBuilder();
        java.util.HashSet<String> seen = new java.util.HashSet<>();
        for (int i = 0; i < ws.length(); i++) {
            String id = ws.optString(i);
            if (!seen.add(id)) continue;
            JSONObject wp = WidgetStore.findWorkplace(snap, id);
            if (wp == null) continue;
            if (sb.length() > 0) sb.append(" + ");
            sb.append(wpName(wp, false));
        }
        return sb.toString();
    }

    private static String wpName(JSONObject wp, boolean shortName) {
        String n = wp.optString("n");
        String s = wp.optString("s");
        if (shortName) return s.isEmpty() ? n : s;
        return n.isEmpty() ? s : n;
    }

    // ───────────── «Сегодня» ─────────────

    private static RemoteViews today(Context c, JSONObject snap, int widgetId) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_today);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        String today = WidgetStore.key(now);
        int rc = widgetId * 64;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, today, rc));
        v.setOnClickPendingIntent(R.id.w_open, openApp(c, today, rc + 1));
        v.setInt(R.id.w_open_bg, "setColorFilter", th.accent);
        v.setTextColor(R.id.w_open_text, th.onAccent);
        v.setTextColor(R.id.w_status, th.text);
        v.setTextColor(R.id.w_sub, th.text2);
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        v.setTextViewText(R.id.w_open_text, str(L, "open", c.getString(R.string.widget_open)));

        if (snap == null) {
            head(v, th, "ShiftFlow");
            v.setTextViewText(R.id.w_status, c.getString(R.string.widget_open_app));
            v.setInt(R.id.w_dot, "setColorFilter", th.accent);
            v.setViewVisibility(R.id.w_sub, View.GONE);
            return v;
        }
        // «Вторник, 10 ноября» — короткий заголовок помещается и в виджет 2×2
        String wdl = arr(L, "wdl", now.get(Calendar.DAY_OF_WEEK) - 1, "");
        if (!wdl.isEmpty()) wdl = wdl.substring(0, 1).toUpperCase(ru(snap) ? new Locale("ru", "RU") : Locale.US) + wdl.substring(1);
        head(v, th, (wdl.isEmpty() ? str(L, "today", "Сегодня") : wdl) + ", " + dayMonth(snap, L, now));

        JSONObject days = snap.optJSONObject("days");
        JSONObject d = days == null ? null : days.optJSONObject(today);
        JSONObject wp = d != null && d.has("w") ? WidgetStore.findWorkplace(snap, d.optString("w")) : null;
        String sub;
        if (wp != null) {
            v.setTextViewText(R.id.w_status, dayNames(snap, d));
            v.setInt(R.id.w_dot, "setColorFilter", color(wp.optString("c"), th.accent));
            int n = shiftCount(d);
            sub = (n > 1 ? n + " " + plural(snap, n, L == null ? null : L.optJSONArray("shifts")) + " · " : "")
                    + hours(d.optDouble("h", 0)) + " " + str(L, "h", "ч") + " · "
                    + money(snap, d.optDouble("p", 0), wp.optString("cur", snap.optString("cur")));
        } else {
            boolean off = d != null && d.has("o");
            v.setTextViewText(R.id.w_status, off ? str(L, "off", "Выходной") : str(L, "none", "Не отмечено"));
            v.setInt(R.id.w_dot, "setColorFilter", off ? th.text3 : mix(th.accent, th.text3, .5f));
            sub = nextShift(snap, L, days, now);
        }
        v.setTextViewText(R.id.w_sub, sub);
        v.setViewVisibility(R.id.w_sub, sub.isEmpty() ? View.GONE : View.VISIBLE);
        return v;
    }

    /** «Следующая смена: чт, 12 ноября · Кофейня» — ближайшая смена в пределах снимка. */
    private static String nextShift(JSONObject snap, JSONObject L, JSONObject days, Calendar now) {
        if (days == null) return "";
        Calendar d = (Calendar) now.clone();
        for (int i = 0; i < 45; i++) {
            d.add(Calendar.DAY_OF_MONTH, 1);
            JSONObject day = days.optJSONObject(WidgetStore.key(d));
            if (day == null || !day.has("w")) continue;
            JSONObject wp = WidgetStore.findWorkplace(snap, day.optString("w"));
            if (wp == null) continue;
            String wd = arr(L, "wd", dowMonday(d), "").toLowerCase(ru(snap) ? new Locale("ru", "RU") : Locale.US);
            return str(L, "next", "Следующая смена") + ": " + (wd.isEmpty() ? "" : wd + ", ") + dayMonth(snap, L, d) + " · " + dayNames(snap, day);
        }
        return "";
    }

    // ───────────── Клетка дня ─────────────

    /** Ид-ы клетки: корень, фон, рамка, день недели (0 — нет), число, полоска, название. */
    private static void paintCell(Context c, RemoteViews v, int[] r, JSONObject snap, Theme th, Calendar d,
                                  String today, boolean inMonth, int rc) {
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        JSONObject days = snap == null ? null : snap.optJSONObject("days");
        String k = WidgetStore.key(d);
        JSONObject day = days == null ? null : days.optJSONObject(k);
        JSONObject wp = day != null && day.has("w") ? WidgetStore.findWorkplace(snap, day.optString("w")) : null;
        boolean off = wp == null && day != null && day.has("o");
        boolean isToday = k.equals(today);
        int wc = wp != null ? color(wp.optString("c"), th.accent) : th.accent;

        boolean weekend = dowMonday(d) >= 5;
        int cellColor = th.cell, numColor = weekend ? th.red : th.text;
        if (wp != null) cellColor = mix(wc, th.cell, th.light ? .22f : .30f);
        else if (off) { cellColor = th.off; numColor = weekend ? mix(th.red, th.text3, .6f) : th.text3; }
        else if (isToday) cellColor = mix(th.accent, th.cell, th.light ? .10f : .14f);
        if (isToday) numColor = th.todayNum;
        if (!inMonth) {
            cellColor = mix(cellColor, th.bg, .45f);
            numColor = th.text3;
        }
        v.setInt(r[1], "setColorFilter", cellColor);
        v.setTextViewText(r[4], String.valueOf(d.get(Calendar.DAY_OF_MONTH)));
        v.setTextColor(r[4], numColor);

        int n = shiftCount(day);
        String name = wp != null ? wpName(wp, true) + (n > 1 ? " +" + (n - 1) : "") : (off ? str(L, "offShort", "вых") : "");
        v.setTextViewText(r[6], name);
        v.setTextColor(r[6], wp != null ? (inMonth ? mix(wc, th.text, th.light ? .78f : .6f) : th.text3) : th.text3);

        if (wp != null || off) {
            v.setViewVisibility(r[5], View.VISIBLE);
            v.setInt(r[5], "setColorFilter", wp != null ? wc : th.text3);
            v.setInt(r[5], "setImageAlpha", inMonth ? 255 : 110);
        } else {
            v.setViewVisibility(r[5], View.INVISIBLE);
        }
        if (isToday) {
            v.setViewVisibility(r[2], View.VISIBLE);
            v.setInt(r[2], "setColorFilter", th.accent);
        } else {
            v.setViewVisibility(r[2], View.GONE);
        }
        v.setOnClickPendingIntent(r[0], openApp(c, k, rc));
    }

    private static int weekdayColor(Theme th, int i) {
        return i >= 5 ? th.red : th.text3;
    }

    // ───────────── «Неделя» ─────────────

    private static final int[][] K_IDS = {
            {R.id.k0, R.id.k0_bg, R.id.k0_ring, R.id.k0_wd, R.id.k0_num, R.id.k0_bar, R.id.k0_nm},
            {R.id.k1, R.id.k1_bg, R.id.k1_ring, R.id.k1_wd, R.id.k1_num, R.id.k1_bar, R.id.k1_nm},
            {R.id.k2, R.id.k2_bg, R.id.k2_ring, R.id.k2_wd, R.id.k2_num, R.id.k2_bar, R.id.k2_nm},
            {R.id.k3, R.id.k3_bg, R.id.k3_ring, R.id.k3_wd, R.id.k3_num, R.id.k3_bar, R.id.k3_nm},
            {R.id.k4, R.id.k4_bg, R.id.k4_ring, R.id.k4_wd, R.id.k4_num, R.id.k4_bar, R.id.k4_nm},
            {R.id.k5, R.id.k5_bg, R.id.k5_ring, R.id.k5_wd, R.id.k5_num, R.id.k5_bar, R.id.k5_nm},
            {R.id.k6, R.id.k6_bg, R.id.k6_ring, R.id.k6_wd, R.id.k6_num, R.id.k6_bar, R.id.k6_nm}};

    private static final String[] WD_FALLBACK = {"ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"};

    private static RemoteViews week(Context c, JSONObject snap, int widgetId) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_week);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        String today = WidgetStore.key(now);
        int rc = widgetId * 64;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, today, rc));
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        Calendar d = (Calendar) now.clone();
        d.add(Calendar.DAY_OF_MONTH, -dowMonday(now));
        for (int i = 0; i < 7; i++) {
            int[] r = K_IDS[i];
            v.setTextViewText(r[3], arr(L, "wd", i, WD_FALLBACK[i]));
            v.setTextColor(r[3], weekdayColor(th, i));
            paintCell(c, v, r, snap, th, d, today, true, rc + 8 + i);
            d.add(Calendar.DAY_OF_MONTH, 1);
        }
        return v;
    }

    // ───────────── «Месяц» ─────────────

    private static final int[] ROWS = {R.id.r0, R.id.r1, R.id.r2, R.id.r3, R.id.r4, R.id.r5};
    private static final int[] HEADS = {R.id.h0, R.id.h1, R.id.h2, R.id.h3, R.id.h4, R.id.h5, R.id.h6};
    private static final int[][][] D_IDS = {
            {{R.id.d00, R.id.d00_bg, R.id.d00_ring, 0, R.id.d00_num, R.id.d00_bar, R.id.d00_nm}, {R.id.d01, R.id.d01_bg, R.id.d01_ring, 0, R.id.d01_num, R.id.d01_bar, R.id.d01_nm},
             {R.id.d02, R.id.d02_bg, R.id.d02_ring, 0, R.id.d02_num, R.id.d02_bar, R.id.d02_nm}, {R.id.d03, R.id.d03_bg, R.id.d03_ring, 0, R.id.d03_num, R.id.d03_bar, R.id.d03_nm},
             {R.id.d04, R.id.d04_bg, R.id.d04_ring, 0, R.id.d04_num, R.id.d04_bar, R.id.d04_nm}, {R.id.d05, R.id.d05_bg, R.id.d05_ring, 0, R.id.d05_num, R.id.d05_bar, R.id.d05_nm},
             {R.id.d06, R.id.d06_bg, R.id.d06_ring, 0, R.id.d06_num, R.id.d06_bar, R.id.d06_nm}},
            {{R.id.d10, R.id.d10_bg, R.id.d10_ring, 0, R.id.d10_num, R.id.d10_bar, R.id.d10_nm}, {R.id.d11, R.id.d11_bg, R.id.d11_ring, 0, R.id.d11_num, R.id.d11_bar, R.id.d11_nm},
             {R.id.d12, R.id.d12_bg, R.id.d12_ring, 0, R.id.d12_num, R.id.d12_bar, R.id.d12_nm}, {R.id.d13, R.id.d13_bg, R.id.d13_ring, 0, R.id.d13_num, R.id.d13_bar, R.id.d13_nm},
             {R.id.d14, R.id.d14_bg, R.id.d14_ring, 0, R.id.d14_num, R.id.d14_bar, R.id.d14_nm}, {R.id.d15, R.id.d15_bg, R.id.d15_ring, 0, R.id.d15_num, R.id.d15_bar, R.id.d15_nm},
             {R.id.d16, R.id.d16_bg, R.id.d16_ring, 0, R.id.d16_num, R.id.d16_bar, R.id.d16_nm}},
            {{R.id.d20, R.id.d20_bg, R.id.d20_ring, 0, R.id.d20_num, R.id.d20_bar, R.id.d20_nm}, {R.id.d21, R.id.d21_bg, R.id.d21_ring, 0, R.id.d21_num, R.id.d21_bar, R.id.d21_nm},
             {R.id.d22, R.id.d22_bg, R.id.d22_ring, 0, R.id.d22_num, R.id.d22_bar, R.id.d22_nm}, {R.id.d23, R.id.d23_bg, R.id.d23_ring, 0, R.id.d23_num, R.id.d23_bar, R.id.d23_nm},
             {R.id.d24, R.id.d24_bg, R.id.d24_ring, 0, R.id.d24_num, R.id.d24_bar, R.id.d24_nm}, {R.id.d25, R.id.d25_bg, R.id.d25_ring, 0, R.id.d25_num, R.id.d25_bar, R.id.d25_nm},
             {R.id.d26, R.id.d26_bg, R.id.d26_ring, 0, R.id.d26_num, R.id.d26_bar, R.id.d26_nm}},
            {{R.id.d30, R.id.d30_bg, R.id.d30_ring, 0, R.id.d30_num, R.id.d30_bar, R.id.d30_nm}, {R.id.d31, R.id.d31_bg, R.id.d31_ring, 0, R.id.d31_num, R.id.d31_bar, R.id.d31_nm},
             {R.id.d32, R.id.d32_bg, R.id.d32_ring, 0, R.id.d32_num, R.id.d32_bar, R.id.d32_nm}, {R.id.d33, R.id.d33_bg, R.id.d33_ring, 0, R.id.d33_num, R.id.d33_bar, R.id.d33_nm},
             {R.id.d34, R.id.d34_bg, R.id.d34_ring, 0, R.id.d34_num, R.id.d34_bar, R.id.d34_nm}, {R.id.d35, R.id.d35_bg, R.id.d35_ring, 0, R.id.d35_num, R.id.d35_bar, R.id.d35_nm},
             {R.id.d36, R.id.d36_bg, R.id.d36_ring, 0, R.id.d36_num, R.id.d36_bar, R.id.d36_nm}},
            {{R.id.d40, R.id.d40_bg, R.id.d40_ring, 0, R.id.d40_num, R.id.d40_bar, R.id.d40_nm}, {R.id.d41, R.id.d41_bg, R.id.d41_ring, 0, R.id.d41_num, R.id.d41_bar, R.id.d41_nm},
             {R.id.d42, R.id.d42_bg, R.id.d42_ring, 0, R.id.d42_num, R.id.d42_bar, R.id.d42_nm}, {R.id.d43, R.id.d43_bg, R.id.d43_ring, 0, R.id.d43_num, R.id.d43_bar, R.id.d43_nm},
             {R.id.d44, R.id.d44_bg, R.id.d44_ring, 0, R.id.d44_num, R.id.d44_bar, R.id.d44_nm}, {R.id.d45, R.id.d45_bg, R.id.d45_ring, 0, R.id.d45_num, R.id.d45_bar, R.id.d45_nm},
             {R.id.d46, R.id.d46_bg, R.id.d46_ring, 0, R.id.d46_num, R.id.d46_bar, R.id.d46_nm}},
            {{R.id.d50, R.id.d50_bg, R.id.d50_ring, 0, R.id.d50_num, R.id.d50_bar, R.id.d50_nm}, {R.id.d51, R.id.d51_bg, R.id.d51_ring, 0, R.id.d51_num, R.id.d51_bar, R.id.d51_nm},
             {R.id.d52, R.id.d52_bg, R.id.d52_ring, 0, R.id.d52_num, R.id.d52_bar, R.id.d52_nm}, {R.id.d53, R.id.d53_bg, R.id.d53_ring, 0, R.id.d53_num, R.id.d53_bar, R.id.d53_nm},
             {R.id.d54, R.id.d54_bg, R.id.d54_ring, 0, R.id.d54_num, R.id.d54_bar, R.id.d54_nm}, {R.id.d55, R.id.d55_bg, R.id.d55_ring, 0, R.id.d55_num, R.id.d55_bar, R.id.d55_nm},
             {R.id.d56, R.id.d56_bg, R.id.d56_ring, 0, R.id.d56_num, R.id.d56_bar, R.id.d56_nm}}};

    /**
     * На Android 12+ лаунчер сам выбирает вариант под размер виджета (от 1 до 6 недель),
     * на старых версиях число недель считается по текущей высоте из настроек виджета.
     */
    private static RemoteViews monthResponsive(Context c, JSONObject snap, int widgetId) {
        if (Build.VERSION.SDK_INT >= 31) {
            Map<SizeF, RemoteViews> variants = new HashMap<>();
            for (int rows = 1; rows <= 6; rows++) {
                variants.put(new SizeF(160f, MONTH_ROW_HEIGHTS[rows]), month(c, snap, widgetId, rows));
            }
            return new RemoteViews(variants);
        }
        return month(c, snap, widgetId, rowsFor(c, widgetId));
    }

    private static int rowsFor(Context c, int widgetId) {
        Bundle o = AppWidgetManager.getInstance(c).getAppWidgetOptions(widgetId);
        boolean portrait = c.getResources().getConfiguration().orientation != Configuration.ORIENTATION_LANDSCAPE;
        int h = o == null ? 0 : o.getInt(portrait ? AppWidgetManager.OPTION_APPWIDGET_MAX_HEIGHT : AppWidgetManager.OPTION_APPWIDGET_MIN_HEIGHT, 0);
        if (h <= 0) return 3;
        int rows = 1;
        for (int r = 1; r <= 6; r++) if (h >= MONTH_ROW_HEIGHTS[r]) rows = r;
        return rows;
    }

    private static RemoteViews month(Context c, JSONObject snap, int widgetId, int rows) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_month);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        String today = WidgetStore.key(now);
        int rc = widgetId * 64;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, today, rc));
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        String monthName = arr(L, "months", now.get(Calendar.MONTH), "");
        head(v, th, (monthName.isEmpty() ? "ShiftFlow" : monthName + " " + now.get(Calendar.YEAR)));
        for (int i = 0; i < 7; i++) {
            v.setTextViewText(HEADS[i], arr(L, "wd", i, WD_FALLBACK[i]));
            v.setTextColor(HEADS[i], weekdayColor(th, i));
        }

        // Недели текущего месяца (неделя — с понедельника) и окно из rows недель вокруг текущей
        Calendar first = (Calendar) now.clone();
        first.set(Calendar.DAY_OF_MONTH, 1);
        int lead = dowMonday(first);
        int dim = now.getActualMaximum(Calendar.DAY_OF_MONTH);
        int monthWeeks = (lead + dim + 6) / 7;
        int curWeek = (lead + now.get(Calendar.DAY_OF_MONTH) - 1) / 7;
        int show = Math.max(1, Math.min(Math.min(rows, 6), monthWeeks));
        int start = Math.max(0, Math.min(curWeek, monthWeeks - show));

        Calendar d = (Calendar) first.clone();
        d.add(Calendar.DAY_OF_MONTH, start * 7 - lead);
        int month = now.get(Calendar.MONTH);
        for (int row = 0; row < 6; row++) {
            if (row >= show) {
                v.setViewVisibility(ROWS[row], View.GONE);
                continue;
            }
            v.setViewVisibility(ROWS[row], View.VISIBLE);
            for (int col = 0; col < 7; col++) {
                paintCell(c, v, D_IDS[row][col], snap, th, d, today, d.get(Calendar.MONTH) == month, rc + 8 + row * 7 + col);
                d.add(Calendar.DAY_OF_MONTH, 1);
            }
        }
        return v;
    }
}
