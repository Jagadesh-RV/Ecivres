import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const ProviderEarningsScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Revenue & Payout Statement</Text>
      <Text style={styles.subtitle}>Track completed bookings and request Stripe transfers.</Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Available Balance</Text>
        <Text style={styles.balanceText}>$1,240.50</Text>
        <TouchableOpacity style={styles.payoutBtn}>
          <Text style={styles.payoutText}>Request Instant Payout</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>This Month</Text>
          <Text style={styles.statVal}>$3,450.00</Text>
        </View>
        <View style={styles.statBox}>
          <Text style={styles.statLabel}>Total Earned</Text>
          <Text style={styles.statVal}>$18,920.00</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  card: { padding: 20, backgroundColor: '#4f46e5', borderRadius: 16, marginBottom: 16 },
  cardLabel: { fontSize: 12, color: '#c7d2fe', fontWeight: '600' },
  balanceText: { fontSize: 32, fontWeight: 'bold', color: '#ffffff', marginVertical: 8 },
  payoutBtn: { backgroundColor: '#ffffff', paddingVertical: 10, borderRadius: 10, alignItems: 'center' },
  payoutText: { color: '#4f46e5', fontWeight: 'bold', fontSize: 13 },
  statsRow: { flexDirection: 'row', gap: 12 },
  statBox: { flex: 1, padding: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  statLabel: { fontSize: 12, color: '#64748b' },
  statVal: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginTop: 4 },
});
