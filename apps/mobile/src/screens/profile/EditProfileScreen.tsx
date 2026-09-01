import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, Alert, ActivityIndicator } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, TextInput, Button, Avatar } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { userService } from '../../services/api/userService';

export const EditProfileScreen = () => {
  const navigation = useNavigation<any>();
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [avatarUrl, setAvatarUrl] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const user = await userService.getCurrentUser();
        if (user?.customerProfile) {
          setFirstName(user.customerProfile.firstName || '');
          setLastName(user.customerProfile.lastName || '');
          setPhone(user.customerProfile.phone || '');
          setAvatarUrl(user.customerProfile.avatarUrl || '');
        }
      } catch (error) {
        Alert.alert('Error', 'Failed to load profile details');
      } finally {
        setIsLoading(false);
      }
    };
    loadProfile();
  }, []);

  const handleSave = async () => {
    if (!firstName.trim() || !lastName.trim()) {
      Alert.alert('Error', 'First name and last name are required');
      return;
    }

    setIsSaving(true);
    try {
      await userService.updateCustomerProfile({
        firstName,
        lastName,
        phone,
        avatarUrl: avatarUrl || undefined,
      });
      Alert.alert('Success', 'Profile updated successfully!', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  if (isLoading) {
    return (
      <ScreenContainer style={styles.center}>
        <ActivityIndicator size="large" color={colors.primary} />
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Avatar name={`${firstName} ${lastName}`} source={avatarUrl} size="xl" style={styles.avatar} />
        <Text style={styles.title}>Edit Profile</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="First Name"
          placeholder="Enter first name"
          value={firstName}
          onChangeText={setFirstName}
        />
        <TextInput
          label="Last Name"
          placeholder="Enter last name"
          value={lastName}
          onChangeText={setLastName}
        />
        <TextInput
          label="Phone Number"
          placeholder="Enter phone number"
          keyboardType="phone-pad"
          value={phone}
          onChangeText={setPhone}
        />
        <TextInput
          label="Avatar URL (Optional)"
          placeholder="https://example.com/avatar.jpg"
          autoCapitalize="none"
          value={avatarUrl}
          onChangeText={setAvatarUrl}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Save Changes"
          onPress={handleSave}
          isLoading={isSaving}
          style={styles.button}
        />
        <Button
          title="Cancel"
          variant="outline"
          onPress={() => navigation.goBack()}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  center: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  container: {
    paddingHorizontal: spacing.md,
  },
  header: {
    alignItems: 'center',
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  avatar: {
    marginBottom: spacing.md,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
  },
  form: {
    flex: 1,
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});
