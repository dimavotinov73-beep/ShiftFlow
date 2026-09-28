import 'package:flutter/material.dart';

import 'app/app_localizations.dart';
import 'app/app_theme.dart';
import 'features/home/home_shell.dart';

class ShiftFlowApp extends StatefulWidget {
  const ShiftFlowApp({super.key});

  @override
  State<ShiftFlowApp> createState() => _ShiftFlowAppState();
}

class _ShiftFlowAppState extends State<ShiftFlowApp> {
  ThemeMode _themeMode = ThemeMode.system;
  Locale _locale = const Locale('ru');

  void _onThemeChanged(ThemeMode mode) {
    setState(() {
      _themeMode = mode;
    });
  }

  void _onLocaleChanged(Locale locale) {
    setState(() {
      _locale = locale;
    });
  }

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'ShiftFlow',
      debugShowCheckedModeBanner: false,
      themeMode: _themeMode,
      theme: AppTheme.lightTheme,
      darkTheme: AppTheme.darkTheme,
      locale: _locale,
      supportedLocales: const [Locale('ru'), Locale('en')],
      localizationsDelegates: const [
        AppLocalizationsDelegate(),
        DefaultWidgetsLocalizations.delegate,
        DefaultMaterialLocalizations.delegate,
        DefaultCupertinoLocalizations.delegate,
      ],
      home: HomeShell(
        themeMode: _themeMode,
        locale: _locale,
        onThemeChanged: _onThemeChanged,
        onLocaleChanged: _onLocaleChanged,
      ),
    );
  }
}
