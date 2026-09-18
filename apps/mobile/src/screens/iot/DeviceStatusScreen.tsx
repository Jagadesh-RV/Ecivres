import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

interface DeviceItem {
  id: string;
  name: string;
  status: 'ONLINE' | 'OFFLINE';
}

const MOCK_DEVICES: DeviceItem[] = [
  { id: 'dev_1', name: 'Smart HVAC Sensor', status: 'ONLINE' },
  { id: 'dev_2', name: 'Water Leak Detector', status: 'ONLINE' },
  { id: 'dev_3', name: 'Solar Inverter Gateway', status: 'OFFLINE' },
];

export function DeviceStatusScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Connected IoT Smart Devices</Text>
      <FlatList
        data={MOCK_DEVICES}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.deviceName}>{item.name}</Text>
            <Text style={item.status === 'ONLINE' ? styles.onlineText : styles.offlineText}>
              {item.status}
            </Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', marginBottom: 16, color: '#0f172a' },
  card: { padding: 16, backgroundColor: '#ffffff', borderRadius: 12, marginBottom: 12, flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  deviceName: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  onlineText: { fontSize: 12, color: '#10b981', fontWeight: 'bold' },
  offlineText: { fontSize: 12, color: '#64748b', fontWeight: 'bold' },
});
