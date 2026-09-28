import 'package:flutter/material.dart';

class AppTheme {
  static ThemeData lightTheme = ThemeData(
    brightness: Brightness.light,
    scaffoldBackgroundColor: const Color(0xFFF5F7FF),
    colorScheme: const ColorScheme.light(
      primary: Color(0xFF627CFF),
      secondary: Color(0xFF87C6FF),
      surface: Color(0xFFF7F9FF),
      onSurface: Color(0xFF121826),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: Color(0xFF121826),
      elevation: 0,
    ),
  );

  static ThemeData darkTheme = ThemeData(
    brightness: Brightness.dark,
    scaffoldBackgroundColor: const Color(0xFF0D1320),
    colorScheme: const ColorScheme.dark(
      primary: Color(0xFF7EA1FF),
      secondary: Color(0xFF7FC7FF),
      surface: Color(0xFF171E2A),
      onSurface: Color(0xFFF3F7FF),
    ),
    appBarTheme: const AppBarTheme(
      backgroundColor: Colors.transparent,
      foregroundColor: Color(0xFFF3F7FF),
      elevation: 0,
    ),
  );
}
