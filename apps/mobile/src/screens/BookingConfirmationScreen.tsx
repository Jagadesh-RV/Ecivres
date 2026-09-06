import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const BookingConfirmationScreen = () => {
  return (
    <View style={styles.container}>
      <View style={styles.iconCircle}>
        <Text style={styles.check}>✓</Text>
      </View>

      <Text style={styles.title}>Booking Dispatched!</Text>
      <Text style={styles.subtitle}>Your appointment request has been sent to the service provider.</Text>

      <View style={styles.detailsCard}>
        <View style={styles.row}>
          <Text style={styles.label}>Service</Text>
          <Text style={styles.val}>Deep Carpet Cleaning</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Scheduled Date</Text>
          <Text style={styles.val}>Oct 15, 2026 @ 10:00 AM</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Estimated Cost</Text>
          <Text style={styles.price}>$120.00</Text>
        </View>
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.btnText}>View My Bookings</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc', alignItems: 'center', justifyContent: 'center' },
  iconCircle: { width: 70, height: 70, borderRadius: 35, backgroundColor: '#dcfce7', justifyContent: 'center', alignItems: 'center', marginBottom: 16 },
  check: { fontSize: 32, color: '#166534', fontWeight: 'bold' },
  title: { fontSize: 22, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', textAlign: 'center', marginTop: 4, marginBottom: 20 },
  detailsCard: { width: '100%', padding: 16, backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', gap: 12, marginBottom: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between' },
  label: { fontSize: 12, color: '#64748b' },
  val: { fontSize: 13, fontWeight: '600', color: '#1e293b' },
  price: { fontSize: 14, fontWeight: 'bold', color: '#4f46e5' },
  button: { width: '100%', paddingVertical: 14, borderRadius: 12, backgroundColor: '#4f46e5', alignItems: 'center' },
  btnText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
