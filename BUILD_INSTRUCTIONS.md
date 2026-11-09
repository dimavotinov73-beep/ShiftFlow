# ShiftFlow — сборка

Актуальное приложение — веб-интерфейс в `web/` и Android-обёртка в `android/`
(старый Flutter-прототип в `lib/` больше не используется).

## Android (APK / AAB)

Нужны JDK 17+ и Android SDK (проще всего поставить Android Studio и открыть папку `android/`).

```bash
git clone https://github.com/dimavotinov73-beep/ShiftFlow.git
cd ShiftFlow/android
./gradlew assembleDebug      # APK для установки на свой телефон
./gradlew bundleRelease      # AAB для Google Play / RuStore
```

Готовые файлы:
- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

Без компьютера: GitHub → Actions → «Android» → Run workflow, файлы будут в артефакте `shiftflow-android`.

Тестовый APK (`app-debug.apk`, пакет `io.shiftflow.app.debug`) подписан общим отладочным ключом
`android/app/debug.keystore`, поэтому каждая новая тестовая сборка ставится поверх старой без потери данных.
Версия из магазина — отдельное приложение (`io.shiftflow.app`); данные между ними переносятся резервной копией.

## Перенос данных со старой версии сайта

1. На старом сайте: «Финансы» → «Экспорт» → поставь дату «С» на свою первую смену → «Скачать всё (все места работы)».
2. В приложении: «Настройки» → «Резервная копия» → «Восстановить из файла» → выбери скачанный `.xlsx`.

Места работы, ставки, часы и суммы восстанавливаются точно (разница со ставкой сохраняется как корректировка).
Выходные и заметки в Excel не попадают — их нужно отметить заново или перенести через `.json`-копию из новой версии сайта.

Подпись релиза и публикация в магазинах — в [`store/RELEASE.md`](store/RELEASE.md).

## Сайт

Залей содержимое папки `web/` на хостинг (Cloudflare Worker, GitHub Pages и т. п.).
Для локальной проверки: `cd web && python3 -m http.server 8000` → http://localhost:8000
