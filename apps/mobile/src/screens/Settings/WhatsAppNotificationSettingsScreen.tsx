import React, { useState } from 'react';
import { View, Text, StyleSheet, Switch } from 'react-native';

export const WhatsAppNotificationSettingsScreen = () => {
  const [enabled, setEnabled] = useState(true);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>WhatsApp Notifications</Text>
      <View style={styles.row}>
        <Text style={styles.label}>Receive Booking Updates on WhatsApp</Text>
        <Switch value={enabled} onValueChange={setEnabled} trackColor={{ false: '#cbd5e1', true: '#10b981' }} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'between', alignItems: 'center', padding: 16, backgroundColor: '#ffffff', borderRadius: 10 },
  label: { fontSize: 14, color: '#334155', flex: 1 },
});
