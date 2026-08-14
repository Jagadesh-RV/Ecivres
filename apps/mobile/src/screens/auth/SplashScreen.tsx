import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export const SplashScreen = () => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>EcivreS</Text>
      <ActivityIndicator size="large" color={colors.primary} style={styles.loader} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxxl,
    color: colors.primary,
  },
  loader: {
    marginTop: spacing.xl,
  },
});
