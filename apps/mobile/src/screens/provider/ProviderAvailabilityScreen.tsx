import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Switch, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, Card } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';

export const ProviderAvailabilityScreen = () => {
  const [schedule, setSchedule] = useState<any[]>([
    { day: 'MONDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'TUESDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'WEDNESDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'THURSDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'FRIDAY', isOpen: true, openTime: '09:00', closeTime: '17:00' },
    { day: 'SATURDAY', isOpen: false, openTime: '10:00', closeTime: '15:00' },
    { day: 'SUNDAY', isOpen: false, openTime: '10:00', closeTime: '15:00' },
  ]);
  const [isSaving, setIsSaving] = useState(false);

  const fetchAvailability = async () => {
    try {
      const res = await client.get('/providers/availability');
      if (res.data?.length) setSchedule(res.data);
    } catch (err) {
      console.error('Failed to load mobile availability', err);
    }
  };

  useEffect(() => {
    fetchAvailability();
  }, []);

  const toggleDay = (index: number) => {
    const updated = [...schedule];
    updated[index].isOpen = !updated[index].isOpen;
    setSchedule(updated);
  };

  const handleSave = async () => {
    try {
      setIsSaving(true);
      await client.patch('/providers/availability', { schedule });
      Alert.alert('Success', 'Operating availability schedule saved!');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to save schedule');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Operating Hours</Text>
          <Text style={styles.subtitle}>Configure working days & open hours</Text>
        </View>

        <Card variant="outlined" style={styles.card}>
          {schedule.map((item, idx) => (
            <View key={item.day} style={styles.row}>
              <View style={styles.dayCol}>
                <Text style={item.isOpen ? styles.dayTextActive : styles.dayTextDisabled}>
                  {item.day}
                </Text>
                <Text style={styles.timeText}>
                  {item.isOpen ? `${item.openTime} - ${item.closeTime}` : 'Closed'}
                </Text>
              </View>
              <Switch
                value={item.isOpen}
                onValueChange={() => toggleDay(idx)}
                trackColor={{ false: '#E5E7EB', true: colors.primary }}
              />
            </View>
          ))}

          <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={isSaving}>
            <Text style={styles.saveButtonText}>{isSaving ? 'Saving...' : 'Save Schedule'}</Text>
          </TouchableOpacity>
        </Card>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  scroll: {
    paddingVertical: spacing.md,
    gap: spacing.md,
  },
  header: {
    marginBottom: spacing.xs,
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
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.xs,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dayCol: {
    gap: 2,
  },
  dayTextActive: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.text,
  },
  dayTextDisabled: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  timeText: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
    marginTop: spacing.md,
  },
  saveButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
  },
});
