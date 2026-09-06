import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';

interface ProviderBookingActionsBarProps {
  status: string;
  onAccept?: () => void;
  onReject?: () => void;
  onReschedule?: () => void;
  onMarkCompleted?: () => void;
}

export const ProviderBookingActionsBar: React.FC<ProviderBookingActionsBarProps> = ({
  status,
  onAccept,
  onReject,
  onReschedule,
  onMarkCompleted,
}) => {
  return (
    <View style={styles.container}>
      {status === 'PENDING' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.acceptBtn]} onPress={onAccept}>
            <Text style={styles.acceptText}>Accept Request</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.rejectBtn]} onPress={onReject}>
            <Text style={styles.rejectText}>Reject</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.rescheduleBtn]} onPress={onReschedule}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'CONFIRMED' && (
        <View style={styles.buttonRow}>
          <TouchableOpacity style={[styles.button, styles.completeBtn]} onPress={onMarkCompleted}>
            <Text style={styles.completeText}>Mark as Service Completed</Text>
          </TouchableOpacity>

          <TouchableOpacity style={[styles.button, styles.rescheduleBtn]} onPress={onReschedule}>
            <Text style={styles.rescheduleText}>Reschedule</Text>
          </TouchableOpacity>
        </View>
      )}

      {status === 'COMPLETED' && (
        <View style={styles.completedBox}>
          <Text style={styles.completedText}>✓ Service Completed & Payout Logged</Text>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 8,
  },
  button: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  acceptBtn: {
    flex: 1.2,
    backgroundColor: '#10B981',
  },
  acceptText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  rejectBtn: {
    flex: 1,
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
  },
  rejectText: {
    color: '#DC2626',
    fontWeight: '600',
    fontSize: 13,
  },
  rescheduleBtn: {
    flex: 1,
    backgroundColor: '#FFFBEB',
    borderWidth: 1,
    borderColor: '#FCD34D',
  },
  rescheduleText: {
    color: '#B45309',
    fontWeight: '600',
    fontSize: 13,
  },
  completeBtn: {
    flex: 2,
    backgroundColor: '#4F46E5',
  },
  completeText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
  completedBox: {
    padding: 10,
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    alignItems: 'center',
  },
  completedText: {
    color: '#047857',
    fontWeight: '700',
    fontSize: 13,
  },
});
