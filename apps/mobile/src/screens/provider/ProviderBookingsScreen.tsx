import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, RefreshControl, Alert } from 'react-native';
import { ScreenContainer, Card, Badge, Button } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';

export const ProviderBookingsScreen = () => {
  const [bookings, setBookings] = useState<any[]>([]);
  const [refreshing, setRefreshing] = useState(false);

  const fetchBookings = async () => {
    try {
      const res = await client.get('/bookings/provider');
      setBookings(res.data || []);
    } catch (err) {
      console.error('Failed to load mobile provider bookings', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchBookings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchBookings();
  };

  const handleUpdateStatus = async (id: string, status: string) => {
    try {
      await client.patch(`/bookings/${id}/status`, { status });
      fetchBookings();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update status');
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Client Bookings</Text>
        <Text style={styles.subtitle}>Manage incoming service appointments</Text>
      </View>

      <FlatList
        data={bookings}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <Card variant="outlined" style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.serviceName}>{item.service?.name || 'Service'}</Text>
              <Badge label={item.status} variant={item.status === 'CONFIRMED' ? 'success' : 'warning'} />
            </View>

            <Text style={styles.customerText}>Client: {item.customer?.user?.email || 'Customer'}</Text>
            <Text style={styles.dateText}>
              📅 {new Date(item.scheduledAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
            </Text>

            {item.status === 'PENDING' && (
              <View style={styles.actionsRow}>
                <Button
                  title="Confirm"
                  size="sm"
                  onPress={() => handleUpdateStatus(item.id, 'CONFIRMED')}
                  style={styles.actionBtn}
                />
                <Button
                  title="Reject"
                  size="sm"
                  variant="outline"
                  onPress={() => handleUpdateStatus(item.id, 'CANCELLED')}
                />
              </View>
            )}

            {item.status === 'CONFIRMED' && (
              <View style={styles.actionsRow}>
                <Button
                  title="Mark Completed"
                  size="sm"
                  onPress={() => handleUpdateStatus(item.id, 'COMPLETED')}
                />
              </View>
            )}
          </Card>
        )}
      />
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.lg,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  listContent: {
    paddingBottom: spacing.xl,
  },
  card: {
    marginBottom: spacing.md,
    padding: spacing.md,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: spacing.xs,
  },
  serviceName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.text,
    flex: 1,
  },
  customerText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginBottom: 4,
  },
  dateText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    marginBottom: spacing.sm,
  },
  actionsRow: {
    flexDirection: 'row',
    marginTop: spacing.xs,
  },
  actionBtn: {
    marginRight: spacing.sm,
  },
});
