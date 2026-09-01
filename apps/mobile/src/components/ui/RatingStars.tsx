import React from 'react';
import { View, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface RatingStarsProps {
  rating: number;
  maxRating?: number;
  showNumeric?: boolean;
  size?: number;
  style?: ViewStyle;
}

export const RatingStars: React.FC<RatingStarsProps> = ({
  rating,
  maxRating = 5,
  showNumeric = true,
  size = 16,
  style,
}) => {
  const roundedRating = Math.round(rating * 10) / 10;

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= maxRating; i++) {
      const isFilled = i <= Math.floor(rating);
      const isHalf = !isFilled && i - 0.5 <= rating;

      stars.push(
        <Text key={i} style={[styles.star, { fontSize: size }]}>
          {isFilled ? '★' : isHalf ? '½' : '☆'}
        </Text>
      );
    }
    return stars;
  };

  return (
    <View style={[styles.container, style]}>
      <View style={styles.starsContainer}>{renderStars()}</View>
      {showNumeric && (
        <Text style={[styles.numericText, { fontSize: size * 0.85 }]}>
          {roundedRating.toFixed(1)}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  starsContainer: {
    flexDirection: 'row',
    marginRight: spacing.xs,
  },
  star: {
    color: '#F59E0B',
    marginRight: 1,
  },
  numericText: {
    fontFamily: typography.fontFamily.semibold,
    color: colors.textMuted,
  },
});
