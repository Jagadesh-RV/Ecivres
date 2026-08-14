import React from 'react';
import { View, StyleSheet, ViewStyle, SafeAreaView } from 'react-native';
import { colors, spacing } from '../../theme';

interface ScreenContainerProps {
  children: React.ReactNode;
  style?: ViewStyle;
  padding?: boolean;
}

export const ScreenContainer: React.FC<ScreenContainerProps> = ({ 
  children, 
  style, 
  padding = true 
}) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={[
        styles.container, 
        padding && styles.padding,
        style
      ]}>
        {children}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.background,
  },
  container: {
    flex: 1,
  },
  padding: {
    paddingHorizontal: spacing.lg,
    paddingTop: spacing.md,
  },
});
