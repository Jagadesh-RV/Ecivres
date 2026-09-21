import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const ProviderPayoutScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Stripe Connect Payouts</Text>
      <View style={styles.card}>
        <Text style={styles.label}>Available Balance</Text>
        <Text style={styles.amount}>$450.00</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Express Dashboard</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 22, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  card: { padding: 20, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  label: { fontSize: 14, color: '#64748b' },
  amount: { fontSize: 32, fontWeight: '800', color: '#10b981', marginVertical: 8 },
  button: { marginTop: 12, paddingVertical: 12, backgroundColor: '#2563eb', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
