import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator, Button } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { CustomerStackParamList } from '../../navigation/types';
import { getCategories } from '../../services/api/categoryService';
import { getServices } from '../../services/api/serviceService';
import { useAuthStore } from '../../stores/authStore';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'CustomerDashboard'>;
};

export const CustomerDashboard = ({ navigation }: Props) => {
  const logout = useAuthStore(state => state.logout);
  const [categories, setCategories] = useState<any[]>([]);
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadDashboard = async () => {
      try {
        const [cats, servs] = await Promise.all([getCategories(), getServices()]);
        setCategories(cats.slice(0, 4)); // Top 4 categories
        setServices(servs.slice(0, 5)); // Top 5 featured services
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadDashboard();
  }, []);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Categories</Text>
      <View style={styles.row}>
        {categories.map(c => (
          <TouchableOpacity key={c.id} style={styles.card} onPress={() => navigation.navigate('ServiceList', { categoryId: c.id })}>
            <Text>{c.name}</Text>
          </TouchableOpacity>
        ))}
      </View>
      <Button title="View All Categories" onPress={() => navigation.navigate('CategoryList')} />

      <Text style={[styles.header, { marginTop: 20 }]}>Featured Services</Text>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.listItem} onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text>${item.price} - {item.duration} mins</Text>
          </TouchableOpacity>
        )}
      />

      <Button title="Logout" onPress={logout} color="red" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  header: { fontSize: 20, fontWeight: 'bold', marginBottom: 10 },
  row: { flexDirection: 'row', flexWrap: 'wrap', gap: 10, marginBottom: 10 },
  card: { padding: 16, backgroundColor: '#e0e0e0', borderRadius: 8, minWidth: '45%' },
  listItem: { padding: 16, backgroundColor: '#f9f9f9', borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 16, fontWeight: 'bold' },
});
