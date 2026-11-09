"""Собирает установочный профиль для iPhone и iPad: web/ShiftFlow.mobileconfig.

Профиль содержит только «веб-клип» — значок ShiftFlow на экране «Домой», который открывает
приложение во весь экран (как установленное приложение, без строки Safari). Он не ставит
сертификатов, не управляет устройством и не даёт доступа к данным; удаляется в
«Настройки → Основные → VPN и управление устройством».

Запуск: python3 tools/ios/build-webclip.py [адрес сайта]
"""
import os
import plistlib
import sys
import uuid

ROOT = os.path.join(os.path.dirname(os.path.abspath(__file__)), '..', '..')
URL = sys.argv[1] if len(sys.argv) > 1 else 'https://blue-rain-2af9.dimavotinov73.workers.dev/'
if not URL.startswith('https://'):
    sys.exit('Адрес должен начинаться с https://')

# Постоянные идентификаторы: новая сборка профиля заменяет старую, а не добавляет второй значок
NS = uuid.UUID('6f1c2a3e-5b7d-4c8e-9a0f-1e2d3c4b5a69')
ICON = open(os.path.join(ROOT, 'web', 'icons', 'apple-touch-icon.png'), 'rb').read()   # 180×180, без прозрачности

clip = {
    'PayloadType': 'com.apple.webClip.managed',
    'PayloadVersion': 1,
    'PayloadIdentifier': 'io.shiftflow.app.webclip',
    'PayloadUUID': str(uuid.uuid5(NS, 'webclip')).upper(),
    'PayloadDisplayName': 'ShiftFlow',
    'PayloadDescription': 'Значок ShiftFlow на экране «Домой»',
    'Label': 'ShiftFlow',
    'URL': URL,
    'Icon': ICON,
    'Precomposed': True,     # иконка уже готова, iOS не добавляет блики
    'FullScreen': True,      # открывается как приложение, без интерфейса Safari
    'IsRemovable': True,     # значок можно удалить обычным способом
}

profile = {
    'PayloadType': 'Configuration',
    'PayloadVersion': 1,
    'PayloadIdentifier': 'io.shiftflow.app.profile',
    'PayloadUUID': str(uuid.uuid5(NS, 'profile')).upper(),
    'PayloadDisplayName': 'ShiftFlow',
    'PayloadOrganization': 'ShiftFlow',
    'PayloadDescription': ('Добавляет ShiftFlow на экран «Домой»: приложение открывается во весь экран и работает без интернета. '
                           'Профиль содержит только значок со ссылкой на ' + URL + ' — он не устанавливает сертификаты, '
                           'не управляет устройством и не даёт доступа к вашим данным. Удалить: «Настройки → Основные → '
                           'VPN и управление устройством → ShiftFlow».'),
    'PayloadRemovalDisallowed': False,
    'PayloadContent': [clip],
}

out = os.path.join(ROOT, 'web', 'ShiftFlow.mobileconfig')
with open(out, 'wb') as f:
    plistlib.dump(profile, f, fmt=plistlib.FMT_XML, sort_keys=True)
print('written', os.path.relpath(out, ROOT), os.path.getsize(out), 'bytes →', URL)
