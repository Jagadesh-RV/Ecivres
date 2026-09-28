import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const RegionalOnboardingWidget: React.FC = () => {
  const [country, setCountry] = useState('US');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Select Your Marketplace Country</Text>
      <View style={styles.buttonRow}>
        {['US', 'IN', 'GB', 'AE', 'DE'].map((c) => (
          <TouchableOpacity
            key={c}
            style={[styles.chip, country === c && styles.activeChip]}
            onPress={() => setCountry(c)}
          >
            <Text style={[styles.chipText, country === c && styles.activeText]}>{c}</Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0f172a', borderRadius: 12 },
  title: { color: '#f8fafc', fontSize: 16, fontWeight: 'bold', marginBottom: 12 },
  buttonRow: { flexDirection: 'row', gap: 8 },
  chip: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 20, backgroundColor: '#1e293b' },
  activeChip: { backgroundColor: '#0284c7' },
  chipText: { color: '#94a3b8', fontWeight: 'bold' },
  activeText: { color: '#ffffff' },
});
