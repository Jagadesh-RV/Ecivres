import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface BookingStatusTimelineProps {
  status: 'PENDING' | 'CONFIRMED' | 'COMPLETED' | 'CANCELLED';
}

export const BookingStatusTimeline: React.FC<BookingStatusTimelineProps> = ({ status }) => {
  const steps = ['PENDING', 'CONFIRMED', 'COMPLETED'];
  const currentIndex = steps.indexOf(status);

  return (
    <View style={styles.container}>
      {steps.map((step, idx) => {
        const isDone = idx <= currentIndex;
        return (
          <View key={step} style={styles.stepRow}>
            <View style={[styles.circle, isDone && styles.doneCircle]}>
              <Text style={[styles.circleText, isDone && styles.doneText]}>{idx + 1}</Text>
            </View>
            <Text style={[styles.stepLabel, isDone && styles.activeLabel]}>{step}</Text>
          </View>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  container: { flexDirection: 'row', justifyContent: 'space-between', padding: 16, backgroundColor: '#ffffff', borderRadius: 12, borderWidth: 1, borderColor: '#e2e8f0' },
  stepRow: { itemsCenter: 'center', flex: 1, alignItems: 'center' },
  circle: { width: 28, height: 28, borderRadius: 14, backgroundColor: '#e2e8f0', justifyContent: 'center', alignItems: 'center' },
  doneCircle: { backgroundColor: '#4f46e5' },
  circleText: { fontSize: 12, fontWeight: 'bold', color: '#64748b' },
  doneText: { color: '#ffffff' },
  stepLabel: { fontSize: 10, fontWeight: '600', color: '#94a3b8', marginTop: 4 },
  activeLabel: { color: '#1e293b', fontWeight: 'bold' },
});
