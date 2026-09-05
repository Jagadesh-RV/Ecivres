import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export const LocationFilterModal = () => {
  const [zipCode, setZipCode] = useState('');
  const [radius, setRadius] = useState('10');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Location & Radius Filter</Text>
      <Text style={styles.subtitle}>Find service providers near your address.</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>ZIP / Postal Code</Text>
        <TextInput
          placeholder="e.g. 90210"
          value={zipCode}
          onChangeText={setZipCode}
          style={styles.input}
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Distance Radius: {radius} km</Text>
        <View style={styles.radiusRow}>
          {['5', '10', '25', '50'].map((r) => (
            <TouchableOpacity
              key={r}
              onPress={() => setRadius(r)}
              style={[styles.radiusBtn, radius === r && styles.activeRadius]}
            >
              <Text style={[styles.radiusText, radius === r && styles.activeRadiusText]}>{r} km</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <TouchableOpacity style={styles.applyBtn}>
        <Text style={styles.applyText}>Apply Location Filter</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  inputGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14 },
  radiusRow: { flexDirection: 'row', gap: 8 },
  radiusBtn: { flex: 1, paddingVertical: 10, borderRadius: 8, borderWidth: 1, borderColor: '#e2e8f0', alignItems: 'center' },
  activeRadius: { backgroundColor: '#4f46e5', borderColor: '#4f46e5' },
  radiusText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  activeRadiusText: { color: '#ffffff' },
  applyBtn: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  applyText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
