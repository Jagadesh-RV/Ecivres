import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { categoryService } from '../../services/api/categoryService';
import { Category } from '../../types';

export const CategoryListScreen = () => {
  const navigation = useNavigation<any>();
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCategories = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await categoryService.getAllCategories();
      setCategories(data);
    } catch (err: any) {
      setError(err.message || 'Failed to load categories');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCategories();
  }, []);

  if (loading) return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  if (error) return <View style={styles.center}><Text style={styles.error}>{error}</Text><TouchableOpacity onPress={fetchCategories}><Text style={styles.retry}>Retry</Text></TouchableOpacity></View>;
  if (categories.length === 0) return <View style={styles.center}><Text>No categories available</Text></View>;

  return (
    <FlatList
      data={categories}
      keyExtractor={(item) => item.id}
      onRefresh={fetchCategories}
      refreshing={loading}
      contentContainerStyle={styles.list}
      renderItem={({ item }) => (
        <TouchableOpacity
          style={styles.card}
          onPress={() => navigation.navigate('ServiceList', { categoryId: item.id })}
        >
          <Text style={styles.cardTitle}>{item.name}</Text>
          {item.description && <Text style={styles.cardDescription}>{item.description}</Text>}
          <Text style={styles.serviceCount}>{item._count?.services || 0} services</Text>
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
  cardTitle: { fontSize: 18, fontWeight: 'bold', marginBottom: 4 },
  cardDescription: { fontSize: 14, color: '#666', marginBottom: 8 },
  serviceCount: { fontSize: 12, color: '#999', alignSelf: 'flex-end' },
});
