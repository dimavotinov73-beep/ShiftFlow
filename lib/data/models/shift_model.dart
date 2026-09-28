class ShiftModel {
  final String id;
  final String workplaceId;
  final DateTime date;
  final double hours;
  final String? note;

  ShiftModel({
    required this.id,
    required this.workplaceId,
    required this.date,
    required this.hours,
    this.note,
  });

  double income(double hourlyRate) => hours * hourlyRate;

  factory ShiftModel.fromMap(Map<String, dynamic> map) {
    return ShiftModel(
      id: map['id'] as String,
      workplaceId: map['workplaceId'] as String,
      date: DateTime.parse(map['date'] as String),
      hours: (map['hours'] as num).toDouble(),
      note: map['note'] as String?,
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'workplaceId': workplaceId,
      'date': date.toIso8601String(),
      'hours': hours,
      'note': note,
    };
  }
}
