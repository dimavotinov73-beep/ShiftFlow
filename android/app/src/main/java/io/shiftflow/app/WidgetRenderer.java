package io.shiftflow.app;

import android.app.PendingIntent;
import android.appwidget.AppWidgetManager;
import android.content.ComponentName;
import android.content.Context;
import android.content.Intent;
import android.graphics.Color;
import android.net.Uri;
import android.view.View;
import android.widget.RemoteViews;

import org.json.JSONArray;
import org.json.JSONObject;

import java.text.NumberFormat;
import java.util.Calendar;
import java.util.Iterator;
import java.util.Locale;
import java.util.regex.Pattern;

/** Отрисовка трёх виджетов: «Сегодня» (с кнопками), «Месяц» (сумма и неделя) и «Неделя». */
final class WidgetRenderer {
    private static final Pattern HEX = Pattern.compile("^#[0-9A-Fa-f]{6}$");

    private WidgetRenderer() {}

    /** Палитра виджета в цветах приложения (тёмная или светлая тема и акцент пользователя). */
    private static final class Theme {
        boolean light;
        int text, text2, text3, cell, off, accent, onAccent;
    }

    private static Theme theme(JSONObject snap) {
        Theme t = new Theme();
        t.light = snap != null && snap.optBoolean("light", false);
        t.accent = color(snap == null ? null : snap.optString("accent"), 0xFF3DDCB0);
        if (t.light) {
            t.text = 0xFF0E1513; t.text2 = 0xFF55615D; t.text3 = 0xFF8B9592; t.cell = 0xFFF0F3F2; t.off = 0xFFE4E9E7;
        } else {
            t.text = 0xFFF1F5F4; t.text2 = 0xFFA2ADAA; t.text3 = 0xFF68726F; t.cell = 0xFF1C2124; t.off = 0xFF242A2D;
        }
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

    // ───────────── Обновление всех виджетов ─────────────

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
        if (cls == MonthWidget.class) return month(c, snap, widgetId);
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

    private static PendingIntent action(Context c, String op, String day, String wp, int rc) {
        Intent i = new Intent(c, WidgetActionReceiver.class)
                .setAction(WidgetActionReceiver.ACTION)
                .setData(Uri.parse("shiftflow://op/" + op + "/" + day + "?rc=" + rc))
                .putExtra(WidgetActionReceiver.EXTRA_OP, op)
                .putExtra(WidgetActionReceiver.EXTRA_DAY, day)
                .putExtra(WidgetActionReceiver.EXTRA_WP, wp == null ? "" : wp);
        return PendingIntent.getBroadcast(c, rc, i, PendingIntent.FLAG_UPDATE_CURRENT | PendingIntent.FLAG_IMMUTABLE);
    }

    // ───────────── Общие детали ─────────────

    private static void base(RemoteViews v, Theme th) {
        v.setInt(android.R.id.background, "setBackgroundResource", th.light ? R.drawable.widget_bg_light : R.drawable.widget_bg_dark);
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
        if (Math.round(n) != n) return forms.optString(1);
        if (a > 10 && a < 20) return forms.optString(2);
        if (b > 1 && b < 5) return forms.optString(1);
        if (b == 1) return forms.optString(0);
        return forms.optString(2);
    }

    private static int dowMonday(Calendar cal) {
        return (cal.get(Calendar.DAY_OF_WEEK) + 5) % 7;   // 0 = понедельник
    }

    // ───────────── «Сегодня» ─────────────

    private static RemoteViews today(Context c, JSONObject snap, int widgetId) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_today);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        String today = WidgetStore.key(now);
        int rc = widgetId * 16;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, today, rc));
        v.setTextColor(R.id.w_status, th.text);
        v.setTextColor(R.id.w_sub, th.text2);

        if (snap == null) {
            head(v, th, "ShiftFlow");
            v.setTextViewText(R.id.w_status, c.getString(R.string.widget_open_app));
            v.setTextViewText(R.id.w_sub, "");
            v.setInt(R.id.w_dot, "setColorFilter", th.accent);
            v.setViewVisibility(R.id.w_btn1, View.GONE);
            v.setViewVisibility(R.id.w_btn2, View.GONE);
            return v;
        }
        JSONObject L = snap.optJSONObject("L");
        String title = str(L, "today", "Сегодня") + " · "
                + arr(L, "wdl", now.get(Calendar.DAY_OF_WEEK) - 1, "") + ", "
                + (ru(snap) ? now.get(Calendar.DAY_OF_MONTH) + " " + arr(L, "monthsGen", now.get(Calendar.MONTH), "")
                            : arr(L, "monthsGen", now.get(Calendar.MONTH), "") + " " + now.get(Calendar.DAY_OF_MONTH));
        head(v, th, title);

        JSONObject days = snap.optJSONObject("days");
        JSONObject d = days == null ? null : days.optJSONObject(today);
        JSONObject wp = d != null && d.has("w") ? WidgetStore.findWorkplace(snap, d.optString("w")) : null;
        String quick = snap.optString("quick", "");
        JSONObject quickWp = WidgetStore.findWorkplace(snap, quick);

        v.setViewVisibility(R.id.w_btn1, View.VISIBLE);
        v.setViewVisibility(R.id.w_btn2, View.VISIBLE);
        if (wp != null || (d != null && d.has("o"))) {
            if (wp != null) {
                v.setTextViewText(R.id.w_status, wp.optString("s", wp.optString("n")));
                v.setInt(R.id.w_dot, "setColorFilter", color(wp.optString("c"), th.accent));
                v.setTextViewText(R.id.w_sub, hours(d.optDouble("h", 0)) + " " + str(L, "h", "ч") + " · " + money(snap, d.optDouble("p", 0), wp.optString("cur", snap.optString("cur"))));
            } else {
                v.setTextViewText(R.id.w_status, str(L, "off", "Выходной"));
                v.setInt(R.id.w_dot, "setColorFilter", th.text3);
                v.setTextViewText(R.id.w_sub, "");
            }
            pill(v, R.id.w_btn1_bg, R.id.w_btn1_text, str(L, "reset", "Сбросить"), th.cell, th.text);
            v.setOnClickPendingIntent(R.id.w_btn1, action(c, "clear", today, null, rc + 1));
            pill(v, R.id.w_btn2_bg, R.id.w_btn2_text, str(L, "open", "Открыть"), th.accent, th.onAccent);
            v.setOnClickPendingIntent(R.id.w_btn2, openApp(c, today, rc + 2));
        } else {
            v.setTextViewText(R.id.w_status, str(L, "none", "Не отмечено"));
            v.setInt(R.id.w_dot, "setColorFilter", th.text3);
            if (quickWp != null) {
                v.setTextViewText(R.id.w_sub, quickWp.optString("n"));
                pill(v, R.id.w_btn1_bg, R.id.w_btn1_text, quickWp.optString("s", str(L, "shift", "Смена")), th.accent, th.onAccent);
                v.setOnClickPendingIntent(R.id.w_btn1, action(c, "shift", today, quick, rc + 3));
            } else {
                v.setTextViewText(R.id.w_sub, str(L, "addPlace", ""));
                pill(v, R.id.w_btn1_bg, R.id.w_btn1_text, str(L, "open", "Открыть"), th.accent, th.onAccent);
                v.setOnClickPendingIntent(R.id.w_btn1, openApp(c, today, rc + 4));
            }
            pill(v, R.id.w_btn2_bg, R.id.w_btn2_text, str(L, "off", "Выходной"), th.cell, th.text);
            v.setOnClickPendingIntent(R.id.w_btn2, action(c, "off", today, null, rc + 5));
        }
        return v;
    }

    private static void pill(RemoteViews v, int bg, int text, String label, int bgColor, int textColor) {
        v.setInt(bg, "setColorFilter", bgColor);
        v.setTextViewText(text, label);
        v.setTextColor(text, textColor);
    }

    // ───────────── «Месяц» ─────────────

    private static RemoteViews month(Context c, JSONObject snap, int widgetId) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_month);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        int rc = widgetId * 16;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, WidgetStore.key(now), rc));
        v.setTextColor(R.id.w_total, th.text);
        v.setTextColor(R.id.w_meta, th.text2);
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        head(v, th, (snap == null ? "ShiftFlow" : arr(L, "months", now.get(Calendar.MONTH), "") + " · " + str(L, "earned", "заработано")));
        if (snap == null) {
            v.setTextViewText(R.id.w_total, "—");
            v.setTextViewText(R.id.w_meta, c.getString(R.string.widget_open_app));
            strip(c, v, null, th, now, 'm', rc);
            return v;
        }
        String prefix = String.format(Locale.US, "%04d-%02d-", now.get(Calendar.YEAR), now.get(Calendar.MONTH) + 1);
        double total = 0, hrs = 0;
        int shifts = 0;
        JSONObject days = snap.optJSONObject("days");
        if (days != null) {
            for (Iterator<String> it = days.keys(); it.hasNext(); ) {
                String k = it.next();
                if (!k.startsWith(prefix)) continue;
                JSONObject d = days.optJSONObject(k);
                if (d == null || !d.has("w")) continue;
                total += d.optDouble("p", 0);
                hrs += d.optDouble("h", 0);
                shifts++;
            }
        }
        v.setTextViewText(R.id.w_total, money(snap, total, snap.optString("cur")));
        v.setTextViewText(R.id.w_meta, shifts + " " + plural(snap, shifts, L == null ? null : L.optJSONArray("shifts"))
                + " · " + hours(hrs) + " " + str(L, "h", "ч"));
        strip(c, v, snap, th, now, 'm', rc);
        return v;
    }

    // ───────────── «Неделя» ─────────────

    private static RemoteViews week(Context c, JSONObject snap, int widgetId) {
        RemoteViews v = new RemoteViews(c.getPackageName(), R.layout.widget_week);
        Theme th = theme(snap);
        base(v, th);
        Calendar now = Calendar.getInstance();
        int rc = widgetId * 16;
        v.setOnClickPendingIntent(android.R.id.background, openApp(c, WidgetStore.key(now), rc));
        strip(c, v, snap, th, now, 'k', rc);
        return v;
    }

    private static final int[][] M_IDS = {
            {R.id.m0, R.id.m0_bg, R.id.m0_ring, R.id.m0_wd, R.id.m0_num, R.id.m0_bar, R.id.m0_nm},
            {R.id.m1, R.id.m1_bg, R.id.m1_ring, R.id.m1_wd, R.id.m1_num, R.id.m1_bar, R.id.m1_nm},
            {R.id.m2, R.id.m2_bg, R.id.m2_ring, R.id.m2_wd, R.id.m2_num, R.id.m2_bar, R.id.m2_nm},
            {R.id.m3, R.id.m3_bg, R.id.m3_ring, R.id.m3_wd, R.id.m3_num, R.id.m3_bar, R.id.m3_nm},
            {R.id.m4, R.id.m4_bg, R.id.m4_ring, R.id.m4_wd, R.id.m4_num, R.id.m4_bar, R.id.m4_nm},
            {R.id.m5, R.id.m5_bg, R.id.m5_ring, R.id.m5_wd, R.id.m5_num, R.id.m5_bar, R.id.m5_nm},
            {R.id.m6, R.id.m6_bg, R.id.m6_ring, R.id.m6_wd, R.id.m6_num, R.id.m6_bar, R.id.m6_nm}};
    private static final int[][] K_IDS = {
            {R.id.k0, R.id.k0_bg, R.id.k0_ring, R.id.k0_wd, R.id.k0_num, R.id.k0_bar, 0},
            {R.id.k1, R.id.k1_bg, R.id.k1_ring, R.id.k1_wd, R.id.k1_num, R.id.k1_bar, 0},
            {R.id.k2, R.id.k2_bg, R.id.k2_ring, R.id.k2_wd, R.id.k2_num, R.id.k2_bar, 0},
            {R.id.k3, R.id.k3_bg, R.id.k3_ring, R.id.k3_wd, R.id.k3_num, R.id.k3_bar, 0},
            {R.id.k4, R.id.k4_bg, R.id.k4_ring, R.id.k4_wd, R.id.k4_num, R.id.k4_bar, 0},
            {R.id.k5, R.id.k5_bg, R.id.k5_ring, R.id.k5_wd, R.id.k5_num, R.id.k5_bar, 0},
            {R.id.k6, R.id.k6_bg, R.id.k6_ring, R.id.k6_wd, R.id.k6_num, R.id.k6_bar, 0}};

    /** Полоса текущей недели (пн–вс): цвет места работы, сегодня — в рамке цвета акцента. */
    private static void strip(Context c, RemoteViews v, JSONObject snap, Theme th, Calendar now, char kind, int rc) {
        int[][] ids = kind == 'm' ? M_IDS : K_IDS;
        String today = WidgetStore.key(now);
        Calendar d = (Calendar) now.clone();
        d.add(Calendar.DAY_OF_MONTH, -dowMonday(now));
        JSONObject L = snap == null ? null : snap.optJSONObject("L");
        JSONObject days = snap == null ? null : snap.optJSONObject("days");
        String[] fallbackWd = {"ПН", "ВТ", "СР", "ЧТ", "ПТ", "СБ", "ВС"};
        for (int i = 0; i < 7; i++) {
            int[] r = ids[i];
            String k = WidgetStore.key(d);
            JSONObject day = days == null ? null : days.optJSONObject(k);
            JSONObject wp = day != null && day.has("w") ? WidgetStore.findWorkplace(snap, day.optString("w")) : null;
            boolean off = day != null && day.has("o");
            int cellColor = th.cell, numColor = th.text;
            if (wp != null) cellColor = mix(color(wp.optString("c"), th.accent), th.cell, th.light ? .22f : .34f);
            else if (off) { cellColor = th.off; numColor = th.text3; }
            v.setInt(r[1], "setColorFilter", cellColor);
            v.setTextViewText(r[3], arr(L, "wd", i, fallbackWd[i]));
            v.setTextColor(r[3], i >= 5 ? mix(th.accent, th.text3, .5f) : th.text3);
            v.setTextViewText(r[4], String.valueOf(d.get(Calendar.DAY_OF_MONTH)));
            v.setTextColor(r[4], k.equals(today) ? (th.light ? mix(th.accent, 0xFF000000, .6f) : mix(th.accent, 0xFFFFFFFF, .45f)) : numColor);
            if (wp != null || off) {
                v.setViewVisibility(r[5], View.VISIBLE);
                v.setInt(r[5], "setColorFilter", wp != null ? color(wp.optString("c"), th.accent) : th.text3);
            } else {
                v.setViewVisibility(r[5], View.INVISIBLE);
            }
            if (r[6] != 0) {
                v.setTextViewText(r[6], wp != null ? wp.optString("s", wp.optString("n")) : (off ? str(L, "offShort", "вых") : ""));
                v.setTextColor(r[6], wp != null ? mix(color(wp.optString("c"), th.accent), th.text, .6f) : th.text3);
            }
            if (k.equals(today)) {
                v.setViewVisibility(r[2], View.VISIBLE);
                v.setInt(r[2], "setColorFilter", th.accent);
            } else {
                v.setViewVisibility(r[2], View.GONE);
            }
            v.setOnClickPendingIntent(r[0], openApp(c, k, rc + 8 + i));
            d.add(Calendar.DAY_OF_MONTH, 1);
        }
    }
}
