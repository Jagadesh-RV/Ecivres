import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';

export interface RecommendedProviderItem {
  providerId: string;
  businessName: string;
  isVerified: boolean;
  score: number;
  averageRating: number;
  completedBookingsCount: number;
  distanceKm?: number;
}

interface RecommendedProvidersCarouselProps {
  providers: RecommendedProviderItem[];
  onSelectProvider: (providerId: string) => void;
}

export const RecommendedProvidersCarousel: React.FC<RecommendedProvidersCarouselProps> = ({
  providers,
  onSelectProvider,
}) => {
  if (!providers || providers.length === 0) {
    return null;
  }

  const renderItem = ({ item }: { item: RecommendedProviderItem }) => {
    const matchPercentage = Math.round(item.score * 100);

    return (
      <TouchableOpacity
        style={styles.card}
        activeOpacity={0.85}
        onPress={() => onSelectProvider(item.providerId)}
      >
        <View style={styles.badgeRow}>
          <View style={styles.matchBadge}>
            <Text style={styles.matchText}>⚡ {matchPercentage}% AI Match</Text>
          </View>
          {item.isVerified && (
            <View style={styles.verifiedBadge}>
              <Text style={styles.verifiedText}>✓ Verified</Text>
            </View>
          )}
        </View>

        <View style={styles.headerRow}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>{item.businessName.charAt(0).toUpperCase()}</Text>
          </View>
          <View style={styles.titleContainer}>
            <Text style={styles.businessName} numberOfLines={1}>
              {item.businessName}
            </Text>
            <Text style={styles.subText}>
              ★ {item.averageRating} • {item.completedBookingsCount} jobs
            </Text>
          </View>
        </View>

        {item.distanceKm !== undefined && (
          <Text style={styles.distanceText}>📍 {item.distanceKm} km away</Text>
        )}

        <View style={styles.button}>
          <Text style={styles.buttonText}>Book Provider</Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.sectionTitle}>AI Recommended Providers</Text>
      <FlatList
        data={providers}
        keyExtractor={(item) => item.providerId}
        renderItem={renderItem}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#F8FAFC',
    marginHorizontal: 16,
    marginBottom: 12,
  },
  listContent: {
    paddingHorizontal: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 14,
    marginHorizontal: 4,
    width: 240,
    borderWidth: 1,
    borderColor: '#334155',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  matchBadge: {
    backgroundColor: 'rgba(99, 102, 241, 0.15)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: 'rgba(99, 102, 241, 0.3)',
  },
  matchText: {
    color: '#818CF8',
    fontSize: 11,
    fontWeight: '600',
  },
  verifiedBadge: {
    backgroundColor: 'rgba(16, 185, 129, 0.15)',
    paddingHorizontal: 6,
    paddingVertical: 3,
    borderRadius: 6,
  },
  verifiedText: {
    color: '#34D399',
    fontSize: 10,
    fontWeight: '600',
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#6366F1',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 10,
  },
  avatarText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 18,
  },
  titleContainer: {
    flex: 1,
  },
  businessName: {
    color: '#F8FAFC',
    fontSize: 15,
    fontWeight: '600',
  },
  subText: {
    color: '#94A3B8',
    fontSize: 12,
    marginTop: 2,
  },
  distanceText: {
    color: '#CBD5E1',
    fontSize: 12,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingVertical: 8,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
  },
});
