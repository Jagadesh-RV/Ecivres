import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export const CustomerDashboard2Screen: React.FC = () => {
  const [greeting] = useState('Good morning, Alex!');
  const [weatherContext] = useState('☀️ Sunny (30°C) — AC Servicing Recommended');

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      {/* Hero Greeting */}
      <View style={styles.heroCard}>
        <Text style={styles.weatherText}>{weatherContext}</Text>
        <Text style={styles.greetingTitle}>{greeting}</Text>
        <Text style={styles.subtitle}>Book top verified technicians in 60 seconds.</Text>
      </View>

      {/* Emergency Shortcut */}
      <TouchableOpacity style={styles.emergencyBanner} activeOpacity={0.85}>
        <Text style={styles.emergencyIcon}>🚨</Text>
        <View style={styles.emergencyTextContainer}>
          <Text style={styles.emergencyTitle}>Emergency Services Needed?</Text>
          <Text style={styles.emergencySub}>Plumbing, Electrical & Locksmith in < 30 mins</Text>
        </View>
      </TouchableOpacity>

      {/* Categories */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Trending Categories</Text>
        <View style={styles.categoryGrid}>
          {['HVAC & AC', 'Plumbing', 'Electrical', 'Cleaning', 'Pest Control', 'Appliance'].map((cat, i) => (
            <TouchableOpacity key={i} style={styles.catChip}>
              <Text style={styles.catText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
  },
  heroCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
    marginBottom: 16,
  },
  weatherText: {
    color: '#F59E0B',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 6,
  },
  greetingTitle: {
    color: '#F8FAFC',
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 6,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
  },
  emergencyBanner: {
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: 'rgba(239, 68, 68, 0.4)',
    marginBottom: 20,
  },
  emergencyIcon: {
    fontSize: 24,
    marginRight: 12,
  },
  emergencyTextContainer: {
    flex: 1,
  },
  emergencyTitle: {
    color: '#FCA5A5',
    fontWeight: 'bold',
    fontSize: 14,
  },
  emergencySub: {
    color: '#F8FAFC',
    fontSize: 12,
    marginTop: 2,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  categoryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  catChip: {
    backgroundColor: '#1E293B',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  catText: {
    color: '#E2E8F0',
    fontSize: 13,
    fontWeight: '600',
  },
});
