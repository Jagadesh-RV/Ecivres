import React from 'react';
import { View, Text, Image, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography } from '../../theme';

export interface AvatarProps {
  name?: string;
  source?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  style?: ViewStyle;
}

export const Avatar: React.FC<AvatarProps> = ({
  name = 'User',
  source,
  size = 'md',
  style,
}) => {
  const getSizePx = (): number => {
    switch (size) {
      case 'sm':
        return 32;
      case 'lg':
        return 56;
      case 'xl':
        return 72;
      case 'md':
      default:
        return 44;
    }
  };

  const getInitials = (fullName: string): string => {
    const parts = fullName.trim().split(' ');
    if (parts.length >= 2) {
      return `${parts[0][0]}${parts[1][0]}`.toUpperCase();
    }
    return fullName.substring(0, 2).toUpperCase();
  };

  const sizePx = getSizePx();
  const radius = sizePx / 2;

  if (source) {
    return (
      <Image
        source={{ uri: source }}
        style={[
          styles.image,
          { width: sizePx, height: sizePx, borderRadius: radius },
          style,
        ]}
      />
    );
  }

  return (
    <View
      style={[
        styles.fallbackContainer,
        { width: sizePx, height: sizePx, borderRadius: radius },
        style,
      ]}
    >
      <Text style={[styles.initials, { fontSize: sizePx * 0.4 }]}>
        {getInitials(name)}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  image: {
    backgroundColor: '#E5E7EB',
  },
  fallbackContainer: {
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  initials: {
    fontFamily: typography.fontFamily.bold,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});
