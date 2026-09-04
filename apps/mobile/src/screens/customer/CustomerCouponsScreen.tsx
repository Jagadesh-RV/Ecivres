import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { client } from '../../lib/axios';

export const CustomerCouponsScreen: React.FC = () => {
  const [coupons, setCoupons] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCoupons = async () => {
    try {
      setLoading(true);
      const res = await client.get('/coupons/active');
      setCoupons(res.data || []);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch active coupons');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoupons();
  }, []);

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Promotions & Offers</Text>
        <Text style={styles.subtitle}>Apply these promo codes during service checkout</Text>
      </View>

      <FlatList
        data={coupons}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No active promotions at this time.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.badgeRow}>
              <Text style={styles.codeText}>{item.code}</Text>
              <Text style={styles.discountBadge}>
                {item.discountType === 'PERCENTAGE'
                  ? `${item.discountValue}% OFF`
                  : `$${item.discountValue} OFF`}
              </Text>
            </View>

            {item.minBookingAmount ? (
              <Text style={styles.detailText}>
                Min. order amount: ${item.minBookingAmount}
              </Text>
            ) : null}

            {item.maxDiscount ? (
              <Text style={styles.detailText}>
                Max. discount: ${item.maxDiscount}
              </Text>
            ) : null}
          </View>
        )}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  listContent: {
    padding: 16,
  },
  emptyContainer: {
    padding: 32,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    color: '#9CA3AF',
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderLeftWidth: 4,
    borderLeftColor: '#4F46E5',
  },
  badgeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  codeText: {
    fontSize: 16,
    fontWeight: '800',
    color: '#4F46E5',
    letterSpacing: 1,
  },
  discountBadge: {
    fontSize: 12,
    fontWeight: '700',
    color: '#059669',
    backgroundColor: '#D1FAE5',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  detailText: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 2,
  },
});
