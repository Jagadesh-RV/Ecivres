import React from 'react';
import { TouchableOpacity, Text, StyleSheet, ActivityIndicator, TouchableOpacityProps } from 'react-native';
import { colors, typography, spacing, radius } from '../../theme';

interface ButtonProps extends TouchableOpacityProps {
  title: string;
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost';
  isLoading?: boolean;
}

export const Button: React.FC<ButtonProps> = ({ 
  title, 
  variant = 'primary', 
  isLoading = false, 
  style, 
  disabled,
  ...props 
}) => {
  const isPrimary = variant === 'primary';
  const isSecondary = variant === 'secondary';
  const isOutline = variant === 'outline';
  
  const getBackgroundColor = () => {
    if (disabled) return colors.border;
    if (isPrimary) return colors.primary;
    if (isSecondary) return colors.secondary;
    if (isOutline) return 'transparent';
    return 'transparent'; // ghost
  };

  const getTextColor = () => {
    if (disabled) return colors.textMuted;
    if (isOutline || variant === 'ghost') return colors.primary;
    return colors.textInverse;
  };

  return (
    <TouchableOpacity
      style={[
        styles.container,
        { backgroundColor: getBackgroundColor() },
        isOutline && styles.outlineBorder,
        style,
      ]}
      disabled={disabled || isLoading}
      activeOpacity={0.8}
      {...props}
    >
      {isLoading ? (
        <ActivityIndicator color={getTextColor()} />
      ) : (
        <Text style={[styles.text, { color: getTextColor() }]}>
          {title}
        </Text>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    borderRadius: radius.md,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  text: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
  },
  outlineBorder: {
    borderWidth: 1,
    borderColor: colors.primary,
  },
});
