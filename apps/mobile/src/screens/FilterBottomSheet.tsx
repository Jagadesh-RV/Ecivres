import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, TextInput } from 'react-native';

export const FilterBottomSheet = () => {
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Filter Service Catalog</Text>

      <View style={styles.section}>
        <Text style={styles.label}>Price Range ($)</Text>
        <View style={styles.row}>
          <TextInput placeholder="Min" value={minPrice} onChangeText={setMinPrice} keyboardType="numeric" style={styles.input} />
          <Text style={styles.dash}>-</Text>
          <TextInput placeholder="Max" value={maxPrice} onChangeText={setMaxPrice} keyboardType="numeric" style={styles.input} />
        </View>
      </View>

      <TouchableOpacity style={styles.applyBtn}>
        <Text style={styles.applyText}>Apply Filters</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  section: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
  row: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  input: { flex: 1, borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 10, fontSize: 14 },
  dash: { color: '#94a3b8' },
  applyBtn: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 8 },
  applyText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
