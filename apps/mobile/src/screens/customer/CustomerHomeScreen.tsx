import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, RefreshControl, TouchableOpacity } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { ScreenContainer, Card, Badge, SearchBar } from '../../components/ui';
import { colors, typography, spacing } from '../../theme';
import client from '../../services/api/client';
import { useAuthStore } from '../../stores/authStore';

export const CustomerHomeScreen = () => {
  const navigation = useNavigation<any>();
  const user = useAuthStore((state) => state.user);
  const [stats, setStats] = useState<any>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const loadDashboard = async () => {
    try {
      const res = await client.get('/users/customer/dashboard-stats');
      setStats(res.data);
    } catch (err) {
      console.error('Failed to load mobile customer stats', err);
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadDashboard();
  }, []);

  const onRefresh = () => {
    setRefreshing(true);
    loadDashboard();
  };

  const customerName = user?.customerProfile
    ? `${user.customerProfile.firstName}`
    : 'Customer';

  return (
    <ScreenContainer style={styles.container}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Hello, {customerName} 👋</Text>
            <Text style={styles.subtitle}>Find & book top service professionals</Text>
          </View>
        </View>

        <SearchBar
          placeholder="Search home services, cleaning, repairs..."
          value={searchQuery}
          onChangeText={setSearchQuery}
          style={styles.searchBar}
        />

        <View style={styles.statsRow}>
          <Card variant="outlined" style={styles.statCard}>
            <Text style={styles.statIcon}>⏳</Text>
            <Text style={styles.statNumber}>{stats?.activeBookings ?? 0}</Text>
            <Text style={styles.statLabel}>Active</Text>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <Text style={styles.statIcon}>✅</Text>
            <Text style={styles.statNumber}>{stats?.completedBookings ?? 0}</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </Card>

          <Card variant="outlined" style={styles.statCard}>
            <Text style={styles.statIcon}>💳</Text>
            <Text style={styles.statNumber}>${stats?.totalSpent?.toFixed(0) ?? 0}</Text>
            <Text style={styles.statLabel}>Spent</Text>
          </Card>
        </View>

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>Categories</Text>
        </View>

        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoriesRow}>
          {['🧹 Cleaning', '🔧 Plumbing', '⚡ Electrician', '🎨 Painting', '🪵 Carpentry'].map((cat, idx) => (
            <TouchableOpacity key={idx} style={styles.categoryChip}>
              <Text style={styles.categoryText}>{cat}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </ScrollView>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: spacing.md,
  },
  header: {
    marginTop: spacing.md,
    marginBottom: spacing.md,
  },
  greeting: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.primary,
  },
  subtitle: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.sm,
    color: colors.textMuted,
    marginTop: 2,
  },
  searchBar: {
    marginBottom: spacing.lg,
  },
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: spacing.xl,
  },
  statCard: {
    flex: 1,
    marginHorizontal: 4,
    alignItems: 'center',
    paddingVertical: spacing.md,
  },
  statIcon: {
    fontSize: 24,
    marginBottom: spacing.xs,
  },
  statNumber: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.text,
  },
  statLabel: {
    fontFamily: typography.fontFamily.medium,
    fontSize: typography.fontSize.xs,
    color: colors.textMuted,
  },
  sectionHeader: {
    marginBottom: spacing.md,
  },
  sectionTitle: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.lg,
    color: colors.primary,
  },
  categoriesRow: {
    marginBottom: spacing.xl,
  },
  categoryChip: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: 20,
    marginRight: spacing.sm,
  },
  categoryText: {
    fontFamily: typography.fontFamily.semibold,
    fontSize: typography.fontSize.sm,
    color: colors.secondary,
  },
});
