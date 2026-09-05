import React from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';

export const NotificationCenterScreen = () => {
  const notifications = [
    { id: '1', title: 'Booking Confirmed!', desc: 'Apex Plumbing confirmed your booking for tomorrow at 10:00 AM.', time: '2m ago' },
    { id: '2', title: 'Special Promo Offer', desc: 'Use coupon CLEAN20 for 20% off your next home cleaning booking.', time: '1h ago' },
    { id: '3', title: 'Service Completed', desc: 'Please rate your experience with Sparkle Clean LLC.', time: '1d ago' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Notifications & Alerts</Text>
      <Text style={styles.subtitle}>Recent updates on your bookings and account.</Text>

      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.time}>{item.time}</Text>
            </View>
            <Text style={styles.desc}>{item.desc}</Text>
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  card: { padding: 14, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b' },
  time: { fontSize: 11, color: '#94a3b8' },
  desc: { fontSize: 12, color: '#475569', marginTop: 4 },
});
