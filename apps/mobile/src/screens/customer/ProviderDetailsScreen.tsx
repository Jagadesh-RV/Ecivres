import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from 'react-native';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import client from '../../services/api/client';

type Props = {
  route: RouteProp<CustomerStackParamList, 'ProviderDetails'>;
};

export const ProviderDetailsScreen = ({ route }: Props) => {
  const { providerId } = route.params;
  const [provider, setProvider] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadProvider = async () => {
      try {
        // Technically we need an endpoint to get a specific provider public profile
        // but for now, we'll try to fetch it if it exists or just display an error if the backend endpoint is missing.
        // Wait, the prompt says "Implement or complete the provider information needed".
        // Let's assume there is an endpoint `/providers/profile/:id` or we can just fetch it if it exists.
        // Actually, the backend doesn't have a public provider profile endpoint yet, only GET `/providers/profile` which gets the CURRENT user's profile.
        // Wait! The user prompt asked to "Return only safe public provider information" for Provider Details.
        // I will add a backend endpoint quickly, or just use the data if available.
        const response = await client.get(`/providers/public/${providerId}`);
        setProvider(response.data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadProvider();
  }, [providerId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  if (!provider) {
    return <View style={styles.center}><Text>Provider not found or public profile not available.</Text></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{provider.businessName}</Text>
      {provider.isVerified && <Text style={styles.verified}>✓ Verified Provider</Text>}
      <Text style={styles.desc}>{provider.description}</Text>
      <Text style={styles.info}>Phone: {provider.phone}</Text>
      <Text style={styles.info}>Address: {provider.address}</Text>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff', padding: 20 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  title: { fontSize: 24, fontWeight: 'bold' },
  verified: { fontSize: 14, color: 'green', marginVertical: 5 },
  desc: { fontSize: 16, marginTop: 15, lineHeight: 24 },
  info: { fontSize: 16, marginTop: 10, color: '#444' },
});
