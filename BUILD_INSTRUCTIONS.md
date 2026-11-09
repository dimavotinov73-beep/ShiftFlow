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

Подпись релиза и публикация в магазинах — в [`store/RELEASE.md`](store/RELEASE.md).

## Сайт

Залей содержимое папки `web/` на хостинг (Cloudflare Worker, GitHub Pages и т. п.).
Для локальной проверки: `cd web && python3 -m http.server 8000` → http://localhost:8000
