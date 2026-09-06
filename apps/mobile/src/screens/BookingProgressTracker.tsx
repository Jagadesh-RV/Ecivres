import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingProgressTrackerProps {
  status: string;
}

const STEPS = [
  { key: 'PENDING', label: 'Requested' },
  { key: 'CONFIRMED', label: 'Confirmed' },
  { key: 'IN_PROGRESS', label: 'In Progress' },
  { key: 'COMPLETED', label: 'Completed' },
];

export const BookingProgressTracker: React.FC<BookingProgressTrackerProps> = ({ status }) => {
  if (status === 'CANCELLED') {
    return (
      <View style={styles.cancelledBox}>
        <Text style={styles.cancelledTitle}>✕ Booking Cancelled</Text>
        <Text style={styles.cancelledSub}>This booking request has been cancelled.</Text>
      </View>
    );
  }

  const order = ['PENDING', 'CONFIRMED', 'IN_PROGRESS', 'COMPLETED'];
  const currentIndex = order.indexOf(status);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Booking Progress</Text>
      <View style={styles.stepperRow}>
        {STEPS.map((step, idx) => {
          const stepIndex = order.indexOf(step.key);
          const isDone = stepIndex < currentIndex;
          const isCurrent = stepIndex === currentIndex;

          return (
            <View key={step.key} style={styles.stepCol}>
              <View
                style={[
                  styles.circle,
                  isDone && styles.circleDone,
                  isCurrent && styles.circleCurrent,
                ]}
              >
                <Text
                  style={[
                    styles.circleText,
                    (isDone || isCurrent) && styles.circleTextActive,
                  ]}
                >
                  {isDone ? '✓' : idx + 1}
                </Text>
              </View>
              <Text
                style={[
                  styles.stepLabel,
                  isCurrent && styles.stepLabelCurrent,
                  isDone && styles.stepLabelDone,
                ]}
              >
                {step.label}
              </Text>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#FFFFFF',
    padding: 16,
    borderRadius: 12,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#0F172A',
    marginBottom: 16,
  },
  stepperRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  stepCol: {
    alignItems: 'center',
    flex: 1,
  },
  circle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F1F5F9',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 6,
  },
  circleDone: {
    backgroundColor: '#10B981',
  },
  circleCurrent: {
    backgroundColor: '#4F46E5',
  },
  circleText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#94A3B8',
  },
  circleTextActive: {
    color: '#FFFFFF',
  },
  stepLabel: {
    fontSize: 10,
    fontWeight: '500',
    color: '#94A3B8',
    textAlign: 'center',
  },
  stepLabelCurrent: {
    color: '#4F46E5',
    fontWeight: '700',
  },
  stepLabelDone: {
    color: '#047857',
    fontWeight: '600',
  },
  cancelledBox: {
    backgroundColor: '#FEF2F2',
    borderColor: '#FECACA',
    borderWidth: 1,
    padding: 14,
    borderRadius: 10,
    marginVertical: 12,
    alignItems: 'center',
  },
  cancelledTitle: {
    color: '#EF4444',
    fontSize: 14,
    fontWeight: '700',
  },
  cancelledSub: {
    color: '#B91C1C',
    fontSize: 11,
    marginTop: 2,
  },
});
