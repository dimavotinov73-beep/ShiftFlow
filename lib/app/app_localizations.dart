import 'package:flutter/material.dart';

class AppLocalizations {
  final Locale locale;

  const AppLocalizations(this.locale);

  static const Map<String, Map<String, String>> _values = {
    'ru': {
      'calendar': 'Календарь',
      'finance': 'Финансы',
      'settings': 'Настройки',
      'today': 'Сегодня',
      'add_shift': 'Добавить смену',
      'workplace': 'Место работы',
      'hours': 'Часы',
      'income': 'Доход',
      'save': 'Сохранить',
      'system_theme': 'Системная',
      'light_theme': 'Светлая',
      'dark_theme': 'Темная',
      'language': 'Язык',
      'user_agreement': 'Пользовательское соглашение',
      'about_app': 'О приложении',
      'export_data': 'Экспорт данных',
      'month': 'Месяц',
      'year': 'Год',
      'total_shifts': 'Всего смен',
      'total_hours': 'Всего часов',
      'total_earned': 'Итого заработано',
      'extra_contributions': 'Дополнительные внесения',
      'add_place': 'Добавить место',
      'workplaces': 'Места работы',
      'app_name': 'ShiftFlow',
    },
    'en': {
      'calendar': 'Calendar',
      'finance': 'Finance',
      'settings': 'Settings',
      'today': 'Today',
      'add_shift': 'Add shift',
      'workplace': 'Workplace',
      'hours': 'Hours',
      'income': 'Income',
      'save': 'Save',
      'system_theme': 'System',
      'light_theme': 'Light',
      'dark_theme': 'Dark',
      'language': 'Language',
      'user_agreement': 'User agreement',
      'about_app': 'About app',
      'export_data': 'Export data',
      'month': 'Month',
      'year': 'Year',
      'total_shifts': 'Total shifts',
      'total_hours': 'Total hours',
      'total_earned': 'Total earned',
      'extra_contributions': 'Additional contributions',
      'add_place': 'Add place',
      'workplaces': 'Workplaces',
      'app_name': 'ShiftFlow',
    },
  };

  static AppLocalizations of(BuildContext context) {
    return Localizations.of<AppLocalizations>(context, AppLocalizations)!;
  }

  String get calendar => _values[locale.languageCode]?['calendar'] ?? _values['en']!['calendar']!;
  String get finance => _values[locale.languageCode]?['finance'] ?? _values['en']!['finance']!;
  String get settings => _values[locale.languageCode]?['settings'] ?? _values['en']!['settings']!;
  String get today => _values[locale.languageCode]?['today'] ?? _values['en']!['today']!;
  String get addShift => _values[locale.languageCode]?['add_shift'] ?? _values['en']!['add_shift']!;
  String get workplace => _values[locale.languageCode]?['workplace'] ?? _values['en']!['workplace']!;
  String get hours => _values[locale.languageCode]?['hours'] ?? _values['en']!['hours']!;
  String get income => _values[locale.languageCode]?['income'] ?? _values['en']!['income']!;
  String get save => _values[locale.languageCode]?['save'] ?? _values['en']!['save']!;
  String get systemTheme => _values[locale.languageCode]?['system_theme'] ?? _values['en']!['system_theme']!;
  String get lightTheme => _values[locale.languageCode]?['light_theme'] ?? _values['en']!['light_theme']!;
  String get darkTheme => _values[locale.languageCode]?['dark_theme'] ?? _values['en']!['dark_theme']!;
  String get language => _values[locale.languageCode]?['language'] ?? _values['en']!['language']!;
  String get userAgreement => _values[locale.languageCode]?['user_agreement'] ?? _values['en']!['user_agreement']!;
  String get aboutApp => _values[locale.languageCode]?['about_app'] ?? _values['en']!['about_app']!;
  String get exportData => _values[locale.languageCode]?['export_data'] ?? _values['en']!['export_data']!;
  String get month => _values[locale.languageCode]?['month'] ?? _values['en']!['month']!;
  String get year => _values[locale.languageCode]?['year'] ?? _values['en']!['year']!;
  String get totalShifts => _values[locale.languageCode]?['total_shifts'] ?? _values['en']!['total_shifts']!;
  String get totalHours => _values[locale.languageCode]?['total_hours'] ?? _values['en']!['total_hours']!;
  String get totalEarned => _values[locale.languageCode]?['total_earned'] ?? _values['en']!['total_earned']!;
  String get extraContributions => _values[locale.languageCode]?['extra_contributions'] ?? _values['en']!['extra_contributions']!;
  String get addPlace => _values[locale.languageCode]?['add_place'] ?? _values['en']!['add_place']!;
  String get workplaces => _values[locale.languageCode]?['workplaces'] ?? _values['en']!['workplaces']!;
  String get appName => _values[locale.languageCode]?['app_name'] ?? _values['en']!['app_name']!;
}

class AppLocalizationsDelegate extends LocalizationsDelegate<AppLocalizations> {
  const AppLocalizationsDelegate();

  @override
  bool isSupported(Locale locale) => ['ru', 'en'].contains(locale.languageCode);

  @override
  Future<AppLocalizations> load(Locale locale) async {
    return AppLocalizations(locale);
  }

  @override
  bool shouldReload(covariant LocalizationsDelegate<AppLocalizations> old) => false;
}
