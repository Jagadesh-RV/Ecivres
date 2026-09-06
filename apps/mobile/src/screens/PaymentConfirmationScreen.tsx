import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';

interface PaymentConfirmationScreenProps {
  bookingId: string;
  amount: number;
  serviceTitle?: string;
  paymentStatus?: string;
  transactionId?: string;
  onMockPay?: (bookingId: string) => Promise<void>;
  onDone?: () => void;
}

export const PaymentConfirmationScreen: React.FC<PaymentConfirmationScreenProps> = ({
  bookingId,
  amount,
  serviceTitle,
  paymentStatus = 'PENDING',
  transactionId,
  onMockPay,
  onDone,
}) => {
  const [loading, setLoading] = useState(false);
  const isPaid = paymentStatus === 'SUCCESS' || paymentStatus === 'COMPLETED';

  const handlePay = async () => {
    if (!onMockPay) return;
    setLoading(true);
    try {
      await onMockPay(bookingId);
      Alert.alert('Payment Successful', 'Payment settled and booking confirmed.');
    } catch (err: any) {
      Alert.alert('Payment Error', err.message || 'Failed to process payment settlement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Settlement</Text>
      <Text style={styles.subtitle}>{serviceTitle || `Booking ID: ${bookingId}`}</Text>

      <View style={styles.receiptBox}>
        <View style={styles.row}>
          <Text style={styles.rowLabel}>Subtotal</Text>
          <Text style={styles.rowValue}>${amount.toFixed(2)}</Text>
        </View>

        <View style={styles.row}>
          <Text style={styles.rowLabel}>Processing Fee</Text>
          <Text style={styles.rowValue}>$0.00</Text>
        </View>

        <View style={[styles.row, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Due</Text>
          <Text style={styles.totalValue}>${amount.toFixed(2)}</Text>
        </View>

        {transactionId && (
          <Text style={styles.txnText}>Ref: {transactionId}</Text>
        )}
      </View>

      {!isPaid ? (
        <TouchableOpacity style={styles.payBtn} onPress={handlePay} disabled={loading}>
          <Text style={styles.payBtnText}>
            {loading ? 'Processing...' : `Confirm & Settle $${amount.toFixed(2)}`}
          </Text>
        </TouchableOpacity>
      ) : (
        <View style={styles.successBanner}>
          <Text style={styles.successText}>✓ Payment Successfully Settled</Text>
        </View>
      )}

      {onDone && (
        <TouchableOpacity style={styles.doneBtn} onPress={onDone}>
          <Text style={styles.doneText}>Return to Bookings</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  receiptBox: {
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 8,
  },
  rowLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  rowValue: {
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
  totalValue: {
    fontSize: 16,
    fontWeight: '800',
    color: '#047857',
  },
  txnText: {
    fontSize: 10,
    color: '#94A3B8',
    marginTop: 8,
    fontFamily: 'monospace',
  },
  payBtn: {
    backgroundColor: '#0F172A',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  payBtnText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 14,
  },
  successBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 12,
  },
  successText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 13,
  },
  doneBtn: {
    paddingVertical: 10,
    alignItems: 'center',
  },
  doneText: {
    color: '#64748B',
    fontSize: 13,
    fontWeight: '600',
  },
});
