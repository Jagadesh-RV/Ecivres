import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';

export const MarketHealthMapScreen: React.FC = () => {
  const regions = [
    { name: 'US-East (N. Virginia)', health: 98, friction: 'LOW', supply: 'HIGH' },
    { name: 'US-West (Oregon)', health: 87, friction: 'MEDIUM', supply: 'MODERATE' },
    { name: 'EU-Central (Frankfurt)', health: 92, friction: 'LOW', supply: 'HIGH' },
    { name: 'APAC-South (Mumbai)', health: 79, friction: 'HIGH', supply: 'CONSTRAINED' },
  ];

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Global Market Health Matrix</Text>
      <Text style={styles.subtitle}>Geospatial market friction & liquidity index</Text>

      {regions.map((r, idx) => (
        <View key={idx} style={styles.card}>
          <View style={styles.row}>
            <Text style={styles.regionName}>{r.name}</Text>
            <Text style={[styles.healthScore, { color: r.health > 90 ? '#34d399' : '#fbbf24' }]}>
              {r.health}%
            </Text>
          </View>
          <View style={styles.detailsRow}>
            <Text style={styles.detailLabel}>Friction Level: <Text style={styles.detailVal}>{r.friction}</Text></Text>
            <Text style={styles.detailLabel}>Supply Status: <Text style={styles.detailVal}>{r.supply}</Text></Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#38bdf8', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  regionName: { fontSize: 15, fontWeight: '600', color: '#f8fafc' },
  healthScore: { fontSize: 18, fontWeight: 'bold' },
  detailsRow: { flexDirection: 'row', justifyContent: 'space-between', marginTop: 10 },
  detailLabel: { fontSize: 12, color: '#94a3b8' },
  detailVal: { fontWeight: '600', color: '#cbd5e1' },
});
