import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert } from 'react-native';

interface ReviewScreenTriggerProps {
  bookingId: string;
  serviceTitle?: string;
  onSubmitReview?: (bookingId: string, rating: number, comment: string) => Promise<void>;
  onDismiss?: () => void;
}

export const ReviewScreenTrigger: React.FC<ReviewScreenTriggerProps> = ({
  bookingId,
  serviceTitle,
  onSubmitReview,
  onDismiss,
}) => {
  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleSubmit = async () => {
    if (!onSubmitReview) return;
    if (!comment.trim()) {
      Alert.alert('Required', 'Please enter a brief review comment');
      return;
    }

    setSubmitting(true);
    try {
      await onSubmitReview(bookingId, rating, comment);
      Alert.alert('Thank You!', 'Your review has been published.');
    } catch (err: any) {
      Alert.alert('Error', err.message || 'Failed to submit review');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <View style={styles.card}>
      <Text style={styles.title}>Rate Your Service Experience</Text>
      <Text style={styles.subtitle}>{serviceTitle || `Booking ID: ${bookingId}`}</Text>

      <View style={styles.starRow}>
        {[1, 2, 3, 4, 5].map((star) => (
          <TouchableOpacity key={star} onPress={() => setRating(star)}>
            <Text style={[styles.starText, star <= rating ? styles.starActive : styles.starInactive]}>
              ★
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <TextInput
        style={styles.input}
        multiline
        numberOfLines={3}
        value={comment}
        onChangeText={setComment}
        placeholder="Write a review about your service experience..."
      />

      <View style={styles.buttonRow}>
        {onDismiss && (
          <TouchableOpacity style={styles.dismissBtn} onPress={onDismiss}>
            <Text style={styles.dismissText}>Maybe Later</Text>
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.submitBtn, (!comment.trim() || submitting) && styles.disabledBtn]}
          onPress={handleSubmit}
          disabled={!comment.trim() || submitting}
        >
          <Text style={styles.submitText}>{submitting ? 'Posting...' : 'Submit Review'}</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 18,
    fontWeight: '800',
    color: '#0F172A',
  },
  subtitle: {
    fontSize: 13,
    color: '#64748B',
    marginTop: 2,
    marginBottom: 16,
  },
  starRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: 12,
    marginBottom: 16,
  },
  starText: {
    fontSize: 32,
  },
  starActive: {
    color: '#F59E0B',
  },
  starInactive: {
    color: '#CBD5E1',
  },
  input: {
    backgroundColor: '#F8FAFC',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 10,
    padding: 12,
    fontSize: 13,
    textAlignVertical: 'top',
    marginBottom: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    gap: 10,
    justifyContent: 'flex-end',
  },
  dismissBtn: {
    paddingVertical: 10,
    paddingHorizontal: 14,
    borderRadius: 8,
    backgroundColor: '#F1F5F9',
  },
  dismissText: {
    color: '#64748B',
    fontWeight: '600',
    fontSize: 13,
  },
  submitBtn: {
    paddingVertical: 10,
    paddingHorizontal: 18,
    borderRadius: 8,
    backgroundColor: '#0F172A',
  },
  disabledBtn: {
    opacity: 0.5,
  },
  submitText: {
    color: '#FFFFFF',
    fontWeight: '700',
    fontSize: 13,
  },
});
