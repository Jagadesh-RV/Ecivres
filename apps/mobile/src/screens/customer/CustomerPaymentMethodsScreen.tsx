import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { client } from '../../lib/axios';

export const CustomerPaymentMethodsScreen: React.FC = () => {
  const [methods, setMethods] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchMethods = async () => {
    try {
      setLoading(true);
      const res = await client.get('/payments/methods/all');
      setMethods(res.data || []);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to fetch payment methods');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMethods();
  }, []);

  const handleSetDefault = async (id: string) => {
    try {
      await client.patch(`/payments/methods/${id}/default`);
      fetchMethods();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update default card');
    }
  };

  const handleDelete = (id: string) => {
    Alert.alert('Delete Card', 'Are you sure you want to remove this saved payment method?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Remove',
        style: 'destructive',
        onPress: async () => {
          try {
            await client.delete(`/payments/methods/${id}`);
            fetchMethods();
          } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to remove card');
          }
        },
      },
    ]);
  };

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
        <Text style={styles.title}>Payment Methods</Text>
        <Text style={styles.subtitle}>Saved payment sources for fast checkout</Text>
      </View>

      <FlatList
        data={methods}
        keyExtractor={(item) => item.id}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No saved payment methods found.</Text>
          </View>
        }
        renderItem={({ item }) => (
          <View
            style={[
              styles.card,
              item.isDefault && styles.defaultCard,
            ]}
          >
            <View style={styles.cardTopRow}>
              <Text style={styles.brandText}>💳 {item.brand}</Text>
              {item.isDefault ? (
                <View style={styles.defaultBadge}>
                  <Text style={styles.defaultBadgeText}>DEFAULT</Text>
                </View>
              ) : (
                <TouchableOpacity onPress={() => handleSetDefault(item.id)}>
                  <Text style={styles.setDefaultText}>Set Default</Text>
                </TouchableOpacity>
              )}
            </View>

            <Text style={styles.cardNumber}>•••• •••• •••• {item.last4}</Text>

            <View style={styles.cardBottomRow}>
              <Text style={styles.cardholder}>{item.cardholderName}</Text>
              <Text style={styles.expDate}>
                Exp {String(item.expMonth).padStart(2, '0')}/{item.expYear}
              </Text>
            </View>

            <TouchableOpacity
              onPress={() => handleDelete(item.id)}
              style={styles.deleteButton}
            >
              <Text style={styles.deleteText}>Remove Card</Text>
            </TouchableOpacity>
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  defaultCard: {
    borderColor: '#6366F1',
    borderWidth: 2,
  },
  cardTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  brandText: {
    fontSize: 14,
    fontWeight: '700',
    color: '#374151',
  },
  defaultBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  defaultBadgeText: {
    fontSize: 10,
    fontWeight: '800',
    color: '#4F46E5',
  },
  setDefaultText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#6366F1',
  },
  cardNumber: {
    fontSize: 18,
    fontFamily: 'monospace',
    fontWeight: '700',
    color: '#111827',
    letterSpacing: 1.5,
    marginBottom: 12,
  },
  cardBottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  cardholder: {
    fontSize: 12,
    color: '#4B5563',
  },
  expDate: {
    fontSize: 12,
    color: '#4B5563',
  },
  deleteButton: {
    alignSelf: 'flex-end',
  },
  deleteText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#EF4444',
  },
});
