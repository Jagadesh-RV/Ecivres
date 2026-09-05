import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert } from 'react-native';

interface CompletionConfirmationScreenProps {
  bookingId: string;
  serviceTitle?: string;
  onConfirm?: (bookingId: string, notes?: string) => Promise<void>;
  onCancel?: () => void;
}

export const CompletionConfirmationScreen: React.FC<CompletionConfirmationScreenProps> = ({
  bookingId,
  serviceTitle,
  onConfirm,
  onCancel,
}) => {
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);

  const handleComplete = async () => {
    if (!onConfirm) return;
    setLoading(true);
    try {
      await onConfirm(bookingId, notes);
      Alert.alert('Service Completed', 'The booking status and payment balance have been updated.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to complete service');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Service Completion Confirmation</Text>
      <Text style={styles.subtitle}>{serviceTitle || `Booking ID: ${bookingId}`}</Text>

      <View style={styles.infoBanner}>
        <Text style={styles.infoBannerTitle}>✓ Mark Service as Delivered</Text>
        <Text style={styles.infoBannerText}>
          By completing this booking, you confirm that the service was successfully performed. Payout credit will be processed automatically.
        </Text>
      </View>

      <Text style={styles.label}>Completion Notes (Optional)</Text>
      <TextInput
        style={styles.input}
        multiline
        numberOfLines={3}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add details about completed service work..."
      />

      <View style={styles.buttonRow}>
        {onCancel && (
          <TouchableOpacity style={styles.cancelBtn} onPress={onCancel}>
            <Text style={styles.cancelText}>Back</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity style={styles.confirmBtn} onPress={handleComplete} disabled={loading}>
          <Text style={styles.confirmText}>{loading ? 'Processing...' : 'Complete Service'}</Text>
        </TouchableOpacity>
      </View>
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
  infoBanner: {
    backgroundColor: '#ECFDF5',
    borderColor: '#A7F3D0',
    borderWidth: 1,
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
  },
  infoBannerTitle: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 13,
    marginBottom: 4,
  },
  infoBannerText: {
    color: '#065F46',
    fontSize: 12,
    lineHeight: 16,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
    marginBottom: 6,
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 10,
    fontSize: 13,
    textAlignVertical: 'top',
    marginBottom: 20,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 12,
    justifyContent: 'flex-end',
  },
  cancelBtn: {
    paddingVertical: 10,
    paddingHorizontal: 16,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  cancelText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 13,
  },
  confirmBtn: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
    backgroundColor: '#10B981',
  },
  confirmText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
