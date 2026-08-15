import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, Dimensions, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Button, ScreenContainer } from '../../components/ui';
import { colors, typography, spacing, radius } from '../../theme';

const { width } = Dimensions.get('window');

const SLIDES = [
  {
    id: '1',
    title: 'Welcome to EcivreS',
    description: 'The premium platform for managing your services and connecting with professionals.',
  },
  {
    id: '2',
    title: 'Find What You Need',
    description: 'Easily browse, book, and manage your appointments with top-rated providers.',
  },
  {
    id: '3',
    title: 'Grow Your Business',
    description: 'Providers can effortlessly manage their schedule, payments, and client relationships.',
  },
];

export const OnboardingScreen = () => {
  const navigation = useNavigation<any>();
  const [currentIndex, setCurrentIndex] = useState(0);
  const flatListRef = useRef<FlatList>(null);

  const handleNext = async () => {
    if (currentIndex < SLIDES.length - 1) {
      flatListRef.current?.scrollToIndex({ index: currentIndex + 1, animated: true });
    } else {
      await AsyncStorage.setItem('has_seen_onboarding', 'true');
      navigation.replace('Welcome');
    }
  };

  const handleSkip = async () => {
    await AsyncStorage.setItem('has_seen_onboarding', 'true');
    navigation.replace('Welcome');
  };

  return (
    <ScreenContainer padding={false}>
      <FlatList
        ref={flatListRef}
        data={SLIDES}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        onMomentumScrollEnd={(e) => {
          const index = Math.round(e.nativeEvent.contentOffset.x / width);
          setCurrentIndex(index);
        }}
        renderItem={({ item }) => (
          <View style={styles.slide}>
            {/* Image Placeholder */}
            <View style={styles.imagePlaceholder} />
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.title}</Text>
              <Text style={styles.description}>{item.description}</Text>
            </View>
          </View>
        )}
        keyExtractor={(item) => item.id}
      />
      
      <View style={styles.footer}>
        <View style={styles.pagination}>
          {SLIDES.map((_, index) => (
            <View
              key={index}
              style={[
                styles.dot,
                currentIndex === index && styles.activeDot,
              ]}
            />
          ))}
        </View>
        <View style={styles.buttonContainer}>
          <Button 
            title="Skip" 
            variant="ghost" 
            onPress={handleSkip} 
            style={styles.actionButton}
          />
          <Button 
            title={currentIndex === SLIDES.length - 1 ? "Get Started" : "Next"} 
            onPress={handleNext} 
            style={styles.actionButton}
          />
        </View>
      </View>
    </ScreenContainer>
  );
};

const styles = StyleSheet.create({
  slide: {
    width,
    alignItems: 'center',
    padding: spacing.xl,
    paddingTop: spacing.xxl * 2,
  },
  imagePlaceholder: {
    width: 250,
    height: 250,
    borderRadius: radius.round,
    backgroundColor: colors.surfaceHighlight,
    marginBottom: spacing.xxl,
  },
  textContainer: {
    alignItems: 'center',
  },
  title: {
    fontFamily: typography.fontFamily.bold,
    fontSize: typography.fontSize.xxl,
    color: colors.text,
    marginBottom: spacing.md,
    textAlign: 'center',
  },
  description: {
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.textMuted,
    textAlign: 'center',
    lineHeight: typography.lineHeight.md,
  },
  footer: {
    paddingHorizontal: spacing.xl,
    paddingBottom: spacing.xl,
  },
  pagination: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: spacing.xl,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: colors.border,
    marginHorizontal: spacing.xs,
  },
  activeDot: {
    backgroundColor: colors.primary,
    width: 24,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  actionButton: {
    flex: 1,
    marginHorizontal: spacing.xs,
  },
});
