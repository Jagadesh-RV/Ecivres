import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export const ProviderNavigationScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Turn-by-Turn Navigation</Text>
      <View style={styles.navCard}>
        <Text style={styles.instruction}>Turn right on Market St in 200m</Text>
        <TouchableOpacity style={styles.button} activeOpacity={0.8}>
          <Text style={styles.buttonText}>Open in Google Maps App</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: '700', color: '#0f172a', marginBottom: 16 },
  navCard: { padding: 20, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  instruction: { fontSize: 16, fontWeight: '600', color: '#1e293b' },
  button: { marginTop: 16, paddingVertical: 12, backgroundColor: '#10b981', borderRadius: 8, alignItems: 'center' },
  buttonText: { color: '#ffffff', fontWeight: '600' },
});
