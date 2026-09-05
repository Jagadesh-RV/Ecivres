import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const SortingBottomSheet = () => {
  const [selected, setSelected] = useState('NEWEST');

  const options = [
    { key: 'NEWEST', label: 'Newest Additions' },
    { key: 'PRICE_ASC', label: 'Price: Low to High' },
    { key: 'PRICE_DESC', label: 'Price: High to Low' },
    { key: 'RATING_DESC', label: 'Top Rated Providers' },
  ];

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sort Service Catalog</Text>
      <View style={styles.options}>
        {options.map((opt) => (
          <TouchableOpacity
            key={opt.key}
            onPress={() => setSelected(opt.key)}
            style={[styles.optionRow, selected === opt.key && styles.selectedRow]}
          >
            <Text style={[styles.optionText, selected === opt.key && styles.selectedText]}>{opt.label}</Text>
            {selected === opt.key && <Text style={styles.check}>✓</Text>}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 20, backgroundColor: '#ffffff', borderTopLeftRadius: 20, borderTopRightRadius: 20 },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a', marginBottom: 16 },
  options: { gap: 8 },
  optionRow: {
    paddingVertical: 14,
    paddingHorizontal: 16,
    borderRadius: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
  },
  selectedRow: { backgroundColor: '#e0e7ff' },
  optionText: { fontSize: 14, fontWeight: '600', color: '#334155' },
  selectedText: { color: '#4338ca', fontWeight: 'bold' },
  check: { color: '#4338ca', fontWeight: 'bold', fontSize: 16 },
});
