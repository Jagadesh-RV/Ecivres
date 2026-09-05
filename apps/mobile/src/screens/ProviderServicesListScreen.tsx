import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList } from 'react-native';

export const ProviderServicesListScreen = () => {
  const services = [
    { id: '1', title: 'Deep Carpet Cleaning', price: '$120.00', status: 'Active' },
    { id: '2', title: 'HVAC Duct Maintenance', price: '$180.00', status: 'Active' },
    { id: '3', title: 'Water Heater Flush', price: '$95.00', status: 'Paused' },
  ];

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>My Active Offerings</Text>
        <TouchableOpacity style={styles.addBtn}>
          <Text style={styles.addText}>+ Add Service</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardPrice}>{item.price}</Text>
            </View>
            <View style={[styles.badge, item.status === 'Active' ? styles.activeBadge : styles.pausedBadge]}>
              <Text style={styles.badgeText}>{item.status}</Text>
            </View>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  header: { flexDirection: 'row', justifyBetween: 'space-between', alignItems: 'center', marginBottom: 16 },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  addBtn: { backgroundColor: '#4f46e5', paddingHorizontal: 12, paddingVertical: 8, borderRadius: 8 },
  addText: { color: '#ffffff', fontWeight: 'bold', fontSize: 12 },
  card: { padding: 14, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  cardPrice: { fontSize: 12, fontWeight: '600', color: '#4f46e5', marginTop: 2 },
  badge: { paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12 },
  activeBadge: { backgroundColor: '#dcfce7' },
  pausedBadge: { backgroundColor: '#f3f4f6' },
  badgeText: { fontSize: 11, fontWeight: '600', color: '#166534' },
});
