import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl } from 'react-native';
import { ScreenContainer, Card, Badge } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';

export const AdminHomeScreen = () => {
  const [stats, setStats] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      const res = await client.get('/admin/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load mobile admin stats', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Governance Console</Text>
          <Text style={styles.subtitle}>System activity & platform performance</Text>
        </View>

        {stats && (
          <View style={styles.grid}>
            <Card variant="outlined" style={styles.card}>
              <Text style={styles.cardLabel}>Platform Users</Text>
              <Text style={styles.cardValue}>{stats.totalUsersCount}</Text>
              <Text style={styles.cardDesc}>{stats.totalCustomersCount} Customers / {stats.totalProvidersCount} Providers</Text>
            </Card>

            <Card variant="outlined" style={styles.card}>
              <Text style={styles.cardLabel}>Gross Volume</Text>
              <Text style={styles.cardValue}>${stats.platformGrossVolume?.toFixed(2)}</Text>
              <Text style={styles.cardDesc}>Completed booking volume</Text>
            </Card>

            <Card variant="outlined" style={styles.card}>
              <Text style={styles.cardLabel}>Pending Verification</Text>
              <Text style={styles.cardValue}>{stats.pendingProvidersCount}</Text>
              <Badge label="Awaiting Review" variant="warning" />
            </Card>
          </View>
        )}
      </ScrollView>
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
  grid: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  card: {
    padding: spacing.md,
  },
  cardLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  cardValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xl,
    color: colors.text,
    marginVertical: spacing.xs,
  },
  cardDesc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
});
