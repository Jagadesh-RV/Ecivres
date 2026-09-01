import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { ScreenContainer, TextInput, Button } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import { reviewsService } from '../../services/api/reviewsService';

export const CreateReviewScreen = () => {
  const navigation = useNavigation<any>();
  const route = useRoute<any>();
  const { bookingId, serviceName } = route.params || {};

  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async () => {
    if (!bookingId) {
      Alert.alert('Error', 'Missing booking information');
      return;
    }

    setIsLoading(true);
    try {
      await reviewsService.createReview({
        bookingId,
        rating,
        comment: comment.trim() || undefined,
      });
      Alert.alert('Thank You!', 'Your review has been submitted.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (error: any) {
      Alert.alert('Error', error.response?.data?.message || 'Failed to submit review');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <ScreenContainer style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rate & Review</Text>
        <Text style={styles.subtitle}>
          {serviceName ? `Share your experience for "${serviceName}"` : 'How was your service experience?'}
        </Text>
      </View>

      <View style={styles.ratingContainer}>
        <Text style={styles.ratingLabel}>Tap to Rate:</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map(star => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.starIcon, { color: star <= rating ? '#F59E0B' : '#D1D5DB' }]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>
        <Text style={styles.ratingText}>{rating} out of 5 stars</Text>
      </View>

      <View style={styles.form}>
        <TextInput
          label="Your Feedback (Optional)"
          placeholder="Describe your experience with the service provider..."
          multiline
          numberOfLines={4}
          value={comment}
          onChangeText={setComment}
          style={styles.textArea}
        />
      </View>

      <View style={styles.footer}>
        <Button
          title="Submit Review"
          onPress={handleSubmit}
          isLoading={isLoading}
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
  container: {
    paddingHorizontal: spacing.md,
  },
  header: {
    marginTop: spacing.lg,
    marginBottom: spacing.xl,
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
    marginBottom: spacing.xs,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
  },
  ratingContainer: {
    alignItems: 'center',
    marginBottom: spacing.xl,
    backgroundColor: '#FFFBEB',
    padding: spacing.lg,
    borderRadius: 12,
  },
  ratingLabel: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.md,
    color: colors.text,
    marginBottom: spacing.xs,
  },
  starsRow: {
    flexDirection: 'row',
    marginBottom: spacing.xs,
  },
  starIcon: {
    fontSize: 36,
    marginHorizontal: 4,
  },
  ratingText: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
  },
  form: {
    flex: 1,
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  footer: {
    paddingBottom: spacing.xl,
  },
  button: {
    marginBottom: spacing.md,
  },
});
