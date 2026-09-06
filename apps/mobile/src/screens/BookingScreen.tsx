import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, TextInput } from 'react-native';

export const BookingScreen = () => {
  const [selectedDate, setSelectedDate] = useState('2026-10-15');
  const [selectedTime, setSelectedTime] = useState('10:00 AM');
  const [notes, setNotes] = useState('');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Book Appointment</Text>
      <Text style={styles.subtitle}>Select preferred date, time window, and special requests.</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Selected Date: {selectedDate}</Text>
        {/* Date Selector Chips */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.chipRow}>
          {['2026-10-15', '2026-10-16', '2026-10-17', '2026-10-18'].map((d) => (
            <TouchableOpacity key={d} onPress={() => setSelectedDate(d)} style={[styles.chip, selectedDate === d && styles.activeChip]}>
              <Text style={[styles.chipText, selectedDate === d && styles.activeChipText]}>{d}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Selected Time Slot: {selectedTime}</Text>
        <View style={styles.timeGrid}>
          {['09:00 AM', '10:00 AM', '01:00 PM', '03:00 PM'].map((t) => (
            <TouchableOpacity key={t} onPress={() => setSelectedTime(t)} style={[styles.timeBtn, selectedTime === t && styles.activeTimeBtn]}>
              <Text style={[styles.timeText, selectedTime === t && styles.activeTimeText]}>{t}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.section}>
        <Text style={styles.label}>Special Instructions</Text>
        <TextInput placeholder="Add notes for provider..." value={notes} onChangeText={setNotes} style={styles.textArea} multiline />
      </View>

      <TouchableOpacity style={styles.confirmBtn}>
        <Text style={styles.confirmText}>Confirm & Book Service</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
  chipRow: { flexDirection: 'row' },
  chip: { paddingHorizontal: 12, paddingVertical: 8, borderRadius: 10, backgroundColor: '#f1f5f9', marginRight: 8 },
  activeChip: { backgroundColor: '#4f46e5' },
  chipText: { fontSize: 12, color: '#475569', fontWeight: '600' },
  activeChipText: { color: '#ffffff' },
  timeGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  timeBtn: { width: '48%', paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  activeTimeBtn: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  timeText: { fontSize: 12, fontWeight: '600', color: '#334155' },
  activeTimeText: { color: '#ffffff' },
  textArea: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 10, fontSize: 13, height: 80 },
  confirmBtn: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  confirmText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
