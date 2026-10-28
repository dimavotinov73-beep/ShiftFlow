#!/usr/bin/env bash
# CleanYourTV для Сбер Салют ТВ — запуск с Android-телефона через Termux, без компьютера.
#
# Скрипт не делает ничего своего с телевизором: он скачивает проект CleanYourTV
# (github.com/Gathin23/cleanyourtv) на зафиксированном коммите и запускает его же скрипты
# с готовым профилем examples/sber-salute-tv-at30a6 — теми же командами, что и на ПК.
# Отличия: лаунчер не собирается на телефоне (нужны JDK и Android SDK), а берётся готовый APK,
# собранный из того же коммита с правками для Салют ТВ из launcher/sber.patch — компактные кнопки
# сверху, VPN одной кнопкой, погода, вид Apple TV со стандартными обоями по категориям, плитка
# «Настройки лаунчера», библиотека плитками, отключение кнопок Сбера на пульте, голосовой ассистент
# Джарвис (sha256 проверяется).
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
#   bash sber-tv.sh TV_IP look         свои фото для обоев, место для погоды, кнопка VPN
#   bash sber-tv.sh TV_IP keys         отключить кнопки Сбера на пульте (Okko, ИВИ...), ассистент → Алиса
#   bash sber-tv.sh TV_IP keys-reset   вернуть кнопкам пульта их обычную работу
#   bash sber-tv.sh TV_IP jarvis       Джарвис: голосовой ИИ на кнопке ассистента (Claude + голос Яндекса)
#   bash sber-tv.sh TV_IP jarvis-log   журнал Джарвиса, если он не слышит или молчит
#   bash sber-tv.sh TV_IP jarvis-off   убрать Джарвиса с кнопки и стереть его ключи с ТВ
#   bash sber-tv.sh TV_IP update-launcher   обновить домашний экран до версии из этого набора
#   bash sber-tv.sh TV_IP look-reset   вернуть оформление, которое ставит чистка
#   bash sber-tv.sh TV_IP shell 'КОМАНДА'   выполнить одну shell-команду на ТВ
set -euo pipefail

UPSTREAM_COMMIT=b06ab21105c49900cb1ed76b24414dba1e21d0db
KIT_URL=https://raw.githubusercontent.com/dimavotinov73-beep/ShiftFlow/ccr-e16201a1-9rnk6y/sber-tv
APK_NAME=tvhome-3.0-sber4.apk
APK_SHA256=0bc36b1e98e76fe58e7bb80367de46fa8ae4e82d25b0dbab339fa281f536345e
APK_VERSION_CODE=13
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
  echo "Когда закончите: bash $0 $TV_HOST finish"
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

update_launcher() {   # update_launcher [quiet]: quiet — из look, который сам дальше включит новое
  probe
  say "Обновляю домашний экран до $APK_NAME (оформление, обои и порядок приложений сохранятся)"
  # STOCK_LAUNCHER=none: экран Сбера уже отключён чисткой, трогать его не нужно.
  if (cd "$DIR/launcher" && JAVA_HOME="${JAVA_HOME:-$DIR/launcher/prebuilt}" STOCK_LAUNCHER=none bash build-and-install.sh); then
    grant_settings
    if [ "${1:-}" = quiet ]; then say "Домашний экран обновлён"
    else
      say "Домашний экран обновлён: вид Apple TV, 20 стандартных обоев по категориям, погода"
      echo "Обои, погода, язык, заставка — плитка «Настройки лаунчера» на ТВ."
      echo "Свои фото для обоев, другое место для погоды, кнопка VPN: bash $0 $TV_HOST look"
      echo "Кнопки Сбера на пульте: bash $0 $TV_HOST keys; голосовой ассистент: bash $0 $TV_HOST jarvis"
    fi
    return 0
  fi
  echo
  echo "Обновить поверх не получилось (ответ ТВ выше). Если там INSTALL_FAILED_UPDATE_INCOMPATIBLE —"
  echo "у установленного экрана другая подпись. Тогда: bash $0 $TV_HOST restore, затем"
  echo "bash $0 $TV_HOST install и bash $0 $TV_HOST look (оформление придётся выбрать заново)."
  exit 1
}

grant_settings() {   # права для «Настроек лаунчера»: заставка (secure) и время до неё (system)
  tv 'pm grant com.gathin.tvhome android.permission.WRITE_SECURE_SETTINGS; appops set com.gathin.tvhome WRITE_SETTINGS allow' \
    >/dev/null 2>&1 || echo "ТВ не выдал права на настройки заставки — её можно будет включить только в настройках ТВ."
}

launcher_version() {   # versionCode установленного домашнего экрана, 0 если его нет
  local v
  v="$(tv 'dumpsys package com.gathin.tvhome' | tr -d '\r' | sed -n 's/.*versionCode=\([0-9]*\).*/\1/p' | head -n 1)"
  echo "${v:-0}"
}

