import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const TimeSlotSelectionScreen = () => {
  const [selectedSlot, setSelectedSlot] = useState<string | null>(null);

  const slots = [
    { time: '09:00 AM', available: true },
    { time: '10:00 AM', available: true },
    { time: '11:00 AM', available: false },
    { time: '01:00 PM', available: true },
    { time: '02:00 PM', available: true },
    { time: '03:00 PM', available: true },
    { time: '04:00 PM', available: false },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Select Booking Time Slot</Text>
      <Text style={styles.subtitle}>Choose an available appointment window.</Text>

      <View style={styles.grid}>
        {slots.map((slot) => (
          <TouchableOpacity
            key={slot.time}
            disabled={!slot.available}
            onPress={() => setSelectedSlot(slot.time)}
            style={[
              styles.slotBtn,
              selectedSlot === slot.time && styles.selectedSlot,
              !slot.available && styles.disabledSlot,
            ]}
          >
            <Text
              style={[
                styles.slotText,
                selectedSlot === slot.time && styles.selectedText,
                !slot.available && styles.disabledText,
              ]}
            >
              {slot.time}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 10 },
  slotBtn: {
    width: '30%',
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
    alignItems: 'center',
    backgroundColor: '#ffffff',
  },
  selectedSlot: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  disabledSlot: { backgroundColor: '#f1f5f9', borderColor: '#e2e8f0' },
  slotText: { fontSize: 12, fontWeight: '600', color: '#1e293b' },
  selectedText: { color: '#ffffff' },
  disabledText: { color: '#94a3b8' },
});
