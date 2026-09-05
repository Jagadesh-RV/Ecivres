import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const AdminOverviewScreen = () => {
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Super Admin Mobile Control</Text>
      <Text style={styles.subtitle}>Real-time platform metrics & governance.</Text>

      <View style={styles.grid}>
        <View style={styles.card}>
          <Text style={styles.cardVal}>1,248</Text>
          <Text style={styles.cardLabel}>Total Users</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardVal}>142</Text>
          <Text style={styles.cardLabel}>Providers</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardVal}>$48.2k</Text>
          <Text style={styles.cardLabel}>Gross Volume</Text>
        </View>
        <View style={styles.card}>
          <Text style={styles.cardVal}>5</Text>
          <Text style={styles.cardLabel}>Pending Approvals</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  grid: { flexDirection: 'row', flexWrap: 'wrap', gap: 12 },
  card: { width: '47%', padding: 16, backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0' },
  cardVal: { fontSize: 22, fontWeight: 'bold', color: '#dc2626' },
  cardLabel: { fontSize: 12, color: '#64748b', marginTop: 4 },
});
