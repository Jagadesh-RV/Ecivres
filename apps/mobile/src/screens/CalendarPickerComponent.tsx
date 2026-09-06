import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

interface CalendarPickerComponentProps {
  onSelectDate: (date: string) => void;
  selectedDate: string;
}

export const CalendarPickerComponent: React.FC<CalendarPickerComponentProps> = ({ onSelectDate, selectedDate }) => {
  const sampleDates = [
    { day: 'Mon', date: '15' },
    { day: 'Tue', date: '16' },
    { day: 'Wed', date: '17' },
    { day: 'Thu', date: '18' },
    { day: 'Fri', date: '19' },
  ];

  return (
    <View style={styles.container}>
      {sampleDates.map((item) => {
        const fullDate = `2026-10-${item.date}`;
        const isSelected = selectedDate === fullDate;
        return (
          <TouchableOpacity
            key={item.date}
            onPress={() => onSelectDate(fullDate)}
            style={[styles.box, isSelected && styles.activeBox]}
          >
            <Text style={[styles.day, isSelected && styles.activeText]}>{item.day}</Text>
            <Text style={[styles.date, isSelected && styles.activeText]}>{item.date}</Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10 },
  box: { width: 50, height: 60, borderRadius: 12, backgroundColor: '#f1f5f9', justifyContent: 'center', alignItems: 'center' },
  activeBox: { backgroundColor: '#4f46e5' },
  day: { fontSize: 11, color: '#64748b', fontWeight: '600' },
  date: { fontSize: 16, color: '#0f172a', fontWeight: 'bold', marginTop: 2 },
  activeText: { color: '#ffffff' },
});
