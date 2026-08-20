import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { useRoute } from '@react-navigation/native';
import { ProviderProfile } from '../../types';

export const ProviderDetailsScreen = () => {
  const route = useRoute<any>();
  const provider = route.params?.provider as ProviderProfile;

  if (!provider) {
    return <View style={styles.center}><Text>Provider information not available.</Text></View>;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.businessName}>{provider.businessName}</Text>
        {provider.isVerified && <Text style={styles.verifiedBadge}>✓ Verified Provider</Text>}
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>About</Text>
        <Text style={styles.description}>{provider.description || 'No description provided.'}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.sectionTitle}>Contact Info</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Phone:</Text>
          <Text style={styles.value}>{provider.phone || 'Not provided'}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Address:</Text>
          <Text style={styles.value}>{provider.address || 'Not provided'}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { padding: 16 },
  header: { marginBottom: 24, alignItems: 'center' },
  businessName: { fontSize: 24, fontWeight: 'bold', marginBottom: 8, textAlign: 'center' },
  verifiedBadge: { color: '#2ecc71', fontSize: 14, fontWeight: 'bold', paddingHorizontal: 12, paddingVertical: 4, backgroundColor: '#e8f8f5', overflow: 'hidden' },
  card: { backgroundColor: '#fff', padding: 16, borderRadius: 8, marginBottom: 16, elevation: 1 },
  sectionTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 12, color: '#333' },
  description: { fontSize: 16, color: '#555', lineHeight: 24 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 12, alignItems: 'center' },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, color: '#333', flex: 1, textAlign: 'right' },
});
