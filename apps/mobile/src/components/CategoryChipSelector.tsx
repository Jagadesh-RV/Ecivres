import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';

export interface CategoryChip {
  id: string;
  name: string;
}

interface CategoryChipSelectorProps {
  categories: CategoryChip[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryChipSelector: React.FC<CategoryChipSelectorProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      <TouchableOpacity
        onPress={() => onSelectCategory('all')}
        style={[
          styles.chip,
          selectedCategoryId === 'all' && styles.selectedChip,
        ]}
      >
        <Text
          style={[
            styles.chipText,
            selectedCategoryId === 'all' && styles.selectedChipText,
          ]}
        >
          All
        </Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            style={[styles.chip, isSelected && styles.selectedChip]}
          >
            <Text style={[styles.chipText, isSelected && styles.selectedChipText]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  chip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#F3F4F6',
    marginRight: 8,
  },
  selectedChip: {
    backgroundColor: '#4F46E5',
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#4B5563',
  },
  selectedChipText: {
    color: '#FFFFFF',
  },
});
