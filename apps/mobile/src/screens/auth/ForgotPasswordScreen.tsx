import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button, TextInput, ScreenContainer } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import apiClient from '../../services/api/client';

const forgotPasswordSchema = z.object({
  email: z.string().email('Please enter a valid email'),
});

const resetPasswordSchema = z.object({
  token: z.string().min(1, 'Token is required'),
  newPassword: z.string().min(6, 'Password must be at least 6 characters'),
});

type ForgotPasswordFormValues = z.infer<typeof forgotPasswordSchema>;
type ResetPasswordFormValues = z.infer<typeof resetPasswordSchema>;

export const ForgotPasswordScreen = () => {
  const navigation = useNavigation<any>();
  const [isLoading, setIsLoading] = useState(false);
  const [step, setStep] = useState<'request' | 'reset'>('request');
  const [resetToken, setResetToken] = useState('');
  const [newPassword, setNewPassword] = useState('');

  const { control, handleSubmit, formState: { errors } } = useForm<ForgotPasswordFormValues>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: { email: '' }
  });

  const onSubmitRequest = async (data: ForgotPasswordFormValues) => {
    setIsLoading(true);
    try {
      const response = await apiClient.post('/auth/forgot-password', { email: data.email });
      if (response.data?.resetToken) {
        setResetToken(response.data.resetToken);
      }
      Alert.alert(
        'Instructions Sent',
        response.data?.message || 'Check your inbox for password reset instructions.',
        [{ text: 'Proceed to Reset', onPress: () => setStep('reset') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to send reset instructions.');
    } finally {
      setIsLoading(false);
    }
  };

  const onSubmitReset = async () => {
    if (!resetToken || !newPassword) {
      Alert.alert('Error', 'Please enter both the reset token and new password');
      return;
    }
    setIsLoading(true);
    try {
      await apiClient.post('/auth/reset-password', {
        token: resetToken,
        newPassword,
      });
      Alert.alert(
        'Success',
        'Your password has been successfully reset. Please log in with your new password.',
        [{ text: 'Log In', onPress: () => navigation.navigate('Login') }]
      );
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Invalid or expired token.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <Text style={styles.title}>{step === 'request' ? 'Reset Password' : 'Set New Password'}</Text>
        <Text style={styles.subtitle}>
          {step === 'request' 
            ? 'Enter your email to receive reset instructions' 
            : 'Enter the reset token and your new password'}
        </Text>
      </View>

      {step === 'request' ? (
        <View style={styles.form}>
          <Controller
            control={control}
            name="email"
            render={({ field: { onChange, onBlur, value } }) => (
              <TextInput
                label="Email"
                placeholder="Enter your email"
                keyboardType="email-address"
                autoCapitalize="none"
                onBlur={onBlur}
                onChangeText={onChange}
                value={value}
                error={errors.email?.message}
              />
            )}
          />
        </View>
      ) : (
        <View style={styles.form}>
          <TextInput
            label="Reset Token"
            placeholder="Enter token"
            autoCapitalize="none"
            onChangeText={setResetToken}
            value={resetToken}
          />
          <TextInput
            label="New Password"
            placeholder="Enter new password"
            secureTextEntry
            onChangeText={setNewPassword}
            value={newPassword}
          />
        </View>
      )}

      <View style={styles.footer}>
        {step === 'request' ? (
          <Button 
            title="Send Instructions" 
            onPress={() => handleSubmit(onSubmitRequest)()} 
            isLoading={isLoading} 
            style={styles.button}
          />
        ) : (
          <Button 
            title="Update Password" 
            onPress={onSubmitReset} 
            isLoading={isLoading} 
            style={styles.button}
          />
        )}
        <Button 
          title="Back to Login" 
          variant="outline"
          onPress={() => navigation.goBack()} 
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    marginTop: spacing.xl,
    marginBottom: spacing.xxl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxxl,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
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
