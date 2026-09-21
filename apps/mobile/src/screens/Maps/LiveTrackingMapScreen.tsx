import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export const LiveTrackingMapScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Live Responder Location</Text>
      <View style={styles.mapMock}>
        <Text style={styles.mapText}>Google Maps SDK Live Simulation</Text>
        <Text style={styles.etaText}>ETA: 14 Mins</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: '#0f172a' },
  title: { fontSize: 20, fontWeight: '700', color: '#ffffff', marginBottom: 16 },
  mapMock: { height: 260, backgroundColor: '#1e293b', borderRadius: 12, justifyContent: 'center', alignItems: 'center' },
  mapText: { color: '#94a3b8', fontSize: 14 },
  etaText: { color: '#10b981', fontSize: 24, fontWeight: '800', marginTop: 8 },
});
