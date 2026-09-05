import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Switch } from 'react-native';

export const ProviderAvailabilityCalendarScreen = () => {
  const [days, setDays] = useState([
    { day: 'Monday', active: true, open: '09:00 AM', close: '05:00 PM' },
    { day: 'Tuesday', active: true, open: '09:00 AM', close: '05:00 PM' },
    { day: 'Wednesday', active: true, open: '09:00 AM', close: '05:00 PM' },
    { day: 'Thursday', active: true, open: '09:00 AM', close: '05:00 PM' },
    { day: 'Friday', active: true, open: '09:00 AM', close: '05:00 PM' },
    { day: 'Saturday', active: false, open: '10:00 AM', close: '03:00 PM' },
    { day: 'Sunday', active: false, open: '10:00 AM', close: '03:00 PM' },
  ]);

  const toggleDay = (index: number) => {
    const next = [...days];
    next[index].active = !next[index].active;
    setDays(next);
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Provider Availability Schedule</Text>
      <Text style={styles.subtitle}>Configure mobile working hours for instant client booking.</Text>

      <View style={styles.list}>
        {days.map((item, idx) => (
          <View key={item.day} style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.dayText}>{item.day}</Text>
              <Switch value={item.active} onValueChange={() => toggleDay(idx)} />
            </View>
            {item.active ? (
              <Text style={styles.timeText}>Hours: {item.open} - {item.close}</Text>
            ) : (
              <Text style={styles.closedText}>Off Day / Unavailable</Text>
            )}
          </View>
        ))}
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  list: { gap: 10 },
  card: { padding: 14, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  dayText: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  timeText: { fontSize: 12, color: '#475569', marginTop: 4 },
  closedText: { fontSize: 12, color: '#94a3b8', fontStyle: 'italic', marginTop: 4 },
});
