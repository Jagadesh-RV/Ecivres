import React from 'react';
import { View, StyleSheet, ViewStyle } from 'react-native';
import { spacing } from '../../theme';

export interface DividerProps {
  color?: string;
  thickness?: number;
  spacingMargin?: number;
  style?: ViewStyle;
}

export const Divider: React.FC<DividerProps> = ({
  color = '#E5E7EB',
  thickness = 1,
  spacingMargin = spacing.md,
  style,
}) => {
  return (
    <View
      style={[
        styles.divider,
        {
          backgroundColor: color,
          height: thickness,
          marginVertical: spacingMargin,
        },
        style,
      ]}
    />
  );
};

const styles = StyleSheet.create({
  divider: {
    width: '100%',
  },
});
