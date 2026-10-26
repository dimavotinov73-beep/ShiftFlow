#!/usr/bin/env bash
# CleanYourTV для Сбер Салют ТВ — запуск с Android-телефона через Termux, без компьютера.
#
# Скрипт не делает ничего своего с телевизором: он скачивает проект CleanYourTV
# (github.com/Gathin23/cleanyourtv) на зафиксированном коммите и запускает его же скрипты
# с готовым профилем examples/sber-salute-tv-at30a6 — теми же командами, что и на ПК.
# Единственное отличие: лаунчер не собирается на телефоне (нужны JDK и Android SDK), а
# берётся готовый APK, собранный из того же коммита (sha256 проверяется).
#
# Использование (TV_IP — адрес телевизора в домашней сети):
#   bash sber-tv.sh TV_IP              проверить ТВ и сделать всё (= install)
#   bash sber-tv.sh TV_IP probe        только подключиться и показать модель
#   bash sber-tv.sh TV_IP install      отключить рекламу/сервисы Сбера, поставить новый домашний экран
#   bash sber-tv.sh TV_IP restore      вернуть всё как было
#   bash sber-tv.sh TV_IP keep-adb     держать ADB по Wi-Fi открытым после перезагрузки (на время работы)
#   bash sber-tv.sh TV_IP rotation     если сторонние приложения сами пропадают («ротация» Сбера)
#   bash sber-tv.sh TV_IP finish       закрыть ADB-порт после перезагрузки; потом выключить ADB в меню
#   bash sber-tv.sh TV_IP closed       проверить, что ADB-порт на ТВ закрыт
#   bash sber-tv.sh TV_IP aurora       поставить Aurora Store — каталог Google Play без сервисов Google
#   bash sber-tv.sh TV_IP apk ФАЙЛ.apk [split.apk ...]   поставить на ТВ приложение из APK с телефона
#   bash sber-tv.sh TV_IP shell 'КОМАНДА'   выполнить одну shell-команду на ТВ
set -euo pipefail

UPSTREAM_COMMIT=b06ab21105c49900cb1ed76b24414dba1e21d0db
KIT_URL=https://raw.githubusercontent.com/dimavotinov73-beep/ShiftFlow/ccr-e16201a1-9rnk6y/sber-tv
APK_NAME=tvhome-3.0.apk
APK_SHA256=233edfc06d751f96b6203c057ee6f96e22d3d8a5ab42b45112e9d9a5cabbb986
PROFILE=examples/sber-salute-tv-at30a6
STOCK=ru.sberdevices.starlauncher
AURORA_CODE=76   # Aurora Store 4.8.4 с F-Droid
AURORA_SHA256=fd9c75d90d0f4a7c132b9b4a5a2cf1992a45e03b8d8ff988b7dcfbc0db2c4d11
DIR="${CLEANYOURTV_DIR:-$HOME/cleanyourtv}"

say() { printf '\n\033[1;36m== %s\033[0m\n' "$*"; }
die() { printf '\033[1;31mОшибка:\033[0m %s\n' "$*" >&2; exit 1; }

TV_IP="${1:-}"
CMD="${2:-install}"
[ -n "$TV_IP" ] || { sed -n '2,/^set -euo/p' "$0" | sed '$d; s/^# \{0,1\}//'; exit 1; }
[[ "$TV_IP" =~ ^[0-9A-Za-z.:-]+$ ]] || die "не похоже на IP-адрес: $TV_IP"
export TV_HOST="$TV_IP"

in_termux() { [ -n "${TERMUX_VERSION:-}" ] || [[ "${PREFIX:-}" == *com.termux* ]]; }

sha256_of() { sha256sum "$1" | cut -d' ' -f1; }

