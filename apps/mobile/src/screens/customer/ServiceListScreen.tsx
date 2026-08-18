import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, ActivityIndicator } from 'react-native';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RouteProp } from '@react-navigation/native';
import { CustomerStackParamList } from '../../navigation/types';
import { getServices } from '../../services/api/serviceService';

type Props = {
  navigation: NativeStackNavigationProp<CustomerStackParamList, 'ServiceList'>;
  route: RouteProp<CustomerStackParamList, 'ServiceList'>;
};

export const ServiceListScreen = ({ navigation, route }: Props) => {
  const { categoryId } = route.params || {};
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadServices = async () => {
      try {
        const data = await getServices(categoryId);
        setServices(data);
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    };
    loadServices();
  }, [categoryId]);

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={services}
        keyExtractor={item => item.id}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.item} onPress={() => navigation.navigate('ServiceDetails', { serviceId: item.id })}>
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>${item.price} - {item.duration} mins</Text>
            {item.provider && <Text style={styles.provider}>By: {item.provider.businessName}</Text>}
          </TouchableOpacity>
        )}
        ListEmptyComponent={<Text style={styles.empty}>No services available</Text>}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#fff' },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  item: { padding: 20, borderBottomWidth: 1, borderColor: '#eee' },
  title: { fontSize: 18, fontWeight: 'bold' },
  subtitle: { fontSize: 16, color: '#666', marginTop: 4 },
  provider: { fontSize: 14, color: '#aaa', marginTop: 4 },
  empty: { textAlign: 'center', marginTop: 20, color: 'gray' },
});
