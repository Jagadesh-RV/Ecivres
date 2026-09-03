import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { ScreenContainer, Card, Badge } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';

export const ProviderEarningsScreen = () => {
  const [summary, setSummary] = useState<any>(null);
  const [refreshing, setRefreshing] = useState(false);

  const fetchEarnings = async () => {
    try {
      const res = await client.get('/payments/provider/earnings');
      setSummary(res.data);
    } catch (err) {
      console.error('Failed to load mobile provider earnings', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    fetchEarnings();
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}>
        <View style={styles.header}>
          <Text style={styles.title}>Revenue & Payouts</Text>
          <Text style={styles.subtitle}>Instant payouts & transaction ledger</Text>
        </View>

        {summary && (
          <View style={styles.content}>
            <Card variant="outlined" style={styles.mainCard}>
              <Text style={styles.label}>Net Earnings (Available Payout)</Text>
              <Text style={styles.netValue}>${summary.netEarnings?.toFixed(2)}</Text>
              <Text style={styles.desc}>
                Gross Sales: ${summary.grossRevenue?.toFixed(2)} | Platform Fee (10%): ${summary.totalPlatformFees?.toFixed(2)}
              </Text>
              <TouchableOpacity
                style={styles.payoutButton}
                onPress={() => alert('Payout request sent to Stripe Connected Account!')}
              >
                <Text style={styles.payoutButtonText}>Request Instant Payout</Text>
              </TouchableOpacity>
            </Card>

            <Text style={styles.sectionTitle}>Recent Payments</Text>

            {summary.recentPayments?.length === 0 ? (
              <Text style={styles.emptyText}>No payments received yet.</Text>
            ) : (
              summary.recentPayments?.map((pay: any) => (
                <Card key={pay.id} variant="outlined" style={styles.payCard}>
                  <View style={styles.row}>
                    <Text style={styles.serviceName}>{pay.booking?.service?.name || 'Service'}</Text>
                    <Badge label={pay.status} variant="success" />
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.clientEmail}>{pay.booking?.customer?.user?.email || 'Client'}</Text>
                    <Text style={styles.amount}>+${pay.amount?.toFixed(2)}</Text>
                  </View>
                </Card>
              ))
            )}
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
  content: {
    gap: spacing.md,
    paddingBottom: spacing.xl,
  },
  mainCard: {
    padding: spacing.md,
    backgroundColor: '#F4F5F7',
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
    textTransform: 'uppercase',
  },
  netValue: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxxl || 28,
    color: colors.success || '#10B981',
    marginVertical: spacing.xs,
  },
  desc: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  payoutButton: {
    marginTop: spacing.md,
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  payoutButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginTop: spacing.md,
  },
  emptyText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  payCard: {
    padding: spacing.md,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginVertical: 2,
  },
  serviceName: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  clientEmail: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  amount: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.success || '#10B981',
  },
});
