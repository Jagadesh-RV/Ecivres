import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const VerificationProgressScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Verification Progress</Text>
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>1. Aadhaar Offline XML</Text>
        <Text style={styles.stepStatus}>Completed</Text>
      </View>
      <View style={styles.stepCard}>
        <Text style={styles.stepTitle}>2. PAN Card Verification</Text>
        <Text style={styles.stepStatus}>Completed</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  stepCard: { padding: 16, backgroundColor: '#ffffff', borderRadius: 10, marginBottom: 12, borderLeftWidth: 4, borderLeftColor: '#10b981' },
  stepTitle: { fontSize: 14, fontWeight: '600', color: '#1e293b' },
  stepStatus: { fontSize: 12, color: '#10b981', marginTop: 4 },
});
