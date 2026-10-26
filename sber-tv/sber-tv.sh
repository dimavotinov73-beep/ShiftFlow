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
#   bash sber-tv.sh TV_IP look         оформление: стиль, обои (свои фото тоже), цвет фона, подсветка
#   bash sber-tv.sh TV_IP look-reset   вернуть оформление, которое ставит чистка
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

look() {   # look [стиль обои цвет подсветка] [фото...]: собрать тему из ответов и отправить на ТВ
  local style wall color glow hex src photos=() out="$DIR/look"
  local colors=("#000000" "#070A14" "#14161C" "#06140E" "#1A0A0E" "#120A1F")
  LOOK_ANSWERS=("${@:1:4}")
  choose style "Стиль домашнего экрана" \
    "Классика — тёмная полоса с приложениями и крупное название" \
    "Стекло — матовая полупрозрачная полоса, кнопки-иконки" \
    "Кино — сверху большая обложка выбранного приложения" \
    "Минимал — без полосы, только тонкая рамка вокруг выбранного" \
    "Плитки — иконки на карточках своего цвета, подписи под всеми"
  choose wall "Обои (любую картинку из набора потом можно выбрать на ТВ)" \
    "Галерея — все 35 картинок ниже, меняются раз в час" \
    "Рисованные пейзажи — 14 штук" \
    "Природа — 12 фотографий" \
    "Швеция — 3 фотографии" \
    "Утро, день и ночь — картинка по времени суток" \
    "Северное сияние" \
    "Тёмное стекло" \
    "Осеннее озеро" \
    "Свои фото с телефона" \
    "Без обоев, только цвет фона"
  choose color "Цвет фона (заметен, когда обоев нет или картинка ещё грузится)" \
    "Чёрный" "Ночной синий" "Графит" "Тёмно-зелёный" "Бордовый" "Фиолетовый" "Свой цвет (#RRGGBB)"
  if [ "$color" -le ${#colors[@]} ]; then
    hex=${colors[$((color - 1))]}
  else
    read -r -p "Цвет в виде #RRGGBB: " hex
    [[ "$hex" =~ ^#[0-9A-Fa-f]{6}$ ]] || die "цвет должен быть вида #1A2B3C"
  fi
  choose glow "Подсветка выбранного приложения" "В цвет приложения" "Белая"

  if [ "$wall" = 9 ]; then
    if [ $# -gt 4 ]; then
      photos=("${@:5}")
    else
      read -r -p "Файл или папка с фото [~/storage/downloads]: " src
      src=${src:-$HOME/storage/downloads}
      src=${src/#\~/$HOME}
      [ -e "$src" ] || die "нет такого пути: $src (для доступа к «Загрузкам» один раз выполните termux-setup-storage)"
      if [ -d "$src" ]; then
        while IFS= read -r -d '' f; do photos+=("$f"); done < <(find "$src" -maxdepth 1 -type f \
          \( -iname '*.jpg' -o -iname '*.jpeg' -o -iname '*.png' -o -iname '*.webp' \) -print0 | sort -z | head -z -n 30)
      else
        photos=("$src")
      fi
    fi
    [ ${#photos[@]} -gt 0 ] || die "в $src нет фото (jpg, png, webp)"
    if ! "$PY" -c 'import PIL' 2>/dev/null; then
      say "Ставлю Pillow, чтобы уменьшить фото под экран ТВ"
      if in_termux; then pkg install -y python-pillow; else "$PY" -m pip install -q pillow; fi
    fi
  fi

  probe
  case "$(tv 'pm list packages com.gathin.tvhome')" in
    *package:com.gathin.tvhome*) ;;
    *) die "на ТВ нет домашнего экрана CleanYourTV: сначала выполните bash $0 $TV_HOST" ;;
  esac
  say "Собираю тему"
  cat > "$DIR/look_build.py" <<'PYEOF'
import json, os, re, shutil, sys
kit, out, style, wall, color, glow, *photos = sys.argv[1:]
themes = os.path.join(kit, "themes")
with open(os.path.join(kit, "examples/sber-salute-tv-at30a6/config.json"), encoding="utf-8") as f:
    cfg = json.load(f)   # скрытые служебные приложения, русские названия, библиотека приложений
cfg.update({
    "1": {},
    "2": {"dock_glass": True, "icon_only_buttons": True, "glow_style": "horizon", "focus_overshoot": False},
    "3": {"cinematic_home": True, "dock_glass": True, "icon_only_buttons": True, "focus_overshoot": False},
    "4": {"dock_band": False, "glass_style": "rim", "dock_title": False, "ambient_glow": False,
          "icon_only_buttons": True, "icon_only_inputs": True, "wifi_status_color": True},
    "5": {"uniform_tiles": True, "always_show_names": True, "dock_glass": True},
}[style])
cfg["background_color"] = color
cfg["app_glow"] = glow == "1"
cfg["tile_menu"] = True        # удержать OK на плитке: Переместить, Убрать с главного, О приложении
cfg["reorder_button"] = True   # кнопка перестановки приложений в верхней панели

shutil.rmtree(out, ignore_errors=True)
walls = os.path.join(out, "wallpapers")
os.makedirs(walls)
captions = []

def slug(text):
    return re.sub(r"[^a-z0-9]+", "-", text.lower()).strip("-")[:40] or "x"

def caption_map(folder):
    path = os.path.join(themes, folder, "wallpapers", "captions.txt")
    result = {}
    if os.path.exists(path):
        for line in open(path, encoding="utf-8"):
            if "\t" in line and not line.startswith("#"):
                name, text = line.rstrip("\n").split("\t", 1)
                result[name] = text
    return result

def add(src, name, caption=None):
    shutil.copyfile(src, os.path.join(walls, name))
    if caption:
        captions.append(f"{name}\t{caption}")

def scenes():
    caps = caption_map("scenes")
    for name in sorted(os.listdir(os.path.join(themes, "scenes", "wallpapers"))):
        if name.endswith(".jpg"):
            add(os.path.join(themes, "scenes", "wallpapers", name), "scene-" + name, caps.get(name))

def photos_of(folder, prefix, sep):
    caps = caption_map(folder)
    for i, name in enumerate(sorted(n for n in os.listdir(os.path.join(themes, folder, "wallpapers")) if n.endswith(".jpg")), 1):
        text = caps.get(name, "")
        add(os.path.join(themes, folder, "wallpapers", name), f"{prefix}-{i:02d}-{slug(text.split(sep)[0])}.jpg", text or None)

DAYTIME = {"morning": ("6am_4pm.jpg", "daytime-1-day.jpg"), "evening": ("4pm_9pm.jpg", "daytime-2-evening.jpg"),
           "night": ("9pm_6am.jpg", "daytime-3-night.jpg")}

def daytime():
    for src, name in DAYTIME.values():
        add(os.path.join(themes, "retro", "wallpapers", src), name)

SINGLES = {"6": ("aurora", "aurora.jpg"), "7": ("glass", "dark-glass.jpg"), "8": ("ruska", "autumn-lake.jpg")}

def single(key):
    folder, name = SINGLES[key]
    add(os.path.join(themes, folder, "wallpaper.jpg"), name)

collection = {"wallpaper": True, "wallpaper_rotation_minutes": 60, "wallpaper_order": "shuffle", "wallpaper_dim": 10}
if wall == "1":
    scenes(); photos_of("nature-calm", "nature", " - "); photos_of("sweden", "sweden", " · "); daytime()
    for key in SINGLES:
        single(key)
    cfg.update(collection, wallpaper_captions=True)
elif wall == "2":
    scenes(); cfg.update(collection)
elif wall == "3":
    photos_of("nature-calm", "nature", " - "); cfg.update(collection, wallpaper_captions=True, wallpaper_dim=14)
elif wall == "4":
    photos_of("sweden", "sweden", " · "); cfg.update(collection, wallpaper_captions=True)
elif wall == "5":
    daytime()
    cfg.update(collection, wallpaper_order="sequential",
               wallpaper_moods={mood: [name] for mood, (_, name) in DAYTIME.items()})
elif wall in SINGLES:
    # Одна картинка, но тоже в наборе: так на ТВ её можно выключить и включить в настройках лаунчера.
    single(wall); cfg.update(collection)
elif wall == "9":
    from PIL import Image, ImageOps
    for i, path in enumerate(photos, 1):
        image = ImageOps.exif_transpose(Image.open(path)).convert("RGB")
        image = ImageOps.fit(image, (1920, 1080), Image.LANCZOS)   # по размеру экрана, лишнее обрезается по краям
        image.save(os.path.join(walls, f"photo-{i:02d}.jpg"), "JPEG", quality=85)
    cfg.update(collection)
else:
    cfg["wallpaper"] = False

if captions:
    with open(os.path.join(walls, "captions.txt"), "w", encoding="utf-8") as f:
        f.write("\n".join(captions) + "\n")
if not os.listdir(walls):
    os.rmdir(walls)
with open(os.path.join(out, "config.json"), "w", encoding="utf-8") as f:
    json.dump(cfg, f, ensure_ascii=False, indent=2)
count = len([n for n in os.listdir(walls) if n.endswith(".jpg")]) if os.path.isdir(walls) else 0
print(f"тема собрана: обоев {count}")
PYEOF
  "$PY" -I "$DIR/look_build.py" "$DIR" "$out" "$style" "$wall" "$hex" "$glow" "${photos[@]}"
  say "Отправляю тему на ТВ (обои копируются по одной, это может занять пару минут)"
  bash "$DIR/tools/theme.sh" "$out"
  say "Готово. На ТВ:"
  echo "- переставить приложение: удержите OK на плитке → «Переместить», стрелки, «Назад» — поставить"
  echo "  (или кнопка «Изменить порядок приложений» в верхней панели);"
  echo "- выбрать обои, число приложений в ряду, непрозрачность полосы: удержите OK на «Настройках» →"
  echo "  «Настройки главного экрана»;"
  echo "- вернуть оформление после чистки: bash $0 $TV_HOST look-reset"
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
  look-reset) probe && bash "$DIR/tools/theme.sh" "$DIR/$PROFILE" ;;
  shell) shift 2; [ $# -gt 0 ] || die "укажите команду: shell 'pm list packages -d'"; tv "$*" ;;
  *) die "неизвестная команда: $CMD (см. bash $0 без аргументов)" ;;
esac
