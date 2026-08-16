import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Button, ScreenContainer } from '../../components/ui';
import { colors, typography, spacing, radius } from '../../theme';

export const WelcomeScreen = () => {
  const navigation = useNavigation<any>();

  return (
    <ScreenContainer>
      <View style={styles.header}>
        <View style={styles.logoPlaceholder} />
        <Text style={styles.title}>EcivreS</Text>
        <Text style={styles.subtitle}>Services, Simplified.</Text>
      </View>
      
      <View style={styles.footer}>
        <Button 
          title="Log In" 
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        />
        <Button 
          title="Create an Account" 
          variant="outline" 
          onPress={() => navigation.navigate('Register')}
          style={styles.button}
        />
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  header: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoPlaceholder: {
    width: 100,
    height: 100,
    borderRadius: radius.xl,
    backgroundColor: colors.primary,
    marginBottom: spacing.xl,
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
  footer: {
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});
