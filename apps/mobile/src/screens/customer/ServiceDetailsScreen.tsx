import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, ScrollView, ActivityIndicator, TouchableOpacity, Alert } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { serviceService } from '../../services/api/serviceService';
import { Service } from '../../types';

export const ServiceDetailsScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { serviceId } = route.params;

  const [service, setService] = useState<Service | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServiceDetails = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getServiceById(serviceId);
      setService(data);
    } catch (err: any) {
      setError(err.message || 'Service is no longer available');
    } finally {
      setLoading(false);
    }
  }, [serviceId]);

  useEffect(() => {
    fetchServiceDetails();
  }, [fetchServiceDetails]);

  const handleBookService = () => {
    Alert.alert('Coming Soon', 'Booking functionality will be available in Phase 5.');
  };

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity onPress={fetchServiceDetails}><Text style={styles.retry}>Retry</Text></TouchableOpacity></View>;
  if (!service) return null;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{service.name}</Text>
        <Text style={styles.category}>{service.category?.name}</Text>
      </View>

      <View style={styles.detailsCard}>
        <Text style={styles.description}>{service.description || 'No description available.'}</Text>
        <View style={styles.row}>
          <Text style={styles.label}>Price:</Text>
          <Text style={styles.value}>${service.price.toFixed(2)}</Text>
        </View>
        <View style={styles.row}>
          <Text style={styles.label}>Duration:</Text>
          <Text style={styles.value}>{service.duration} mins</Text>
        </View>
      </View>

      {service.provider && (
        <TouchableOpacity 
          style={styles.providerCard}
          onPress={() => navigation.navigate('ProviderDetails', { provider: service.provider })}
        >
          <Text style={styles.providerLabel}>Provided By</Text>
          <Text style={styles.providerName}>{service.provider.businessName}</Text>
          <Text style={styles.viewProfile}>View Profile →</Text>
        </TouchableOpacity>
      )}

      <TouchableOpacity style={styles.bookButton} onPress={handleBookService}>
        <Text style={styles.bookButtonText}>BOOK SERVICE</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', marginBottom: 10 },
  retry: { color: '#007AFF', fontWeight: 'bold' },
  container: { padding: 16 },
  header: { marginBottom: 24 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 4 },
  category: { fontSize: 16, color: '#007AFF', fontWeight: '600' },
  detailsCard: { padding: 16, backgroundColor: '#fff', borderRadius: 8, marginBottom: 24, elevation: 1 },
  description: { fontSize: 16, color: '#444', lineHeight: 24, marginBottom: 16 },
  row: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 8 },
  label: { fontSize: 16, color: '#666' },
  value: { fontSize: 16, fontWeight: 'bold' },
  providerCard: { padding: 16, backgroundColor: '#f8f9fa', borderRadius: 8, marginBottom: 24, borderWidth: 1, borderColor: '#eee' },
  providerLabel: { fontSize: 12, color: '#666', textTransform: 'uppercase', marginBottom: 4 },
  providerName: { fontSize: 18, fontWeight: 'bold', marginBottom: 8 },
  viewProfile: { fontSize: 14, color: '#007AFF' },
  bookButton: { backgroundColor: '#2ecc71', padding: 16, borderRadius: 8, alignItems: 'center' },
  bookButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold', letterSpacing: 1 },
});
