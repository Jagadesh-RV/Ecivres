import React from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

interface CategoryChipsBarProps {
  categories: { id: string; name: string }[];
  selectedCategoryId: string;
  onSelectCategory: (id: string) => void;
}

export const CategoryChipsBar: React.FC<CategoryChipsBarProps> = ({
  categories,
  selectedCategoryId,
  onSelectCategory,
}) => {
  return (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.container}>
      <TouchableOpacity
        onPress={() => onSelectCategory('all')}
        style={[styles.chip, selectedCategoryId === 'all' && styles.activeChip]}
      >
        <Text style={[styles.chipText, selectedCategoryId === 'all' && styles.activeChipText]}>All</Text>
      </TouchableOpacity>

      {categories.map((cat) => {
        const isSelected = selectedCategoryId === cat.id;
        return (
          <TouchableOpacity
            key={cat.id}
            onPress={() => onSelectCategory(cat.id)}
            style={[styles.chip, isSelected && styles.activeChip]}
          >
            <Text style={[styles.chipText, isSelected && styles.activeChipText]}>{cat.name}</Text>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { paddingVertical: 10, paddingHorizontal: 12, backgroundColor: '#ffffff' },
  chip: { paddingHorizontal: 14, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f1f5f9', marginRight: 8 },
  activeChip: { backgroundColor: '#4f46e5' },
  chipText: { fontSize: 12, fontWeight: '600', color: '#475569' },
  activeChipText: { color: '#ffffff' },
});