prepare() {
  if in_termux; then
    local need=()
    for p in python curl tar; do command -v "$p" >/dev/null || need+=("$p"); done
    command -v python3 >/dev/null && python3 -c 'import cryptography' 2>/dev/null || need+=(python-cryptography)
    if [ ${#need[@]} -gt 0 ]; then
      say "Ставлю пакеты Termux: ${need[*]}"
      pkg install -y "${need[@]}"
    fi
  fi
  command -v python3 >/dev/null || die "нужен python3"

  if [ "$(cat "$DIR/.commit" 2>/dev/null || true)" != "$UPSTREAM_COMMIT" ]; then
    say "Скачиваю CleanYourTV (${UPSTREAM_COMMIT:0:7}, ~45 МБ)"
    local tmp
    tmp="$(mktemp -d)"
    curl -fL --retry 3 -o "$tmp/src.tar.gz" "https://codeload.github.com/Gathin23/cleanyourtv/tar.gz/$UPSTREAM_COMMIT"
    mkdir -p "$DIR"
    # Поверх старой папки: ключ ADB (tools/adbkey) и venv остаются, и ТВ не спрашивает разрешение заново.
    tar -xzf "$tmp/src.tar.gz" -C "$DIR" --strip-components=1
    rm -rf "$tmp"
    echo "$UPSTREAM_COMMIT" > "$DIR/.commit"
  fi

  PY="$DIR/tools/venv/bin/python"
  if ! "$PY" -c 'import adb_shell' 2>/dev/null; then
    say "Ставлю Python-библиотеку для ADB (adb-shell)"
    # --system-site-packages: в Termux cryptography приходит готовой из pkg, из pip она собирается часами.
    python3 -m venv --system-site-packages "$DIR/tools/venv"
    if in_termux; then
      "$PY" -m pip install -q adb-shell==0.4.4 rsa==4.9.1
    else
      "$PY" -m pip install -q -r "$DIR/tools/requirements.txt"
    fi
  fi

  local apk="$DIR/launcher/prebuilt/$APK_NAME"
  if [ ! -f "$apk" ] || [ "$(sha256_of "$apk")" != "$APK_SHA256" ]; then
    say "Скачиваю готовый лаунчер ($APK_NAME)"
    mkdir -p "$DIR/launcher/prebuilt"
    curl -fL --retry 3 -o "$apk" "$KIT_URL/$APK_NAME"
  fi
  [ "$(sha256_of "$apk")" = "$APK_SHA256" ] || die "контрольная сумма $APK_NAME не совпала, файл повреждён"

  # launcher/build-and-install.sh сначала собирает APK через ./gradlew, потом ставит его на ТВ.
  # Вместо сборки gradlew кладёт готовый APK туда, где его ждёт остальной скрипт.
  cat > "$DIR/launcher/gradlew" <<EOF
#!$(command -v bash)
# Заглушка из sber-tv.sh: на телефоне не собираем, а берём готовый APK из того же коммита.
set -e
cd "\$(dirname "\$0")"
mkdir -p app/build/outputs/apk/release
cp prebuilt/$APK_NAME app/build/outputs/apk/release/app-release.apk
EOF
  chmod +x "$DIR/launcher/gradlew"
}

tv() { "$PY" -I "$DIR/tools/tv.py" "$@"; }

probe() {
  say "Подключаюсь к $TV_HOST"
  echo "Если ТВ спросит «Разрешить отладку по USB?» — отметьте «Всегда разрешать» и нажмите OK."
  tv --probe
}

check_sber() {
  local device has
  device="$(tv 'getprop ro.product.device' | tr -d '\r\n')"
  has="$(tv "pm list packages $STOCK" | tr -d '\r')"
  case "$has" in
    *"package:$STOCK"*) ;;
    *) die "на ТВ нет $STOCK — это не Салют ТВ, профиль Сбера к нему не подходит" ;;
  esac
  if [ "$device" != at30a6 ] && [ -z "${SBER_ANY_MODEL:-}" ]; then
    echo
    echo "Профиль проверен на Салют ТВ 43\" (at30a6, StarOS 1.101, Android 13), а у вас: ${device:-?}."
    echo "Опасные вещи скрипты CleanYourTV сами пропускают (Home, HDMI-входы, Настройки),"
    echo "отсутствующие пакеты просто не найдутся, и всё откатывается командой restore."
    read -r -p "Продолжить? [y/N] " ans
    case "$ans" in [yYдД]*) ;; *) echo "Остановлено, на ТВ ничего не менялось."; exit 0 ;; esac
  fi
}

install() {
  probe
  check_sber
  cd "$DIR"

  say "1/4 Отключаю рекламу, лишние сервисы и приложения Сбера"
  echo "(сообщение «Skipping $STOCK: it owns Home» — это нормально, его отключит шаг 2)"
  bash tools/disable.sh "$PROFILE/debloat.txt"

  say "2/4 Ставлю новый домашний экран и делаю его главным"
  # JAVA_HOME не нужен (сборки нет), но с пустым скрипт ищет java и падает.
  (cd launcher && JAVA_HOME="${JAVA_HOME:-$DIR/launcher/prebuilt}" STOCK_LAUNCHER="$STOCK" bash build-and-install.sh)

  say "3/4 Настройки экрана из профиля: скрытые служебные приложения, русские названия"
  bash tools/theme.sh "$PROFILE"

  say "4/4 Заставка: часы лаунчера вместо заставки Сбера"
  # Пока заставкой остаётся сберовская, StarOS при загрузке включает её обратно (README профиля).
  tv 'settings put secure screensaver_components com.gathin.tvhome/.ClockDream'

  say "Готово. Нажмите Home на пульте."
  echo "Отменить всё: bash $0 $TV_HOST restore"
  echo "Когда закончите — выключите ADB Enable в FactoryMenu (Debug) и перезагрузите ТВ."
}

