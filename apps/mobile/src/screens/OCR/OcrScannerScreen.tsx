import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const OcrScannerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Document OCR Scanner</Text>
      <View style={styles.scannerBox}>
        <Text style={styles.guide}>Position Invoice or Receipt</Text>
      </View>
      <TouchableOpacity style={styles.scanBtn} activeOpacity={0.8}>
        <Text style={styles.btnText}>Scan & Process</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  scannerBox: { height: 240, borderStyle: 'solid', borderWidth: 2, borderColor: '#10b981', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  guide: { color: '#64748b', fontSize: 14 },
  scanBtn: { paddingVertical: 14, backgroundColor: '#10b981', borderRadius: 8, alignItems: 'center', marginBottom: 20 },
  btnText: { color: '#ffffff', fontWeight: '700' },
});
