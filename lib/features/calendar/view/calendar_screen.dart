import 'dart:ui';
import 'package:flutter/material.dart';
import 'package:intl/intl.dart';
import 'package:table_calendar/table_calendar.dart';
import '../../../data/models/shift_model.dart';
import '../../../data/models/workplace_model.dart';

class CalendarScreen extends StatefulWidget {
  const CalendarScreen({super.key});

  @override
  State<CalendarScreen> createState() => _CalendarScreenState();
}

class _CalendarScreenState extends State<CalendarScreen> {
  DateTime _focusedDay = DateTime.now();
  DateTime _selectedDay = DateTime.now();

  final List<WorkplaceModel> _workplaces = [
    WorkplaceModel(
      id: '1',
      name: 'Сеть "Лето"',
      hourlyRate: 650,
      color: const Color(0xFF61D4FF),
      createdAt: DateTime.now(),
    ),
    WorkplaceModel(
      id: '2',
      name: 'Кофейня "Оазис"',
      hourlyRate: 520,
      color: const Color(0xFF6EE7A7),
      createdAt: DateTime.now(),
    ),
    WorkplaceModel(
      id: '3',
      name: 'Доставка "Быстрый путь"',
      hourlyRate: 780,
      color: const Color(0xFFFFB86C),
      createdAt: DateTime.now(),
    ),
  ];

  final Map<DateTime, List<ShiftModel>> _shifts = {
    DateTime(2026, 9, 5): [
      ShiftModel(id: 's1', workplaceId: '1', date: DateTime(2026, 9, 5), hours: 7),
      ShiftModel(id: 's2', workplaceId: '2', date: DateTime(2026, 9, 5), hours: 5),
    ],
    DateTime(2026, 9, 12): [
      ShiftModel(id: 's3', workplaceId: '3', date: DateTime(2026, 9, 12), hours: 8),
    ],
    DateTime(2026, 9, 20): [
      ShiftModel(id: 's4', workplaceId: '1', date: DateTime(2026, 9, 20), hours: 6.5),
    ],
  };

  List<ShiftModel> _getEventsForDay(DateTime day) {
    final normalized = DateTime(day.year, day.month, day.day);
    return _shifts[normalized] ?? [];
  }

  Color _getDayColor(DateTime day) {
    final events = _getEventsForDay(day);
    if (events.isEmpty) return Colors.transparent;

    final colors = events
        .map((event) => _workplaces
            .firstWhere((w) => w.id == event.workplaceId, orElse: () => _workplaces.first)
            .color)
        .toList();

    if (colors.length == 1) return colors.first.withOpacity(0.45);
    return Color.alphaBlend(colors.first.withOpacity(0.5), colors.last.withOpacity(0.4));
  }

  void _onDaySelected(DateTime selectedDay, DateTime focusedDay) {
    setState(() {
      _selectedDay = selectedDay;
      _focusedDay = focusedDay;
    });
    _showShiftSheet(selectedDay);
  }

