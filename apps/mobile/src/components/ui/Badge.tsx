import React from 'react';
import { View, Text, StyleSheet, ViewStyle, TextStyle } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface BadgeProps {
  label: string;
  variant?: 'primary' | 'secondary' | 'success' | 'warning' | 'danger' | 'info';
  size?: 'sm' | 'md';
  style?: ViewStyle;
}

export const Badge: React.FC<BadgeProps> = ({
  label,
  variant = 'primary',
  size = 'md',
  style,
}) => {
  const getVariantStyles = (): { bg: ViewStyle; text: TextStyle } => {
    switch (variant) {
      case 'success':
        return { bg: { backgroundColor: '#DCFCE7' }, text: { color: '#15803D' } };
      case 'warning':
        return { bg: { backgroundColor: '#FEF3C7' }, text: { color: '#B45309' } };
      case 'danger':
        return { bg: { backgroundColor: '#FEE2E2' }, text: { color: '#B91C1C' } };
      case 'info':
        return { bg: { backgroundColor: '#E0F2FE' }, text: { color: '#0369A1' } };
      case 'secondary':
        return { bg: { backgroundColor: '#F3F4F6' }, text: { color: '#4B5563' } };
      case 'primary':
      default:
        return { bg: { backgroundColor: '#EEF2FF' }, text: { color: colors.primary } };
    }
  };

  const { bg, text } = getVariantStyles();

  return (
    <View
      style={[
        styles.container,
        size === 'sm' ? styles.containerSm : styles.containerMd,
        bg,
        style,
      ]}
    >
      <Text style={[styles.text, size === 'sm' ? styles.textSm : styles.textMd, text]}>
        {label}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignSelf: 'flex-start',
    borderRadius: 12,
    paddingHorizontal: spacing.sm,
  },
  containerSm: {
    paddingVertical: 2,
    paddingHorizontal: 6,
  },
  containerMd: {
    paddingVertical: 4,
    paddingHorizontal: 10,
  },
  text: {
    fontFamily: typography.fontFamily.semibold,
    fontWeight: '600',
  },
  textSm: {
    fontSize: typography.fontSize.xs,
  },
  textMd: {
    fontSize: typography.fontSize.sm,
  },
});
