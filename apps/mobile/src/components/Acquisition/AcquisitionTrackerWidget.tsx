import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface Props {
  activationScore: number;
  referralCode?: string;
}

export const AcquisitionTrackerWidget: React.FC<Props> = ({ activationScore, referralCode }) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Activation Level: {activationScore}%</Text>
      {referralCode && <Text style={styles.subtext}>Referred via code: {referralCode}</Text>}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 12,
    backgroundColor: '#1e293b',
    borderRadius: 8,
    marginVertical: 8,
  },
  title: {
    color: '#38bdf8',
    fontSize: 14,
    fontWeight: '600',
  },
  subtext: {
    color: '#94a3b8',
    fontSize: 12,
    marginTop: 4,
  },
});
