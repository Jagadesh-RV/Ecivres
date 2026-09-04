import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { client } from '../../lib/axios';

interface SubmitReviewScreenProps {
  route: {
    params: {
      bookingId: string;
      serviceName: string;
    };
  };
  navigation: any;
}

export const SubmitReviewScreen: React.FC<SubmitReviewScreenProps> = ({
  route,
  navigation,
}) => {
  const { bookingId, serviceName } = route.params || {
    bookingId: 'booking-1',
    serviceName: 'Service',
  };

  const [rating, setRating] = useState<number>(5);
  const [comment, setComment] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      await client.post('/reviews', {
        bookingId,
        rating,
        comment,
      });
      Alert.alert('Thank You!', 'Your review has been submitted successfully.', [
        { text: 'OK', onPress: () => navigation.goBack() },
      ]);
    } catch (err: any) {
      Alert.alert('Error', err.response?.data?.message || 'Failed to submit review');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Rate Your Service</Text>
        <Text style={styles.subtitle}>{serviceName}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.label}>Select Rating</Text>
        <View style={styles.starsRow}>
          {[1, 2, 3, 4, 5].map((star) => (
            <TouchableOpacity key={star} onPress={() => setRating(star)}>
              <Text style={[styles.starText, star <= rating ? styles.starActive : styles.starInactive]}>
                ★
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.label}>Feedback Comment (Optional)</Text>
        <TextInput
          style={styles.textArea}
          multiline
          numberOfLines={4}
          placeholder="Share details of your experience..."
          value={comment}
          onChangeText={setComment}
          textAlignVertical="top"
        />

        <TouchableOpacity
          style={styles.submitBtn}
          onPress={handleSubmit}
          disabled={loading}
        >
          {loading ? (
            <ActivityIndicator color="#FFFFFF" />
          ) : (
            <Text style={styles.submitBtnText}>Submit Review</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F9FAFB',
  },
  header: {
    padding: 16,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
  },
  title: {
    fontSize: 20,
    fontWeight: '700',
    color: '#111827',
  },
  subtitle: {
    fontSize: 12,
    color: '#6B7280',
    marginTop: 4,
  },
  card: {
    backgroundColor: '#FFFFFF',
    margin: 16,
    borderRadius: 14,
    padding: 16,
    borderWidth: 1,
    borderColor: '#E5E7EB',
  },
  label: {
    fontSize: 12,
    fontWeight: '700',
    color: '#374151',
    marginTop: 12,
    marginBottom: 8,
  },
  starsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: 16,
  },
  starText: {
    fontSize: 36,
    marginHorizontal: 4,
  },
  starActive: {
    color: '#F59E0B',
  },
  starInactive: {
    color: '#D1D5DB',
  },
  textArea: {
    borderWidth: 1,
    borderColor: '#D1D5DB',
    borderRadius: 8,
    padding: 12,
    fontSize: 14,
    minHeight: 90,
    marginBottom: 16,
  },
  submitBtn: {
    backgroundColor: '#4F46E5',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
  },
  submitBtnText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '700',
  },
});
