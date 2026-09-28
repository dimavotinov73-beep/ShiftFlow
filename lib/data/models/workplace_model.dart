import 'package:flutter/material.dart';

class WorkplaceModel {
  final String id;
  final String name;
  final double hourlyRate;
  final Color color;
  final DateTime createdAt;

  WorkplaceModel({
    required this.id,
    required this.name,
    required this.hourlyRate,
    required this.color,
    required this.createdAt,
  });

  factory WorkplaceModel.fromMap(Map<String, dynamic> map) {
    return WorkplaceModel(
      id: map['id'] as String,
      name: map['name'] as String,
      hourlyRate: (map['hourlyRate'] as num).toDouble(),
      color: Color(map['color'] as int),
      createdAt: DateTime.parse(map['createdAt'] as String),
    );
  }

  Map<String, dynamic> toMap() {
    return {
      'id': id,
      'name': name,
      'hourlyRate': hourlyRate,
      'color': color.value,
      'createdAt': createdAt.toIso8601String(),
    };
  }
}