geocode() {   # geocode "Город[, регион]" → строки "широта долгота Название|Название, регион, район" по одной на место
  # Поиск Open-Meteo знает только название; одинаковых деревень десятки, поэтому берём все и
  # оставляем те, где есть указанный после запятой регион (если с ним ничего не нашлось — все).
  local name=${1%%,*} region=""
  [[ "$1" == *,* ]] && region=${1#*,}
  curl -fsS --get --max-time 20 --data-urlencode "name=$name" -d count=100 -d language=ru -d format=json \
    https://geocoding-api.open-meteo.com/v1/search | "$PY" -I -c '
import json, sys
region = sys.argv[1].strip().lower()
rows = []
for r in json.load(sys.stdin).get("results") or []:
    parts = []
    for x in (r.get("name"), r.get("admin1"), r.get("admin2"), r.get("admin3"), r.get("country")):
        if x and x not in parts:
            parts.append(x)
    rows.append((r["latitude"], r["longitude"], r["name"], ", ".join(parts), ", ".join(parts[1:]).lower()))
picked = [x for x in rows if region and region in x[4]] or rows
for lat, lon, name, where, _ in picked:
    print("%s %s %s|%s" % (lat, lon, name, where))
' "$region"
}

vpn_name() {   # понятное имя для известных VPN-приложений
  case "$1" in
    com.v2ray.ang) echo "v2rayNG" ;;
    com.wireguard.android) echo "WireGuard" ;;
    app.hiddify.com) echo "Hiddify" ;;
    org.amnezia.vpn) echo "AmneziaVPN" ;;
    org.amnezia.awg) echo "AmneziaWG" ;;
    su.happ.proxyutility) echo "Happ" ;;
    com.v2raytun.android) echo "v2RayTun" ;;
    org.outline.android.client) echo "Outline" ;;
    com.github.shadowsocks*) echo "Shadowsocks" ;;
    *) echo "$1" ;;
  esac
}

