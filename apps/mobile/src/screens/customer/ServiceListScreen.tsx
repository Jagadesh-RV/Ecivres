import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useRoute, useNavigation } from '@react-navigation/native';
import { serviceService } from '../../services/api/serviceService';
import { Service } from '../../types';

export const ServiceListScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { categoryId } = route.params || {};

  const [services, setServices] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchServices = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await serviceService.getAllServices({ categoryId });
      setServices(data);
    } catch (err: any) {
      setError(err.message || 'Unable to load services');
    } finally {
      setLoading(false);
    }
  }, [categoryId]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity onPress={fetchServices}><Text style={styles.retry}>Retry</Text></TouchableOpacity></View>;
  if (services.length === 0) return <View style={styles.center}><Text>No services found in this category.</Text></View>;

  return (
    <FlatList
      data={services}
      keyExtractor={(item) => item.id}
      onRefresh={fetchServices}
      refreshing={loading}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}
        >
          <Text style={styles.serviceName}>{item.name}</Text>
          {item.description && <Text style={styles.serviceDescription} numberOfLines={2}>{item.description}</Text>}
          <View style={styles.row}>
            <Text style={styles.price}>${item.price.toFixed(2)}</Text>
            <Text style={styles.duration}>{item.duration} mins</Text>
          </View>
        </TouchableOpacity>
      )}
    />
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  error: { color: 'red', marginBottom: 10 },
  retry: { color: '#007AFF', fontWeight: 'bold' },
  list: { padding: 16 },
  card: { padding: 16, backgroundColor: '#fff', marginBottom: 12, borderRadius: 8, elevation: 2, shadowColor: '#000', shadowOpacity: 0.1, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  serviceName: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  serviceDescription: { fontSize: 14, color: '#666', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71' },
  duration: { fontSize: 14, color: '#999' },
});
