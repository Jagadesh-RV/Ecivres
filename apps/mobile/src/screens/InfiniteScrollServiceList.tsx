import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, ActivityIndicator } from 'react-native';

export const InfiniteScrollServiceList = () => {
  const [items, setItems] = useState([
    { id: '1', name: 'Deep Home Sanitization', price: '$120.00', provider: 'Sparkle Clean LLC' },
    { id: '2', name: 'Emergency Plumbing Repair', price: '$95.00', provider: 'Apex Plumbing' },
    { id: '3', name: 'Electrical Panel Inspection', price: '$150.00', provider: 'Volt Electricians' },
    { id: '4', name: 'Lawn Mowing & Care', price: '$65.00', provider: 'GreenThumb Landscaping' },
  ]);
  const [loadingMore, setLoadingMore] = useState(false);

  const loadMore = () => {
    if (loadingMore) return;
    setLoadingMore(true);
    setTimeout(() => {
      setItems((prev) => [
        ...prev,
        { id: String(prev.length + 1), name: 'HVAC Air Duct Flush', price: '$180.00', provider: 'AirFlow Techs' },
      ]);
      setLoadingMore(false);
    }, 1000);
  };

  return (
    <FlatList
      data={items}
      keyExtractor={(item) => item.id}
      onEndReached={loadMore}
      onEndReachedThreshold={0.5}
      renderItem={({ item }) => (
        <View style={styles.card}>
          <Text style={styles.providerTag}>{item.provider}</Text>
          <Text style={styles.cardTitle}>{item.name}</Text>
          <Text style={styles.price}>{item.price}</Text>
        </View>
      )}
      ListFooterComponent={loadingMore ? <ActivityIndicator size="small" color="#4f46e5" style={{ marginVertical: 16 }} /> : null}
    />
  );
};

const styles = StyleSheet.create({
  card: { padding: 14, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 10, marginHorizontal: 12 },
  providerTag: { fontSize: 10, fontWeight: 'bold', color: '#4f46e5', textTransform: 'uppercase' },
  cardTitle: { fontSize: 14, fontWeight: 'bold', color: '#1e293b', marginTop: 4 },
  price: { fontSize: 14, fontWeight: '700', color: '#0f172a', marginTop: 6 },
});
