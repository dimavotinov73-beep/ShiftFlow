package io.shiftflow.app;

import android.content.BroadcastReceiver;
import android.content.Context;
import android.content.Intent;

/**
 * Кнопки на виджете «Сегодня». Приёмник не экспортирован: его могут вызвать только
 * PendingIntent-ы самого приложения, сторонние приложения отправить сюда команду не могут.
 */
public class WidgetActionReceiver extends BroadcastReceiver {
    static final String ACTION = "io.shiftflow.app.WIDGET_ACTION";
    static final String EXTRA_OP = "op";
    static final String EXTRA_DAY = "d";
    static final String EXTRA_WP = "w";

    @Override
    public void onReceive(Context context, Intent intent) {
        if (intent == null || !ACTION.equals(intent.getAction())) return;
        String op = intent.getStringExtra(EXTRA_OP);
        String day = intent.getStringExtra(EXTRA_DAY);
        String wp = intent.getStringExtra(EXTRA_WP);
        final PendingResult pending = goAsync();
        new Thread(() -> {
            try {
                if (WidgetStore.applyOp(context, op, day, wp != null && wp.isEmpty() ? null : wp)) {
                    WidgetRenderer.updateAll(context);
                }
            } finally {
                pending.finish();
            }
        }, "sf-widget").start();
    }
}
