package io.shiftflow.app;

import android.appwidget.AppWidgetManager;
import android.appwidget.AppWidgetProvider;
import android.content.Context;
import android.os.Bundle;

/** Виджет рабочего стола «Месяц». Отрисовка — в {@link WidgetRenderer}. */
public class MonthWidget extends AppWidgetProvider {
    @Override
    public void onUpdate(Context context, AppWidgetManager manager, int[] ids) {
        org.json.JSONObject snap = WidgetStore.snapshot(context);
        for (int id : ids) manager.updateAppWidget(id, WidgetRenderer.build(context, snap, MonthWidget.class, id));
    }

    /** Виджет растянули или сжали — перерисовываем с подходящим числом недель. */
    @Override
    public void onAppWidgetOptionsChanged(Context context, AppWidgetManager manager, int id, Bundle options) {
        manager.updateAppWidget(id, WidgetRenderer.build(context, WidgetStore.snapshot(context), MonthWidget.class, id));
    }
}
