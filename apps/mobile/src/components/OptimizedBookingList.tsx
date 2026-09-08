import React, { memo, useCallback } from 'react';
import { FlatList, View, Text, StyleSheet, TouchableOpacity } from 'react-native';

export interface MobileBookingItem {
  id: string;
  serviceName: string;
  status: string;
  price: number;
  scheduledAt: string;
}

const ITEM_HEIGHT = 100;

const BookingCard = memo(({ item, onPress }: { item: MobileBookingItem; onPress: (id: string) => void }) => (
  <TouchableOpacity
    style={styles.card}
    onPress={() => onPress(item.id)}
    activeOpacity={0.7}
  >
    <View style={styles.headerRow}>
      <Text style={styles.title} numberOfLines={1}>{item.serviceName}</Text>
      <Text style={styles.price}>${item.price.toFixed(2)}</Text>
    </View>
    <View style={styles.footerRow}>
      <Text style={styles.status}>{item.status}</Text>
      <Text style={styles.date}>{new Date(item.scheduledAt).toLocaleDateString()}</Text>
    </View>
  </TouchableOpacity>
));

export function OptimizedBookingList({
  data,
  onBookingPress,
}: {
  data: MobileBookingItem[];
  onBookingPress: (id: string) => void;
}) {
  const renderItem = useCallback(
    ({ item }: { item: MobileBookingItem }) => (
      <BookingCard item={item} onPress={onBookingPress} />
    ),
    [onBookingPress],
  );

  const keyExtractor = useCallback((item: MobileBookingItem) => item.id, []);

  const getItemLayout = useCallback(
    (_: any, index: number) => ({
      length: ITEM_HEIGHT,
      offset: ITEM_HEIGHT * index,
      index,
    }),
    [],
  );

  return (
    <FlatList
      data={data}
      renderItem={renderItem}
      keyExtractor={keyExtractor}
      getItemLayout={getItemLayout}
      initialNumToRender={10}
      maxToRenderPerBatch={5}
      windowSize={5}
      removeClippedSubviews={true}
      contentContainerStyle={styles.container}
    />
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
  },
  card: {
    height: ITEM_HEIGHT - 10,
    marginVertical: 5,
    marginHorizontal: 16,
    padding: 14,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    justifyContent: 'space-between',
    elevation: 2,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: '#111827',
    flex: 1,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#059669',
    marginLeft: 8,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  status: {
    fontSize: 12,
    fontWeight: '600',
    color: '#3B82F6',
    textTransform: 'uppercase',
  },
  date: {
    fontSize: 12,
    color: '#6B7280',
  },
});
