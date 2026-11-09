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
 * Приложение (JS) после каждого сохранения отдаёт сюда компактный снимок: места работы, цвета темы
 * и дни с прошлой недели до конца следующего месяца. Виджеты только показывают данные и открывают
 * приложение. Очередь действий осталась от версии 3.1.0 (кнопки на виджете): при запуске приложение
 * забирает то, что могло в ней остаться.
 *
 * Всё хранится в приватных SharedPreferences приложения и не покидает устройство.
 */
final class WidgetStore {
    private static final String PREFS = "sf_widgets";
    private static final String KEY_SNAPSHOT = "snapshot";
    private static final String KEY_OPS = "ops";
    static final int MAX_SNAPSHOT = 300_000;
    static final Pattern DATE = Pattern.compile("^\\d{4}-\\d{2}-\\d{2}$");

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
