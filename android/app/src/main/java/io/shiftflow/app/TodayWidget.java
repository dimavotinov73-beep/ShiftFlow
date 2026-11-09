package io.shiftflow.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;

/** Виджет рабочего стола «Today». Отрисовка — в {@link WidgetRenderer}. */
public class TodayWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        org.json.JSONObject snap = WidgetStore.snapshot(context);
        for (int id : ids) manager.updateAppWidget(id, WidgetRenderer.build(context, snap, TodayWidget.class, id));
    }
}
