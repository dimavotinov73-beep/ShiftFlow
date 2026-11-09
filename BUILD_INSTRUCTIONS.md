# ShiftFlow — сборка

Актуальное приложение — веб-интерфейс в `web/` и Android-обёртка в `android/`
(старый Flutter-прототип в `lib/` больше не используется).

## Android (APK / AAB)

Нужны JDK 17+ и Android SDK (проще всего поставить Android Studio и открыть папку `android/`).

```bash
git clone https://github.com/dimavotinov73-beep/ShiftFlow.git
cd ShiftFlow/android
./gradlew assemblePreview    # тестовый APK как релиз (без отладки) для своего телефона
./gradlew assembleDebug      # отладочный APK (можно смотреть WebView через chrome://inspect)
./gradlew bundleRelease      # AAB для Google Play (-Pchannel=rustore — для RuStore)
```

Готовые файлы:
- `android/app/build/outputs/apk/preview/app-preview.apk`
- `android/app/build/outputs/apk/debug/app-debug.apk`
- `android/app/build/outputs/bundle/release/app-release.aab`

Без компьютера: GitHub → Actions → «Android» → Run workflow, файлы будут в артефакте `shiftflow-android`.

Тестовые APK (`app-preview.apk` и `app-debug.apk`, пакет `io.shiftflow.app.debug`) подписаны общим ключом
`android/app/debug.keystore`, поэтому каждая новая тестовая сборка ставится поверх старой без потери данных.
Этот ключ публичный — не раздавай такие APK широко. Версия из магазина — отдельное приложение (`io.shiftflow.app`);
данные между ними переносятся через «Настройки → Импорт и экспорт».

## Виджеты

После установки: долгое нажатие на рабочем столе → «Виджеты» → ShiftFlow. Есть три виджета:
«Сегодня» (кнопки «Смена» и «Выходной» отмечают день прямо с рабочего стола), «Месяц» (заработок и текущая неделя)
и «Неделя». Виджеты обновляются сразу после изменений в приложении и сами раз в полчаса (так подхватывается новый день).
Разметка генерируется: `python3 tools/android/gen_widget_layouts.py`, превью — `node tools/android/widget-previews.js`.

## Перенос данных со старой версии сайта

1. На старом сайте: «Финансы» → «Экспорт» → поставь дату «С» на свою первую смену → «Скачать всё (все места работы)».
2. В приложении: «Настройки» → «Импорт и экспорт» → «Импортировать файл» → выбери скачанный `.xlsx` → «Добавить к текущим».

Места работы, ставки, часы и суммы восстанавливаются точно (разница со ставкой сохраняется как корректировка).
Выходные и заметки в Excel не попадают — их нужно отметить заново или перенести через `.json`-копию из новой версии сайта.

Подпись релиза и публикация в магазинах — в [`store/RELEASE.md`](store/RELEASE.md).

## Сайт

Залей всю папку `web/` на хостинг (Cloudflare Workers/Pages) — вместе с `_headers`, `version.json` и `download/`.
Для локальной проверки: `cd web && python3 -m http.server 8000` → http://localhost:8000
