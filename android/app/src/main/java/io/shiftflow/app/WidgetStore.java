package io.shiftflow.app;

import android.content.Context;
import android.content.SharedPreferences;

import org.json.JSONArray;
import org.json.JSONException;
import org.json.JSONObject;

import java.util.Calendar;
import java.util.Locale;
import java.util.regex.Pattern;

/**
 * Данные для виджетов рабочего стола.
 *
 * Приложение (JS) после каждого сохранения отдаёт сюда компактный снимок: места работы и дни
 * с прошлой недели до конца следующего месяца. Действия на виджете меняют снимок сразу (чтобы
 * виджет обновился без открытия приложения) и складываются в очередь — при следующем запуске
 * приложение заберёт очередь и применит её к основным данным.
 *
 * Всё хранится в приватных SharedPreferences приложения и не покидает устройство.
 */
final class WidgetStore {
    private static final String PREFS = "sf_widgets";
    private static final String KEY_SNAPSHOT = "snapshot";
    private static final String KEY_OPS = "ops";
    static final int MAX_SNAPSHOT = 300_000;
    private static final int MAX_OPS = 200;

    static final Pattern DATE = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");
    static final Pattern ID = Pattern.compile("^[A-Za-z0-9_-]{1,40}$");

    private WidgetStore() {}

    private static SharedPreferences prefs(Context c) {
        return c.getApplicationContext().getSharedPreferences(PREFS, Context.MODE_PRIVATE);
    }

    static synchronized JSONObject snapshot(Context c) {
        String s = prefs(c).getString(KEY_SNAPSHOT, null);
        if (s == null) return null;
        try {
            return new JSONObject(s);
        } catch (JSONException e) {
            return null;
        }
    }

    /** Принимает снимок из приложения. Возвращает false, если он слишком большой или не JSON-объект. */
    static synchronized boolean saveSnapshot(Context c, String json) {
        if (json == null || json.length() > MAX_SNAPSHOT) return false;
        try {
            new JSONObject(json);
        } catch (JSONException e) {
            return false;
        }
        prefs(c).edit().putString(KEY_SNAPSHOT, json).apply();
        return true;
    }

    /** Отдаёт накопленные действия с виджетов и очищает очередь. */
    static synchronized String takeOps(Context c) {
        SharedPreferences p = prefs(c);
        String ops = p.getString(KEY_OPS, "[]");
        p.edit().remove(KEY_OPS).commit();
        return ops;
    }

    /** Действие на виджете: shift (отметить смену), off (выходной), clear (сбросить). */
    static synchronized boolean applyOp(Context c, String op, String date, String wpId) {
        if (op == null || date == null || !DATE.matcher(date).matches()) return false;
        if (!op.equals("shift") && !op.equals("off") && !op.equals("clear")) return false;
        JSONObject snap = snapshot(c);
        if (snap == null) return false;
        try {
            JSONObject days = snap.optJSONObject("days");
            if (days == null) {
                days = new JSONObject();
                snap.put("days", days);
            }
            if (op.equals("shift")) {
                if (wpId == null || !ID.matcher(wpId).matches()) return false;
                JSONObject w = findWorkplace(snap, wpId);
                if (w == null) return false;
                double h = w.optDouble("h", 8);
                double rate = w.optDouble("r", 0);
                double pay = "daily".equals(w.optString("t")) ? rate : rate * h;
                days.put(date, new JSONObject().put("w", wpId).put("h", h).put("p", Math.round(pay * 100) / 100.0));
            } else if (op.equals("off")) {
                days.put(date, new JSONObject().put("o", 1));
            } else {
                days.remove(date);
            }
            JSONArray ops;
            try {
                ops = new JSONArray(prefs(c).getString(KEY_OPS, "[]"));
            } catch (JSONException e) {
                ops = new JSONArray();
            }
            if (ops.length() < MAX_OPS) {
                ops.put(new JSONObject().put("op", op).put("d", date).put("w", wpId == null ? "" : wpId));
            }
            prefs(c).edit().putString(KEY_SNAPSHOT, snap.toString()).putString(KEY_OPS, ops.toString()).commit();
            return true;
        } catch (JSONException e) {
            return false;
        }
    }

    static JSONObject findWorkplace(JSONObject snap, String id) {
        JSONArray wps = snap.optJSONArray("wps");
        if (wps == null || id == null) return null;
        for (int i = 0; i < wps.length(); i++) {
            JSONObject w = wps.optJSONObject(i);
            if (w != null && id.equals(w.optString("id"))) return w;
        }
        return null;
    }

    static String key(Calendar cal) {
        return String.format(Locale.US, "%04d-%02d-%02d",
                cal.get(Calendar.YEAR), cal.get(Calendar.MONTH) + 1, cal.get(Calendar.DAY_OF_MONTH));
    }
}