restore() {
  probe
  cd "$DIR"
  say "Возвращаю пакеты, домашний экран Сбера и заставку"
  bash tools/restore.sh "$PROFILE/debloat.txt" "$STOCK"
  tv 'settings delete global sys_storage_threshold_percentage'
  tv 'settings delete secure screensaver_components'
  echo "Готово. Обновления системных приложений, если удалялись, вернутся через каталог Сбера."
}

apk_install() {   # одно приложение: один APK или base.apk со split-файлами
  [ $# -gt 0 ] || die "укажите файл: apk приложение.apk (или base.apk split_*.apk одного приложения)"
  local f i out cmds
  for f in "$@"; do [ -f "$f" ] || die "нет файла: $f"; done
  probe
  say "Копирую на ТВ: $*"
  i=0
  for f in "$@"; do
    "$PY" -I "$DIR/tools/b64push.py" "$f" "/data/local/tmp/cyt-apk-$i.apk" >/dev/null || die "не удалось скопировать $f на ТВ"
    i=$((i + 1))
  done
  say "Устанавливаю"
  if [ $# -eq 1 ]; then
    cmds='pm install -r /data/local/tmp/cyt-apk-0.apk'
  else
    # Split-APK ставятся одной сессией, как это делает adb install-multiple. $s раскрывается на ТВ.
    # shellcheck disable=SC2016
    cmds='s=$(pm install-create -r | sed -n "s/.*\[\([0-9]*\)\].*/\1/p") && [ -n "$s" ]'
    for ((i = 0; i < $#; i++)); do cmds="$cmds && pm install-write \$s split$i /data/local/tmp/cyt-apk-$i.apk"; done
    cmds="$cmds && pm install-commit \$s"
  fi
  out="$(tv "$cmds; rm -f /data/local/tmp/cyt-apk-*.apk" | tr -d '\r')"
  echo "$out"
  case "$out" in *Success*) ;; *) die "ТВ не установил приложение (ответ выше)" ;; esac
}

aurora() {
  local apk="$DIR/downloads/aurora-store.apk" code
  mkdir -p "$DIR/downloads"
  say "Скачиваю Aurora Store с F-Droid"
  if curl -fL --retry 3 -o "$apk" "https://f-droid.org/repo/com.aurora.store_$AURORA_CODE.apk"; then
    [ "$(sha256_of "$apk")" = "$AURORA_SHA256" ] || die "контрольная сумма Aurora Store не совпала, файл повреждён"
  else
    # F-Droid держит только несколько последних версий: когда проверенной не станет, берём текущую.
    code="$(curl -fsSL https://f-droid.org/api/v1/packages/com.aurora.store | sed -n 's/.*"suggestedVersionCode":\([0-9]*\).*/\1/p')"
    [ -n "$code" ] || die "не удалось узнать текущую версию Aurora Store на F-Droid"
    curl -fL --retry 3 -o "$apk" "https://f-droid.org/repo/com.aurora.store_$code.apk"
    echo "Скачана версия $code, новее проверенной ($AURORA_CODE). sha256: $(sha256_of "$apk")"
  fi
  apk_install "$apk"
  # Без этого разрешения Aurora не сможет сама ставить скачанные приложения.
  tv 'appops set com.aurora.store REQUEST_INSTALL_PACKAGES allow'
  say "Aurora Store установлена: она есть на домашнем экране и в списке всех приложений."
  echo "При первом запуске выберите анонимный вход. Если установка приложения зависает,"
  echo "в настройках Aurora поменяйте способ установки (Installer) на другой."
  echo "Чтобы Салют ТВ сам не удалял поставленные приложения при нехватке места: bash $0 $TV_HOST rotation"
}

prepare
case "$CMD" in
  install) install ;;
  probe) probe ;;
  restore) restore ;;
  keep-adb) tv 'setprop persist.adb.tcp.port 5555' && echo "ADB по Wi-Fi останется открытым после перезагрузки. Закрыть: finish" ;;
  rotation) tv 'settings put global sys_storage_threshold_percentage 1' && echo "Порог «ротации» понижен, сработает после перезагрузки. Вернуть: restore" ;;
  finish)
    tv 'setprop persist.adb.tcp.port ""'
    echo "Теперь на ТВ: FactoryMenu → Debug → ADB Enable = Off, затем перезагрузка."
    echo "Проверить, что порт закрыт: bash $0 $TV_HOST closed" ;;
  closed) "$PY" -I "$DIR/tools/adb-closed.py" "$TV_HOST" && echo "ADB-порт закрыт." ;;
  aurora) aurora ;;
  apk) shift 2; apk_install "$@" ;;
  shell) shift 2; [ $# -gt 0 ] || die "укажите команду: shell 'pm list packages -d'"; tv "$*" ;;
  *) die "неизвестная команда: $CMD (см. bash $0 без аргументов)" ;;
esac
