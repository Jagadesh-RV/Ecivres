import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, Card } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';

export const ProviderServiceEditScreen = ({ route, navigation }: any) => {
  const service = route.params?.service || {};
  const [name, setName] = useState(service.name || '');
  const [description, setDescription] = useState(service.description || '');
  const [price, setPrice] = useState(service.price?.toString() || '');
  const [duration, setDuration] = useState(service.duration?.toString() || '');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleUpdate = async () => {
    try {
      setIsSubmitting(true);
      await client.patch(`/services/${service.id}`, {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
      });
      Alert.alert('Success', 'Service updated successfully!');
      navigation.goBack();
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update service');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDelete = async () => {
    Alert.alert('Delete Service', `Are you sure you want to delete "${name}"?`, [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          try {
            await client.delete(`/services/${service.id}`);
            Alert.alert('Deleted', 'Service removed successfully.');
            navigation.goBack();
          } catch (err: any) {
            Alert.alert('Error', err.response?.data?.message || 'Failed to delete service');
          }
        },
      },
    ]);
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Edit Service Offering</Text>
          <Text style={styles.subtitle}>Update pricing, duration, and details</Text>
        </View>

        <Card variant="outlined" style={styles.card}>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Service Title</Text>
            <TextInput
              style={styles.input}
              value={name}
              onChangeText={setName}
              placeholder="e.g. Deep House Cleaning"
            />
          </View>

          <View style={styles.row}>
            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Price ($)</Text>
              <TextInput
                style={styles.input}
                value={price}
                onChangeText={setPrice}
                placeholder="99.00"
                keyboardType="numeric"
              />
            </View>

            <View style={[styles.inputGroup, { flex: 1 }]}>
              <Text style={styles.label}>Duration (Mins)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                placeholder="60"
                keyboardType="number-pad"
              />
            </View>
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Description</Text>
            <TextInput
              style={[styles.input, styles.textArea]}
              value={description}
              onChangeText={setDescription}
              placeholder="Detailed explanation of what is included..."
              multiline
              numberOfLines={4}
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdate} disabled={isSubmitting}>
            <Text style={styles.saveButtonText}>{isSubmitting ? 'Updating...' : 'Save Changes'}</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
            <Text style={styles.deleteButtonText}>Delete Service Offering</Text>
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
    gap: spacing.md,
  },
  inputGroup: {
    gap: 4,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  label: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.xs,
    color: colors.text,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: spacing.xs,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs,
    fontSize: typography.fontSize.sm,
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 90,
    textAlignVertical: 'top',
  },
  saveButton: {
    backgroundColor: colors.primary,
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  saveButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
  },
  deleteButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
  },
  deleteButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: '#DC2626',
  },
});
