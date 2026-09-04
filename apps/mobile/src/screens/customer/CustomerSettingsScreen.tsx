import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert } from 'react-native';
import { ScreenContainer, Card } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { useAuthStore } from '../../stores/auth-store';
import client from '../../services/api/client';

export const CustomerSettingsScreen = ({ navigation }: any) => {
  const { user, logout, fetchCurrentUser } = useAuthStore();
  const [firstName, setFirstName] = useState(user?.customerProfile?.firstName || '');
  const [lastName, setLastName] = useState(user?.customerProfile?.lastName || '');
  const [phone, setPhone] = useState(user?.customerProfile?.phone || '');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [isUpdating, setIsUpdating] = useState(false);

  const handleUpdateProfile = async () => {
    try {
      setIsUpdating(true);
      await client.patch('/users/profiles/customer', { firstName, lastName, phone });
      await fetchCurrentUser();
      Alert.alert('Success', 'Profile details updated successfully!');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };

  const handleChangePassword = async () => {
    if (!currentPassword || !newPassword) {
      Alert.alert('Error', 'Please enter both current and new password');
      return;
    }
    try {
      setIsUpdating(true);
      await client.post('/users/change-password', { currentPassword, newPassword });
      Alert.alert('Success', 'Password changed successfully!');
      setCurrentPassword('');
      setNewPassword('');
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to change password');
    } finally {
      setIsUpdating(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView contentContainerStyle={styles.scroll}>
        <View style={styles.header}>
          <Text style={styles.title}>Account & Settings</Text>
          <Text style={styles.email}>{user?.email}</Text>
        </View>

        {/* Profile Card */}
        <Card variant="outlined" style={styles.card}>
          <Text style={styles.cardTitle}>Personal Profile</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>First Name</Text>
            <TextInput
              style={styles.input}
              value={firstName}
              onChangeText={setFirstName}
              placeholder="First Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Last Name</Text>
            <TextInput
              style={styles.input}
              value={lastName}
              onChangeText={setLastName}
              placeholder="Last Name"
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Phone Number</Text>
            <TextInput
              style={styles.input}
              value={phone}
              onChangeText={setPhone}
              placeholder="+1 (555) 000-0000"
              keyboardType="phone-pad"
            />
          </View>

          <TouchableOpacity style={styles.saveButton} onPress={handleUpdateProfile} disabled={isUpdating}>
            <Text style={styles.saveButtonText}>{isUpdating ? 'Saving...' : 'Save Profile'}</Text>
          </TouchableOpacity>
        </Card>

        {/* Password Security Card */}
        <Card variant="outlined" style={styles.card}>
          <Text style={styles.cardTitle}>Security & Password</Text>
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Current Password</Text>
            <TextInput
              style={styles.input}
              value={currentPassword}
              onChangeText={setCurrentPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>New Password</Text>
            <TextInput
              style={styles.input}
              value={newPassword}
              onChangeText={setNewPassword}
              placeholder="••••••••"
              secureTextEntry
            />
          </View>

          <TouchableOpacity style={styles.passwordButton} onPress={handleChangePassword} disabled={isUpdating}>
            <Text style={styles.passwordButtonText}>Update Password</Text>
          </TouchableOpacity>
        </Card>

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={logout}>
          <Text style={styles.logoutButtonText}>Log Out</Text>
        </TouchableOpacity>
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
  email: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  card: {
    padding: spacing.md,
    gap: spacing.sm,
  },
  cardTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  inputGroup: {
    gap: 4,
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
  passwordButton: {
    backgroundColor: '#374151',
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
    marginTop: spacing.xs,
  },
  passwordButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xs,
    color: '#FFFFFF',
  },
  logoutButton: {
    backgroundColor: '#FEF2F2',
    borderWidth: 1,
    borderColor: '#FCA5A5',
    paddingVertical: spacing.sm,
    borderRadius: spacing.xs,
    alignItems: 'center',
    marginTop: spacing.sm,
  },
  logoutButtonText: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.sm,
    color: '#DC2626',
  },
});
