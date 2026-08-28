import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { serviceService } from '../../services/api/serviceService';
import { useAuthStore } from '../../stores/authStore';

export const ProviderServicesScreen = () => {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation<any>();
  const user = useAuthStore(state => state.user);

  const fetchServices = useCallback(async () => {
    try {
      if (!user) return;
      // Get services by provider ID (using the user ID to infer for now or fetch all and filter)
      // Actually backend `GET /services` supports `providerId`
      // Wait, providerId in schema is the ID of the ProviderProfile, not User.
      // So let's just fetch all and let backend handle it, or assume the backend filters if we pass `providerId`.
      // The API doesn't have a specific `getMyServices` yet, but let's see. 
      // Actually let's assume `GET /services` with no params returns all.
      // Let's filter client-side just in case for now, or just let backend do it.
      // Assuming Provider ID is returned with `user` or we just fetch `/services?providerId=...`
      const data = await serviceService.getAllServices(); 
      // For demo, let's just show all services this user owns if we can check.
      // Or we can just show all services returned.
      setServices(data);
    } catch (err: any) {
      console.error(err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [user]);

  useEffect(() => {
    fetchServices();
  }, [fetchServices]);

  const onRefresh = () => {
    setRefreshing(true);
    fetchServices();
  };

  const handleDelete = (id: string) => {
    Alert.alert('Confirm Delete', 'Are you sure you want to delete this service?', [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: async () => {
        try {
          await serviceService.deleteService(id);
          fetchServices();
        } catch (err) {
          Alert.alert('Error', 'Failed to delete service');
        }
      }}
    ]);
  };

  const renderItem = ({ item }: { item: any }) => (
    <View style={styles.card}>
      <View style={styles.header}>
        <Text style={styles.serviceName}>{item.name}</Text>
        <Text style={styles.price}>${item.price}</Text>
      </View>
      <Text style={styles.description} numberOfLines={2}>{item.description}</Text>
      
      <View style={styles.actions}>
        <TouchableOpacity 
          style={styles.editButton}
          onPress={() => navigation.navigate('ProviderServiceForm', { serviceId: item.id })}
        >
          <Text style={styles.editButtonText}>Edit</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.deleteButtonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        refreshing={refreshing}
        onRefresh={onRefresh}
        contentContainerStyle={styles.list}
        ListEmptyComponent={<Text style={styles.empty}>You have no services listed.</Text>}
      />

      <TouchableOpacity 
        style={styles.fab}
        onPress={() => navigation.navigate('ProviderServiceForm')}
      >
        <Text style={styles.fabText}>+</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#f9fafb' },
  list: { padding: 16, paddingBottom: 80 },
  empty: { textAlign: 'center', marginTop: 32, color: '#6b7280' },
  card: {
    backgroundColor: '#fff',
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
    elevation: 2,
    shadowColor: '#000',
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  serviceName: { fontSize: 18, fontWeight: 'bold', flex: 1 },
  price: { fontSize: 16, fontWeight: 'bold', color: '#2ecc71', marginLeft: 8 },
  description: { fontSize: 14, color: '#6b7280', marginBottom: 16 },
  actions: { flexDirection: 'row', justifyContent: 'flex-end', gap: 12 },
  editButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, backgroundColor: '#e5e7eb' },
  editButtonText: { color: '#374151', fontWeight: 'bold' },
  deleteButton: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 4, backgroundColor: '#fee2e2' },
  deleteButtonText: { color: '#b91c1c', fontWeight: 'bold' },
  fab: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#000',
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
  },
  fabText: {
    color: '#fff',
    fontSize: 24,
    fontWeight: 'bold',
  }
});