  Future<void> _showShiftSheet(DateTime date) async {
    final selectedWorkplace = _workplaces.first;
    final hoursController = TextEditingController(text: '8');
    String selectedId = selectedWorkplace.id;

    await showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) {
        return Padding(
          padding: EdgeInsets.only(bottom: MediaQuery.of(context).viewInsets.bottom),
          child: Container(
            margin: const EdgeInsets.all(12),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.12),
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(28),
                bottom: Radius.circular(28),
              ),
              border: Border.all(color: Colors.white.withOpacity(0.18)),
            ),
            child: ClipRRect(
              borderRadius: const BorderRadius.vertical(
                top: Radius.circular(28),
                bottom: Radius.circular(28),
              ),
              child: BackdropFilter(
                filter: ImageFilter.blur(sigmaX: 20, sigmaY: 20),
                child: Container(
                  padding: const EdgeInsets.fromLTRB(20, 20, 20, 28),
                  decoration: BoxDecoration(
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Colors.white.withOpacity(0.12), Colors.white.withOpacity(0.06)],
                    ),
                  ),
                  child: StatefulBuilder(
                    builder: (context, setBottomState) {
                      final workplace = _workplaces.firstWhere(
                        (w) => w.id == selectedId,
                        orElse: () => selectedWorkplace,
                      );
                      final hours = double.tryParse(hoursController.text) ?? 0;
                      final income = hours * workplace.hourlyRate;

                      return Column(
                        mainAxisSize: MainAxisSize.min,
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Expanded(
                                child: Text(
                                  'Добавить смену',
                                  style: TextStyle(
                                    fontSize: 24,
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ),
                              IconButton(
                                onPressed: () => Navigator.pop(context),
                                icon: const Icon(Icons.close_rounded, color: Colors.white),
                              ),
                            ],
                          ),
                          const SizedBox(height: 12),
                          Text(
                            DateFormat('d MMMM yyyy', 'ru').format(date),
                            style: const TextStyle(color: Colors.white70, fontSize: 16),
                          ),
                          const SizedBox(height: 20),
                          DropdownButtonFormField<String>(
                            value: selectedId,
                            dropdownColor: const Color(0xFF171D2A),
                            decoration: InputDecoration(
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(18),
                                borderSide: BorderSide.none,
                              ),
                              hintText: 'Место работы',
                            ),
                            style: const TextStyle(color: Colors.white),
                            items: _workplaces
                                .map(
                                  (w) => DropdownMenuItem(
                                    value: w.id,
                                    child: Row(
                                      children: [
                                        Container(
                                          width: 12,
                                          height: 12,
                                          decoration: BoxDecoration(
                                            color: w.color,
                                            shape: BoxShape.circle,
                                          ),
                                        ),
                                        const SizedBox(width: 8),
                                        Text(w.name),
                                      ],
                                    ),
                                  ),
                                )
                                .toList(),
                            onChanged: (value) {
                              if (value != null) setBottomState(() => selectedId = value);
                            },
                          ),
                          const SizedBox(height: 16),
                          TextFormField(
                            controller: hoursController,
                            keyboardType: const TextInputType.numberWithOptions(decimal: true),
                            style: const TextStyle(color: Colors.white),
                            decoration: InputDecoration(
                              labelText: 'Часы',
                              labelStyle: const TextStyle(color: Colors.white70),
                              filled: true,
                              fillColor: Colors.white.withOpacity(0.08),
                              border: OutlineInputBorder(
                                borderRadius: BorderRadius.circular(18),
                                borderSide: BorderSide.none,
                              ),
                            ),
                            onChanged: (_) => setBottomState(() {}),
                          ),
                          const SizedBox(height: 20),
                          Container(
                            width: double.infinity,
                            padding: const EdgeInsets.all(18),
                            decoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.08),
                              borderRadius: BorderRadius.circular(20),
                            ),
                            child: Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                const Text(
                                  'Доход',
                                  style: TextStyle(color: Colors.white70, fontSize: 16),
                                ),
                                Text(
                                  '${income.toStringAsFixed(0)} ₽',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontSize: 20,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              ],
                            ),
                          ),
                          const SizedBox(height: 20),
                          SizedBox(
                            width: double.infinity,
                            child: FilledButton(
                              onPressed: () {
                                final parsed = double.tryParse(hoursController.text) ?? 0;
                                if (parsed <= 0) return;

                                final shift = ShiftModel(
                                  id: '${DateTime.now().millisecondsSinceEpoch}',
                                  workplaceId: selectedId,
                                  date: date,
                                  hours: parsed,
                                );

                                setState(() {
                                  final normalized = DateTime(date.year, date.month, date.day);
                                  _shifts[normalized] ??= [];
                                  _shifts[normalized]!.add(shift);
                                });

                                Navigator.pop(context);
                              },
                              style: FilledButton.styleFrom(
                                backgroundColor: const Color(0xFF7C9CFF),
                                foregroundColor: Colors.white,
                                padding: const EdgeInsets.symmetric(vertical: 16),
                                shape: RoundedRectangleBorder(
                                  borderRadius: BorderRadius.circular(18),
                                ),
                              ),
                              child: const Text('Сохранить'),
                            ),
                          ),
                        ],
                      );
                    },
                  ),
                ),
              ),
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final monthLabel = DateFormat('LLLL yyyy', 'ru').format(_focusedDay);

    return Scaffold(
      backgroundColor: Theme.of(context).scaffoldBackgroundColor,
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.fromLTRB(16, 18, 16, 12),
          child: Column(
            children: [
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 16),
                decoration: BoxDecoration(
                  borderRadius: BorderRadius.circular(24),
                  border: Border.all(color: Colors.white.withOpacity(0.15)),
                  gradient: LinearGradient(
                    colors: [Colors.white.withOpacity(0.12), Colors.white.withOpacity(0.06)],
                    begin: Alignment.topLeft,
                    end: Alignment.bottomRight,
                  ),
                ),
                child: Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      monthLabel,
                      style: const TextStyle(
                        color: Colors.white,
                        fontSize: 22,
                        fontWeight: FontWeight.w700,
                      ),
                    ),
                    FilledButton(
                      onPressed: () {
                        final now = DateTime.now();
                        setState(() {
                          _focusedDay = now;
                          _selectedDay = now;
                        });
                      },
                      style: FilledButton.styleFrom(
                        backgroundColor: Colors.white.withOpacity(0.12),
                        foregroundColor: Colors.white,
                        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
                      ),
                      child: const Text('Сегодня'),
                    ),
                  ],
                ),
              ),
              const SizedBox(height: 16),
              Expanded(
                child: Container(
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(26),
                    border: Border.all(color: Colors.white.withOpacity(0.12)),
                    gradient: LinearGradient(
                      begin: Alignment.topLeft,
                      end: Alignment.bottomRight,
                      colors: [Colors.white.withOpacity(0.12), Colors.white.withOpacity(0.05)],
                    ),
                  ),
                  child: ClipRRect(
                    borderRadius: BorderRadius.circular(26),
                    child: BackdropFilter(
                      filter: ImageFilter.blur(sigmaX: 18, sigmaY: 18),
                      child: Padding(
                        padding: const EdgeInsets.all(8),
                        child: TableCalendar<ShiftModel>(
                          firstDay: DateTime.utc(2024, 1, 1),
                          lastDay: DateTime.utc(2035, 12, 31),
                          focusedDay: _focusedDay,
                          selectedDayPredicate: (day) => isSameDay(day, _selectedDay),
                          eventLoader: _getEventsForDay,
                          onDaySelected: _onDaySelected,
                          onPageChanged: (newFocusedDay) => setState(() => _focusedDay = newFocusedDay),
                          locale: 'ru_RU',
                          headerVisible: false,
                          daysOfWeekStyle: const DaysOfWeekStyle(
                            weekdayStyle: TextStyle(color: Colors.white70),
                            weekendStyle: TextStyle(color: Colors.white70),
                          ),
                          calendarStyle: CalendarStyle(
                            outsideDaysVisible: false,
                            defaultTextStyle: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                            ),
                            weekendTextStyle: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                            ),
                            holidayTextStyle: const TextStyle(
                              color: Colors.white,
                              fontWeight: FontWeight.w500,
                            ),
                            selectedDecoration: const BoxDecoration(
                              color: Color(0xFF7C9CFF),
                              shape: BoxShape.circle,
                            ),
                            todayDecoration: BoxDecoration(
                              color: Colors.white.withOpacity(0.18),
                              shape: BoxShape.circle,
                            ),
                            cellMargin: const EdgeInsets.all(4),
                          ),
                          calendarBuilders: CalendarBuilders(
                            defaultBuilder: (context, day, focusedDay) {
                              final bgColor = _getDayColor(day);
                              return AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  color: bgColor,
                                  borderRadius: BorderRadius.circular(12),
                                ),
                                alignment: Alignment.center,
                                child: Text('${day.day}', style: const TextStyle(color: Colors.white)),
                              );
                            },
                            todayBuilder: (context, day, focusedDay) {
                              final bgColor = _getDayColor(day);
                              return AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  color: bgColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.white.withOpacity(0.4), width: 1.2),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  '${day.day}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              );
                            },
                            selectedBuilder: (context, day, focusedDay) {
                              final bgColor = _getDayColor(day);
                              return AnimatedContainer(
                                duration: const Duration(milliseconds: 200),
                                margin: const EdgeInsets.all(2),
                                decoration: BoxDecoration(
                                  color: bgColor,
                                  borderRadius: BorderRadius.circular(12),
                                  border: Border.all(color: Colors.white.withOpacity(0.5), width: 1.4),
                                ),
                                alignment: Alignment.center,
                                child: Text(
                                  '${day.day}',
                                  style: const TextStyle(
                                    color: Colors.white,
                                    fontWeight: FontWeight.w700,
                                  ),
                                ),
                              );
                            },
                          ),
                        ),
                      ),
                    ),
                  ),
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }
}
