import 'package:flutter/material.dart';

class SettingsScreen extends StatelessWidget {
  final ThemeMode themeMode;
  final Locale locale;
  final ValueChanged<ThemeMode> onThemeChanged;
  final ValueChanged<Locale> onLocaleChanged;

  const SettingsScreen({
    super.key,
    required this.themeMode,
    required this.locale,
    required this.onThemeChanged,
    required this.onLocaleChanged,
  });

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.all(16),
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              const Text(
                'Настройки',
                style: TextStyle(
                  fontSize: 28,
                  fontWeight: FontWeight.w700,
                  color: Colors.white,
                ),
              ),
              const SizedBox(height: 20),
              _SectionCard(
                title: 'Тема',
                child: Column(
                  children: [
                    _OptionTile(
                      title: 'Системная',
                      selected: themeMode == ThemeMode.system,
                      onTap: () => onThemeChanged(ThemeMode.system),
                    ),
                    _OptionTile(
                      title: 'Светлая',
                      selected: themeMode == ThemeMode.light,
                      onTap: () => onThemeChanged(ThemeMode.light),
                    ),
                    _OptionTile(
                      title: 'Темная',
                      selected: themeMode == ThemeMode.dark,
                      onTap: () => onThemeChanged(ThemeMode.dark),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              _SectionCard(
                title: 'Язык',
                child: Column(
                  children: [
                    _OptionTile(
                      title: 'Русский',
                      selected: locale.languageCode == 'ru',
                      onTap: () => onLocaleChanged(const Locale('ru')),
                    ),
                    _OptionTile(
                      title: 'English',
                      selected: locale.languageCode == 'en',
                      onTap: () => onLocaleChanged(const Locale('en')),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 18),
              _SectionCard(
                title: 'Информация',
                child: Column(
                  children: [
                    _OptionTile(
                      title: 'Пользовательское соглашение',
                      selected: false,
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => AlertDialog(
                            title: const Text('Пользовательское соглашение'),
                            content: const Text(
                              'Приложение ShiftFlow предназначено для управления сменами и финансовыми данными. ' 
                              'Все данные хранятся локально на устройстве и не передаются без согласия пользователя.',
                            ),
                            actions: [
                              TextButton(
                                onPressed: () => Navigator.pop(context),
                                child: const Text('Закрыть'),
                              ),
                            ],
                          ),
                        );
                      },
                    ),
                    _OptionTile(
                      title: 'О приложении',
                      selected: false,
                      onTap: () {
                        showDialog(
                          context: context,
                          builder: (context) => const AlertDialog(
                            title: Text('ShiftFlow'),
                            content: Text('Версия 1.0.0\nFlutter • Glassmorphism UI • Offline-first'),
                          ),
                        );
                      },
                    ),
                    _OptionTile(
                      title: 'Экспорт данных',
                      selected: false,
                      onTap: () {},
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}

class _SectionCard extends StatelessWidget {
  final String title;
  final Widget child;

  const _SectionCard({
    required this.title,
    required this.child,
  });

  @override
  Widget build(BuildContext context) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        borderRadius: BorderRadius.circular(24),
        color: Colors.white.withOpacity(0.08),
        border: Border.all(color: Colors.white.withOpacity(0.12)),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            title,
            style: const TextStyle(
              color: Colors.white,
              fontSize: 18,
              fontWeight: FontWeight.w700,
            ),
          ),
          const SizedBox(height: 12),
          child,
        ],
      ),
    );
  }
}

class _OptionTile extends StatelessWidget {
  final String title;
  final bool selected;
  final VoidCallback onTap;

  const _OptionTile({
    required this.title,
    required this.selected,
    required this.onTap,
  });

  @override
  Widget build(BuildContext context) {
    return InkWell(
      borderRadius: BorderRadius.circular(16),
      onTap: onTap,
      child: Container(
        margin: const EdgeInsets.only(bottom: 8),
        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 12),
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(16),
          color: selected ? const Color(0xFF6E82FF).withOpacity(0.28) : Colors.white.withOpacity(0.04),
        ),
        child: Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              title,
              style: const TextStyle(
                color: Colors.white,
                fontWeight: FontWeight.w600,
              ),
            ),
            if (selected)
              const Icon(Icons.check_rounded, color: Colors.white),
          ],
        ),
      ),
    );
  }
}
