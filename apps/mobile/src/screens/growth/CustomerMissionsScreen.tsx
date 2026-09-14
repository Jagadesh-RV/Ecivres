import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export const CustomerMissionsScreen: React.FC = () => {
  const [missions] = useState([
    { id: '1', title: 'Spring Home Refresh', progress: '1/2 Bookings', reward: '+500 Pts', completed: false },
    { id: '2', title: 'Viral Advocate', progress: '2/3 Referrals', reward: '+1000 Pts', completed: false },
    { id: '3', title: 'Community Feedback', progress: '3/3 Reviews', reward: '+300 Pts', completed: true },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Missions & Challenges</Text>
      <Text style={styles.subtitle}>Complete weekly goals to earn bonus loyalty points</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {missions.map((m) => (
          <View key={m.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.missionTitle}>{m.title}</Text>
              <Text style={styles.rewardBadge}>{m.reward}</Text>
            </View>
            <Text style={styles.progressText}>{m.progress}</Text>

            <TouchableOpacity
              style={[styles.button, m.completed ? styles.buttonCompleted : styles.buttonActive]}
              disabled={!m.completed}
            >
              <Text style={styles.buttonText}>{m.completed ? 'Claim Reward' : 'In Progress'}</Text>
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  missionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  rewardBadge: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#F59E0B',
  },
  progressText: {
    fontSize: 12,
    color: '#94A3B8',
    marginVertical: 8,
  },
  button: {
    borderRadius: 12,
    paddingVertical: 10,
    alignItems: 'center',
    marginTop: 4,
  },
  buttonActive: {
    backgroundColor: '#334155',
  },
  buttonCompleted: {
    backgroundColor: '#059669',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: 'bold',
  },
});