pick_place() {   # pick_place "Место" → LOOK_WEATHER_LAT, LOOK_WEATHER_LON, LOOK_WEATHER_CITY
  local query=$1 places=() i n pick lat lon
  if [[ "$query" =~ ^(-?[0-9]+(\.[0-9]+)?)[,\ ]+(-?[0-9]+(\.[0-9]+)?)\ *(.*)$ ]]; then
    LOOK_WEATHER_LAT=${BASH_REMATCH[1]}
    LOOK_WEATHER_LON=${BASH_REMATCH[3]}
    LOOK_WEATHER_CITY=${BASH_REMATCH[5]}
    echo "Погода для: $LOOK_WEATHER_LAT, $LOOK_WEATHER_LON $LOOK_WEATHER_CITY"
    return
  fi
  mapfile -t places < <(geocode "$query" || true)
  [ ${#places[@]} -gt 0 ] || die "не нашёл «$query» (проверьте написание или интернет на телефоне)"
  pick=1
  if [ ${#places[@]} -gt 1 ]; then
    printf '\n\033[1m%s\033[0m\n' "Мест с таким названием: ${#places[@]}. Какое ваше?"
    n=0
    for i in "${places[@]}"; do
      n=$((n + 1))
      read -r lat lon _ <<< "${i%%|*}"
      printf '  %d) %s  (%s, %s)\n' "$n" "${i#*|}" "$lat" "$lon"
      # Ссылка открывает карту с точкой: так видно, та ли это деревня.
      printf '     https://yandex.ru/maps/?pt=%s,%s&z=12&l=map\n' "$lon" "$lat"
    done
    if [ -n "${LOOK_PLACE:-}" ]; then pick=$LOOK_PLACE; else read -r -p "Номер места [1]: " pick; fi
    pick=${pick:-1}
    [[ "$pick" =~ ^[0-9]+$ ]] && [ "$pick" -ge 1 ] && [ "$pick" -le ${#places[@]} ] || die "нет такого варианта: $pick"
  fi
  read -r LOOK_WEATHER_LAT LOOK_WEATHER_LON LOOK_WEATHER_CITY <<< "${places[$((pick - 1))]%%|*}"
  echo "Погода для: ${places[$((pick - 1))]#*|}"
}

LOOK_ANSWERS=()
choose() {   # choose ПЕРЕМЕННАЯ "Вопрос" "вариант 1" "вариант 2" ...; ответ берётся из LOOK_ANSWERS, если он там есть
  local var=$1 title=$2 i=1 ans opt
  shift 2
  if [ ${#LOOK_ANSWERS[@]} -gt 0 ]; then
    ans=${LOOK_ANSWERS[0]}
    LOOK_ANSWERS=("${LOOK_ANSWERS[@]:1}")
  else
    printf '\n\033[1m%s\033[0m\n' "$title"
    for opt in "$@"; do printf '  %d) %s\n' "$i" "$opt"; i=$((i + 1)); done
    read -r -p "Номер [1]: " ans
  fi
  ans=${ans:-1}
  [[ "$ans" =~ ^[0-9]+$ ]] && [ "$ans" -ge 1 ] && [ "$ans" -le $# ] || die "нет такого варианта: $ans"
  printf -v "$var" '%s' "$ans"
}

look() {   # look [обои] [фото...]: обои, погода и кнопка VPN. Вид всегда как у Apple TV, стили не выбираются
  local wall src photos=() out="$DIR/look" city vpn pkg tunnel="" vpns=() labels=() receivers version
  probe
  version="$(launcher_version)"
  [ "$version" -gt 0 ] || die "на ТВ нет домашнего экрана CleanYourTV: сначала выполните bash $0 $TV_HOST"
  if [ "$version" -lt "$APK_VERSION_CODE" ]; then update_launcher quiet; fi
  LOOK_ANSWERS=("${@:1:1}")
  choose wall "Обои (картинку потом можно выбрать на ТВ: Настройки лаунчера → Обои)" \
    "Стандартные: 20 картинок по 4 в категории (в стиле iPhone, горы, побережья, города, космос)" \
    "Стандартные и свои фото с телефона"

  # Погода: место превращается в координаты здесь, на телефоне (Open-Meteo, без ключа и регистрации).
  if [ -n "${LOOK_CITY+x}" ]; then city=$LOOK_CITY; else
    printf '\n\033[1m%s\033[0m\n' "Погода вверху справа"
    echo "Город или посёлок; область — после запятой (Глухово, Московская). Или координаты: 55.772,37.253 Глухово"
    read -r -p "Место (Enter — Глухово): " city
  fi
  if [ -n "$city" ]; then
    pick_place "$city"
    export LOOK_WEATHER_LAT LOOK_WEATHER_LON LOOK_WEATHER_CITY
  fi

  # Кнопка VPN: приложения с VpnService на ТВ; переключать сама она умеет v2rayNG (и его форки) и WireGuard.
  mapfile -t vpns < <(tv 'cmd package query-services --brief -a android.net.VpnService' | tr -d '\r' \
    | sed -n 's#^ *\([A-Za-z0-9_.]*\)/.*#\1#p' | sort -u)
  if [ ${#vpns[@]} -eq 0 ]; then
    echo; echo "VPN-приложений на ТВ нет — кнопку VPN не добавляю."
  else
    receivers="$(tv 'cmd package query-receivers --brief -a com.twofortyfouram.locale.intent.action.FIRE_SETTING' | tr -d '\r')"
    for pkg in "${vpns[@]}"; do
      # Happ и v2rayNG переключаются своим ярлыком «вкл/выкл», WireGuard и форки v2rayNG — командой.
      if [[ " su.happ.proxyutility com.v2ray.ang com.wireguard.android " == *" $pkg "* ]] || [[ "$receivers" == *"$pkg/"* ]]; then
        labels+=("$(vpn_name "$pkg") — OK включает и выключает VPN")
      else
        labels+=("$(vpn_name "$pkg") — OK открывает приложение")
      fi
    done
    [ -n "${LOOK_VPN-}" ] && LOOK_ANSWERS=("$LOOK_VPN")
    choose vpn "Кнопка VPN вверху справа (белая — VPN включён, тусклая — выключен; удержать OK — открыть приложение)" \
      "${labels[@]}" "Без кнопки VPN"
    if [ "$vpn" -le ${#vpns[@]} ]; then
      export LOOK_VPN_APP=${vpns[$((vpn - 1))]}
      if [ "$LOOK_VPN_APP" = com.wireguard.android ]; then
        read -r -p "Имя туннеля WireGuard (как в приложении): " tunnel
        [ -n "$tunnel" ] || die "без имени туннеля WireGuard переключать нечего"
        tv 'pm grant com.gathin.tvhome com.wireguard.android.permission.CONTROL_TUNNELS' \
          || die "ТВ не выдал лаунчеру право управлять WireGuard"
        echo "В WireGuard на ТВ: Настройки → включите «Allow remote control apps» (удалённое управление)."
      fi
      export LOOK_VPN_TUNNEL=$tunnel
    fi
  fi

  if [ "$wall" = 2 ]; then
    local sources=()
    if [ $# -ge 2 ]; then
      sources=("${@:2}")
    else
      read -r -p "Файл или папка с фото [~/storage/downloads]: " src
      sources=("${src:-$HOME/storage/downloads}")
    fi
    # Папки раскрываются в фото внутри них (до 30), файлы берутся как есть.
    for src in "${sources[@]}"; do
      src=${src/#\~/$HOME}
      [ -e "$src" ] || die "нет такого пути: $src (для доступа к «Загрузкам» один раз выполните termux-setup-storage)"
      if [ -d "$src" ]; then
        while IFS= read -r -d '' f; do photos+=("$f"); done < <(find "$src" -maxdepth 1 -type f \
          \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -print0 | sort -z | head -z -n 30)
      else
        photos+=("$src")
      fi
    done
    [ ${#photos[@]} -gt 0 ] || die "в ${sources[*]} нет фото (jpg, png, webp)"
    if ! "$PY" -c 'import PIL' 2>/dev/null; then
      say "Ставлю Pillow, чтобы уменьшить фото под экран ТВ"
      if in_termux; then pkg install -y python-pillow; else "$PY" -m pip install -q pillow; fi
    fi
  fi

  say "Собираю тему"
  cat > "$DIR/look_build.py" <<'PYEOF'
import json, os, shutil, sys
kit, out, wall, *photos = sys.argv[1:]
with open(os.path.join(kit, "examples/sber-salute-tv-at30a6/config.json"), encoding="utf-8") as f:
    cfg = json.load(f)   # скрытые служебные приложения, русские названия, библиотека приложений
# Вид — всегда Apple TV (так собран лаунчер); здесь только то, что выбирают: обои, погода, кнопка VPN.
cfg["columns"] = 5             # приложений в ряду; на ТВ меняется в «Настройках лаунчера»
cfg["tile_menu"] = True        # удержать OK на плитке: Переместить, Убрать с главного, О приложении
cfg["reorder_button"] = False  # переставлять — через меню плитки или «Настройки лаунчера»
cfg["compact_pills"] = True    # кнопки сверху — кружки, раскрываются с подписью при наведении
cfg["restore_key_services"] = True  # кнопки пульта (команда keys) снова работают после сбоя лаунчера
if os.environ.get("LOOK_WEATHER_LAT"):
    cfg.update(weather_lat=float(os.environ["LOOK_WEATHER_LAT"]), weather_lon=float(os.environ["LOOK_WEATHER_LON"]),
               weather_city=os.environ.get("LOOK_WEATHER_CITY", ""))
if os.environ.get("LOOK_VPN_APP"):
    cfg.update(vpn_app=os.environ["LOOK_VPN_APP"], vpn_pill=True, vpn_toggle=True,
               vpn_tunnel=os.environ.get("LOOK_VPN_TUNNEL", ""))

shutil.rmtree(out, ignore_errors=True)
walls = os.path.join(out, "wallpapers")
os.makedirs(walls)
# Стандартные обои лаунчер ставит сам (они встроены); первая из них на экране, пока на ТВ не выбрано другое.
if wall == "2":
    from PIL import Image, ImageOps
    for i, path in enumerate(photos, 1):
        image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        image = ImageOps.fit(image, (1920, 1080), Image.LANCZOS)   # по размеру экрана, лишнее обрезается по краям
        image.save(os.path.join(walls, f"photo-{i:02d}.jpg"), "JPEG", quality=85)
if not os.listdir(walls):
    os.rmdir(walls)
with open(os.path.join(out, "config.json"), "w", encoding="utf-8") as f:
    json.dump(cfg, f, ensure_ascii=False, indent=2)
count = len([n for n in os.listdir(walls) if n.endswith(".jpg")]) if os.path.isdir(walls) else 0
print(f"тема собрана: своих фото {count} (и 20 стандартных обоев в лаунчере)")
PYEOF
  "$PY" -I "$DIR/look_build.py" "$DIR" "$out" "$wall" "${photos[@]}"
  say "Отправляю на ТВ"
  bash "$DIR/tools/theme.sh" "$out"
  say "Готово. На ТВ:"
  echo "- обои: Настройки лаунчера → Обои — по категориям, «Все по очереди», свои с телефона по QR-коду;"
  echo "- переставить приложение: удержите OK на плитке → «Переместить», стрелки, «Назад» — поставить;"
  echo "- кнопки Сбера на пульте: bash $0 $TV_HOST keys; голосовой ассистент: bash $0 $TV_HOST jarvis"
}

KEYS_URI=content://com.gathin.tvhome.theme/remote_keys.json
KEYS_TMP=/data/local/tmp/cyt-theme-remote_keys.json
# Кнопки, которые не трогаем, даже если их нажали по ошибке: Enter, Home, стрелки, OK, «Назад».
NAV_KEYS=" 28 102 103 105 106 108 139 158 172 352 "

capture_key() {   # capture_key "Название" → linux-код нажатой кнопки (так его видит лаунчер, scan:N) или ничего
  local hex
  read -r -p "  Нажмите Enter, затем в течение 8 секунд — «$1» на пульте: " _
  # getevent печатает "/dev/input/event3: 0001 0174 00000001": тип 1 — кнопка, код, значение 1 — нажата.
  # -c 4: выйти сам после первых событий (нажатие — это 3–4 события), иначе вывод может пропасть
  # в буфере при остановке по таймеру; таймер нужен, только если ничего не нажали.
  # shellcheck disable=SC2016
  hex="$(tv 'getevent -qc 4 2>/dev/null & p=$!; (sleep 8; kill $p) >/dev/null 2>&1 & wait $p; true' | tr -d '\r' \
    | sed -n 's#^/dev/input/event[0-9]*: 0001 \([0-9a-f]\{4\}\) 00000001$#\1#p' | head -n 1)"
  [ -z "$hex" ] || echo $((16#$hex))
}

# Включает InputKeyService лаунчера (через него проходят кнопки пульта) и заставляет его перечитать
# remote_keys.json: служба выключается и включается снова. Остальные службы специальных возможностей не трогаются.
key_service_restart() {
  # shellcheck disable=SC2016
  tv 'c=com.gathin.tvhome/.InputKeyService; s=$(settings get secure enabled_accessibility_services); case "$s" in null|"") s="";; esac; o=$(printf "%s" "$s" | tr ":" "\n" | grep -v InputKeyService | paste -sd: -); settings put secure enabled_accessibility_services "${o:-}"; sleep 1; settings put secure enabled_accessibility_services "${o:+$o:}$c"; settings put secure accessibility_enabled 1; pm grant com.gathin.tvhome android.permission.WRITE_SECURE_SETTINGS 2>/dev/null; true' >/dev/null
}

keys() {
  probe
  local version entries=() name code alice apps=() i
  version="$(launcher_version)"
  [ "$version" -gt 0 ] || die "на ТВ нет домашнего экрана CleanYourTV: сначала выполните bash $0 $TV_HOST"
  if [ "$version" -lt "$APK_VERSION_CODE" ]; then update_launcher quiet; fi
  say "Кнопки Сбера на пульте"
  echo "По очереди: Enter здесь, потом кнопка на пульте. Если на ТВ откроется окно Сбера — закройте его «Назад»."
  echo "Кнопки, которой на вашем пульте нет, — просто Enter и ничего не нажимать."
  for name in "Okko" "ИВИ" "Смотрим" "VK Видео" "RUTUBE" "ТВ"; do
    code="$(capture_key "$name")"
    if [ -z "$code" ]; then
      echo "  «$name»: нажатия не было — пропускаю"
    elif [[ "$NAV_KEYS" == *" $code "* ]]; then
      echo "  «$name»: это кнопка навигации (код $code) — её не трогаю"
    else
      entries+=("scan:$code:none")
      echo "  «$name»: код $code — будет отключена"
    fi
  done

  say "Кнопка ассистента"
  mapfile -t apps < <(tv 'pm list packages -e' | tr -d '\r' | sed -n 's/^package://p' | grep -i -E 'alice|yandex' | sort)
  if jarvis_ready; then apps=("$JARVIS_TARGET" "${apps[@]}"); fi
  if [ ${#apps[@]} -eq 0 ]; then
    echo "Приложения Алисы (Яндекса) на ТВ нет — кнопку ассистента не меняю. Поставьте его (например, через"
    echo "Aurora Store или: bash $0 $TV_HOST apk файл.apk) и выполните keys ещё раз."
    echo "Или повесьте на неё Джарвиса, голосового ИИ: bash $0 $TV_HOST jarvis"
  else
    echo "Что открывать кнопкой ассистента (Салют):"
    for i in "${!apps[@]}"; do
      if [ "${apps[$i]}" = "$JARVIS_TARGET" ]; then printf '  %d) Джарвис — голосовой ИИ\n' "$((i + 1))"
      else printf '  %d) %s\n' "$((i + 1))" "${apps[$i]}"; fi
    done
    printf '  %d) оставить кнопку как есть\n' "$((${#apps[@]} + 1))"
    read -r -p "Номер [1]: " i
    i=${i:-1}
    [[ "$i" =~ ^[0-9]+$ ]] && [ "$i" -ge 1 ] && [ "$i" -le $((${#apps[@]} + 1)) ] || die "нет такого варианта: $i"
    if [ "$i" -le ${#apps[@]} ]; then
      alice=${apps[$((i - 1))]}
      code="$(capture_key "кнопка ассистента")"
      if [ -z "$code" ] || [[ "$NAV_KEYS" == *" $code "* ]]; then
        echo "  Кнопку ассистента поймать не удалось — оставляю как есть."
      else
        entries+=("scan:$code:$alice")
        if [ "$alice" = "$JARVIS_TARGET" ]; then echo "  Ассистент (код $code) будет открывать Джарвиса"
        else echo "  Ассистент (код $code) будет открывать $alice"; fi
      fi
    fi
  fi
  [ ${#entries[@]} -gt 0 ] || die "ни одной кнопки не поймано — на ТВ ничего не менялось"

  say "Сохраняю на ТВ"
  "$PY" -I -c 'import json, sys; json.dump({"app_keys": sys.argv[2:]}, open(sys.argv[1], "w"), indent=1)' \
    "$DIR/remote_keys.json" "${entries[@]}"
  tv --push "$DIR/remote_keys.json" "$KEYS_TMP" >/dev/null
  tv "content write --uri $KEYS_URI < $KEYS_TMP; rm -f $KEYS_TMP" >/dev/null
  key_service_restart
  if tv 'dumpsys accessibility' | tr -d '\r' | grep -q 'com.gathin.tvhome/.*InputKeyService'; then
    say "Готово: нажмите Okko — теперь ничего не должно происходить"
  else
    say "Сохранено, но служба кнопок не видна в списке ТВ"
    echo "Проверьте: Настройки ТВ → Специальные возможности → CleanYourTV — включено."
  fi
  echo "Если Сбер всё же реагирует, значит его система ловит кнопку раньше Android — тогда её не отключить."
  echo "Вернуть кнопки: bash $0 $TV_HOST keys-reset"
}

keys_reset() {
  probe
  tv "content delete --uri $KEYS_URI" >/dev/null 2>&1 || true
  key_service_restart
  say "Кнопки пульта снова работают как раньше"
  if jarvis_ready; then echo "Джарвис с кнопки тоже снят (его ключи на ТВ остались). Вернуть: bash $0 $TV_HOST jarvis"; fi
}

JARVIS_URI=content://com.gathin.tvhome.theme/jarvis.json
JARVIS_TARGET=com.gathin.tvhome/.JarvisActivity

tv_json() {   # tv_json URI → JSON-файл лаунчера с ТВ одной строкой, или ничего, если файла нет
  tv "content read --uri $1 2>/dev/null" | tr -d '\r' | "$PY" -I -c 'import json, sys
try:
    print(json.dumps(json.loads(sys.stdin.read())))
except ValueError:
    pass'
}

jarvis_ready() {   # на ТВ сохранены оба ключа Джарвиса
  tv_json "$JARVIS_URI" | "$PY" -I -c 'import json, sys
d = json.loads(sys.stdin.read() or "{}")
sys.exit(0 if d.get("anthropic_key") and d.get("yandex_key") else 1)'
}

push_theme_file() {   # push_theme_file ЛОКАЛЬНЫЙ_ФАЙЛ URI: записать файл в папку лаунчера через его ThemeProvider
  local tmp="/data/local/tmp/cyt-theme-${2##*/}"
  tv --push "$1" "$tmp" >/dev/null
  tv "content write --uri $2 < $tmp; rm -f $tmp" >/dev/null
}

http_code() {   # http_code ЗАГОЛОВОК [аргументы curl...]: код ответа; заголовок с ключом идёт через stdin, не в списке процессов
  local code
  code="$(printf 'header = "%s"\n' "$1" | curl -s -o /dev/null -w '%{http_code}' --max-time 25 -K - "${@:2}")" || code=000
  echo "${code:-000}"
}

ask_yes() {   # ask_yes "Вопрос": да → 0
  local ans
  read -r -p "$1 [y/N] " ans
  case "$ans" in [yYдД]*) return 0 ;; *) return 1 ;; esac
}

jarvis() {
  probe
  local version old old_a old_y a y code keys tmp out
  version="$(launcher_version)"
  [ "$version" -gt 0 ] || die "на ТВ нет домашнего экрана CleanYourTV: сначала выполните bash $0 $TV_HOST"
  if [ "$version" -lt "$APK_VERSION_CODE" ]; then update_launcher quiet; fi

  say "Джарвис — голосовой ассистент на кнопке ассистента"
  echo "Отвечает Claude (Anthropic) с поиском в интернете, говорит голосом Яндекса (SpeechKit)."
  echo "Нужны два ключа, как их получить — в README, раздел «Джарвис»:"
  echo "  1) Claude: console.anthropic.com → API Keys, начинается с sk-ant-"
  echo "  2) Яндекс: API-ключ сервисного аккаунта Yandex Cloud с ролями ai.speechkit-stt.user и"
  echo "     ai.speechkit-tts.user, обычно начинается с AQVN"
  echo "Ключи хранятся только на телевизоре, в папке лаунчера. Ввод не виден на экране."
  old="$(tv_json "$JARVIS_URI")"
  old_a="$("$PY" -I -c 'import json, sys; print(json.loads(sys.argv[1] or "{}").get("anthropic_key", ""))' "$old")"
  old_y="$("$PY" -I -c 'import json, sys; print(json.loads(sys.argv[1] or "{}").get("yandex_key", ""))' "$old")"
  read -r -s -p "Ключ Claude${old_a:+ (Enter — оставить прежний …${old_a: -4})}: " a; echo
  a="$(printf '%s' "${a:-$old_a}" | tr -d '[:space:]')"
  [[ "$a" == sk-ant-* ]] || die "ключ Claude должен начинаться с sk-ant- (console.anthropic.com → API Keys)"
  read -r -s -p "Ключ Яндекса${old_y:+ (Enter — оставить прежний …${old_y: -4})}: " y; echo
  y="$(printf '%s' "${y:-$old_y}" | tr -d '[:space:]')"
  [ ${#y} -ge 20 ] || die "ключ Яндекса слишком короткий — нужен API-ключ сервисного аккаунта (AQVN…)"
  [[ "$y" == AQVN* ]] || echo "  Ключ Яндекса не начинается с AQVN: проверьте, что это API-ключ, а не IAM-токен (тот живёт 12 часов)."

  say "Проверяю ключи"
  tmp="$(mktemp)"
  head -c 6400 /dev/zero > "$tmp"   # 0,2 с тишины: распознавание должно ответить пустой строкой
  code="$(http_code "Authorization: Api-Key $y" --data-binary @"$tmp" -H 'Content-Type: application/octet-stream' \
    'https://stt.api.cloud.yandex.net/speech/v1/stt:recognize?lang=ru-RU&format=lpcm&sampleRateHertz=16000')"
  rm -f "$tmp"
  case "$code" in
    200) echo "  Яндекс, распознавание речи: работает" ;;
    401) echo "  Яндекс не принял ключ (401): ключ с ошибкой или удалён"; ask_yes "Сохранить всё равно?" || exit 1 ;;
    403) echo "  Яндекс: у сервисного аккаунта нет роли ai.speechkit-stt.user (403)"; ask_yes "Сохранить всё равно?" || exit 1 ;;
    000) echo "  Яндекс не ответил — нет интернета на телефоне? Проверку пропускаю." ;;
    *) echo "  Яндекс ответил кодом $code — проверку пропускаю." ;;
  esac
  code="$(http_code "Authorization: Api-Key $y" --data-urlencode 'text=Проверка' -d lang=ru-RU -d voice=ermil \
    -d format=lpcm -d sampleRateHertz=48000 https://tts.api.cloud.yandex.net/speech/v1/tts:synthesize)"
  case "$code" in
    200) echo "  Яндекс, синтез речи: работает" ;;
    401) echo "  Яндекс не принял ключ (401)"; ask_yes "Сохранить всё равно?" || exit 1 ;;
    403) echo "  Яндекс: у сервисного аккаунта нет роли ai.speechkit-tts.user (403)"; ask_yes "Сохранить всё равно?" || exit 1 ;;
    *) echo "  Синтез речи не проверен (код $code)." ;;
  esac
  code="$(http_code "x-api-key: $a" -H 'anthropic-version: 2023-06-01' https://api.anthropic.com/v1/models)"
  case "$code" in
    200) echo "  Claude: ключ принят" ;;
    401) echo "  Anthropic не принял ключ Claude (401): ключ с ошибкой или отозван"; ask_yes "Сохранить всё равно?" || exit 1 ;;
    403) echo "  Claude из этой сети недоступен (403): Anthropic не работает из России без VPN. Ключ не проверен;"
         echo "  на ТВ Джарвис перед вопросом сам включает VPN." ;;
    000) echo "  api.anthropic.com не ответил — ключ не проверен. На ТВ запросы к Claude идут через VPN." ;;
    *) echo "  Claude ответил кодом $code — ключ не проверен." ;;
  esac

  say "Сохраняю на ТВ"
  (umask 077 && "$PY" -I -c 'import json, sys; json.dump({"anthropic_key": sys.argv[2], "yandex_key": sys.argv[3]}, open(sys.argv[1], "w"))' \
    "$DIR/jarvis.json" "$a" "$y")
  push_theme_file "$DIR/jarvis.json" "$JARVIS_URI"
  rm -f "$DIR/jarvis.json"
  # Микрофон: разрешение «опасного» уровня, ADB выдаёт его без вопросов на экране.
  out="$(tv 'pm grant com.gathin.tvhome android.permission.RECORD_AUDIO' | tr -d '\r')"
  [ -z "$out" ] || echo "  ТВ не выдал доступ к микрофону ($out) — Джарвис скажет об этом на экране."

  say "Кнопка для Джарвиса"
  echo "Обычно это кнопка ассистента (Салют). Подойдёт и ненужная кнопка, например Okko."
  code="$(capture_key "кнопка для Джарвиса")"
  if [ -z "$code" ] || [[ "$NAV_KEYS" == *" $code "* ]]; then
    echo "  Кнопку поймать не удалось${code:+ (код $code — кнопка навигации)}. Если ТВ не видит кнопку ассистента"
    echo "  (её забирает система Сбера), повторите и нажмите другую: bash $0 $TV_HOST jarvis — ключи вводить"
    echo "  заново не нужно, Enter. Пока Джарвиса можно открыть из «Настроек лаунчера» → Джарвис."
  else
    keys="$(tv_json "$KEYS_URI")"
    "$PY" -I -c 'import json, sys
out, old, code, target = sys.argv[1:5]
d = json.loads(old or "{}")
keys = [k for k in d.get("app_keys", []) if not k.startswith("scan:%s:" % code) and not k.endswith(":" + target)]
d["app_keys"] = keys + ["scan:%s:%s" % (code, target)]
json.dump(d, open(out, "w"), indent=1)' "$DIR/remote_keys.json" "$keys" "$code" "$JARVIS_TARGET"
    push_theme_file "$DIR/remote_keys.json" "$KEYS_URI"
    key_service_restart
    echo "  Кнопка (код $code) теперь открывает Джарвиса; остальные настройки кнопок пульта сохранены."
  fi

  say "Проверка голоса"
  tv "am start -n $JARVIS_TARGET --es com.gathin.tvhome.extra.JARVIS_SAY 'Джарвис на связи, сэр. Все системы в норме.'" >/dev/null
  echo "Телевизор должен сказать: «Джарвис на связи, сэр. Все системы в норме.»"
  echo "Тишина или красное кольцо на экране — посмотрите журнал: bash $0 $TV_HOST jarvis-log"

  say "Готово. Как пользоваться"
  echo "- кнопка → короткий сигнал → говорите: «Какая погода завтра?», «Включи на ютубе обзор айфона»,"
  echo "  «Сделай погромче», «Сколько стоит биткоин?», «Открой Кинопоиск», «Включи VPN»;"
  echo "- кнопка ещё раз — закончить фразу сразу; OK после ответа — спросить ещё; «Назад» — закрыть;"
  echo "- голос (несколько мужских голосов Яндекса) и эффект «как в фильме»: Настройки лаунчера → Джарвис;"
  echo "- Claude из России работает только через VPN: перед вопросом Джарвис сам включает VPN-приложение"
  echo "  (Happ, v2rayNG, WireGuard), если оно выключено;"
  echo "- Джарвис слушает микрофон, только пока на экране кольцо. Если ТВ отдаёт микрофон пульта только Сберу,"
  echo "  Джарвис так и скажет — тогда нужен USB- или Bluetooth-микрофон."
  echo "Убрать Джарвиса и стереть ключи с ТВ: bash $0 $TV_HOST jarvis-off"
}

jarvis_log() {
  probe
  say "Журнал Джарвиса (последние записи)"
  tv 'logcat -d -v time -s Jarvis:V AndroidRuntime:E 2>/dev/null | tail -n 40' | tr -d '\r'
  echo
  echo "Что значит:"
  echo "- microphone / silent microphone — звук с микрофона не приходит (в строке есть список входов ТВ);"
  echo "- recognition / synthesis с HTTP 401 или 403 — ключ Яндекса или роли сервисного аккаунта;"
  echo "- claude: REGION — Anthropic не пускает без VPN; claude: KEY — неверный ключ: bash $0 $TV_HOST jarvis;"
  echo "- claude: BUSY — Anthropic перегружен, спросите позже."
}

jarvis_off() {
  probe
  local keys
  keys="$(tv_json "$KEYS_URI")"
  if [ -n "$keys" ]; then
    "$PY" -I -c 'import json, sys
out, old, target = sys.argv[1:4]
d = json.loads(old)
d["app_keys"] = [k for k in d.get("app_keys", []) if not k.endswith(":" + target)]
json.dump(d, open(out, "w"), indent=1)' "$DIR/remote_keys.json" "$keys" "$JARVIS_TARGET"
    push_theme_file "$DIR/remote_keys.json" "$KEYS_URI"
    key_service_restart
  fi
  tv "content delete --uri $JARVIS_URI" >/dev/null 2>&1 || true
  tv 'pm revoke com.gathin.tvhome android.permission.RECORD_AUDIO' >/dev/null 2>&1 || true
  say "Джарвис отключён: ключи стёрты с ТВ, доступ к микрофону отозван, кнопка работает как раньше"
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
    echo "Теперь выключите ADB там же, где включали: переключатель ADB в SmartApp Studio (Мои устройства)"
    echo "или FactoryMenu → Debug → ADB Enable = Off. Затем перезагрузите ТВ."
    echo "Проверить, что порт закрыт: bash $0 $TV_HOST closed" ;;
  closed) "$PY" -I "$DIR/tools/adb-closed.py" "$TV_HOST" && echo "ADB-порт закрыт." ;;
  aurora) aurora ;;
  apk) shift 2; apk_install "$@" ;;
  look) shift 2; look "$@" ;;
  keys) keys ;;
  keys-reset) keys_reset ;;
  jarvis) jarvis ;;
  jarvis-log) jarvis_log ;;
  jarvis-off) jarvis_off ;;
  update-launcher) update_launcher ;;
  look-reset) probe && bash "$DIR/tools/theme.sh" "$DIR/$PROFILE" ;;
  shell) shift 2; [ $# -gt 0 ] || die "укажите команду: shell 'pm list packages -d'"; tv "$*" ;;
  *) die "неизвестная команда: $CMD (см. bash $0 без аргументов)" ;;
esac
