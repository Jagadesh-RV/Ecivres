import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const IndianIdScannerScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Scan Aadhaar / PAN Card</Text>
      <View style={styles.viewfinder}>
        <Text style={styles.guideText}>Align ID card within frame</Text>
      </View>
      <TouchableOpacity style={styles.button} activeOpacity={0.8}>
        <Text style={styles.buttonText}>Capture Document</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a', justifyContent: 'space-between' },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff' },
  viewfinder: { height: 220, borderStyle: 'dashed', borderWidth: 2, borderColor: '#38bdf8', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  guideText: { color: '#94a3b8', fontSize: 14 },
  button: { paddingVertical: 14, backgroundColor: '#2563eb', borderRadius: 10, alignItems: 'center', marginBottom: 20 },
  buttonText: { color: '#ffffff', fontWeight: '700' },
});
