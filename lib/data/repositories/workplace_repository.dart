import 'package:hive_flutter/hive_flutter.dart';

class HiveService {
  static const String workplacesBoxName = 'workplaces';
  static const String shiftsBoxName = 'shifts';

  static Future<void> init() async {
    await Hive.initFlutter();
    await Hive.openBox(workplacesBoxName);
    await Hive.openBox(shiftsBoxName);
  }

  static Box get workplacesBox => Hive.box(workplacesBoxName);
  static Box get shiftsBox => Hive.box(shiftsBoxName);
}
