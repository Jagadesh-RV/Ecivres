import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

interface ProviderEarningsLedgerScreenProps {
  availableBalance: number;
  pendingBalance: number;
  netEarnings: number;
  grossRevenue: number;
  onRequestPayout?: () => void;
}

export const ProviderEarningsLedgerScreen: React.FC<ProviderEarningsLedgerScreenProps> = ({
  availableBalance,
  pendingBalance,
  netEarnings,
  grossRevenue,
  onRequestPayout,
}) => {
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Provider Financial Ledger</Text>
      <Text style={styles.subtitle}>Overview of balances, escrow, and net payouts</Text>

      <View style={styles.mainCard}>
        <Text style={styles.mainLabel}>Available Balance</Text>
        <Text style={styles.mainAmount}>${availableBalance.toFixed(2)}</Text>
        
        {onRequestPayout && (
          <TouchableOpacity
            style={[styles.payoutBtn, availableBalance <= 0 && styles.disabledBtn]}
            onPress={onRequestPayout}
            disabled={availableBalance <= 0}
          >
            <Text style={styles.payoutBtnText}>Request Payout</Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.grid}>
        <View style={[styles.gridCard, styles.pendingCard]}>
          <Text style={styles.gridLabel}>Pending Escrow</Text>
          <Text style={styles.gridValue}>${pendingBalance.toFixed(2)}</Text>
          <Text style={styles.gridSub}>Releases on completion</Text>
        </View>

        <View style={[styles.gridCard, styles.netCard]}>
          <Text style={styles.gridLabel}>Net Lifetime</Text>
          <Text style={styles.gridValue}>${netEarnings.toFixed(2)}</Text>
          <Text style={styles.gridSub}>After 10% commission</Text>
        </View>
      </View>

      <View style={styles.summaryBox}>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Gross Sales Volume</Text>
          <Text style={styles.summaryVal}>${grossRevenue.toFixed(2)}</Text>
        </View>
        <View style={styles.summaryRow}>
          <Text style={styles.summaryLabel}>Platform Commission (10%)</Text>
          <Text style={styles.summaryVal}>-${(grossRevenue * 0.1).toFixed(2)}</Text>
        </View>
        <View style={[styles.summaryRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Earned Ledger</Text>
          <Text style={styles.totalVal}>${netEarnings.toFixed(2)}</Text>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  content: {
    padding: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  mainCard: {
    backgroundColor: '#0F172A',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
  },
  mainLabel: {
    color: '#94A3B8',
    fontSize: 13,
    fontWeight: '600',
  },
  mainAmount: {
    color: '#10B981',
    fontSize: 32,
    fontWeight: '900',
    marginVertical: 8,
  },
  payoutBtn: {
    backgroundColor: '#10B981',
    paddingVertical: 12,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  disabledBtn: {
    opacity: 0.4,
  },
  payoutBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  grid: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  gridCard: {
    flex: 1,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  pendingCard: {
    backgroundColor: '#FFFBEB',
    borderColor: '#FDE68A',
  },
  netCard: {
    backgroundColor: '#EEF2FF',
    borderColor: '#C7D2FE',
  },
  gridLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#475569',
  },
  gridValue: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
    marginVertical: 4,
  },
  gridSub: {
    fontSize: 10,
    color: '#64748B',
  },
  summaryBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  summaryLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  summaryVal: {
    fontSize: 13,
    fontWeight: '600',
    color: '#0F172A',
  },
  totalRow: {
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
    paddingTop: 8,
    marginTop: 4,
    marginBottom: 0,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
  },
  totalVal: {
    fontSize: 14,
    fontWeight: '800',
    color: '#10B981',
  },
});
