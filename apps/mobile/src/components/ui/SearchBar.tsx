import React from 'react';
import { View, TextInput, TouchableOpacity, Text, StyleSheet, ViewStyle } from 'react-native';
import { colors, typography, spacing } from '../../theme';

export interface SearchBarProps {
  value: string;
  onChangeText: (text: string) => void;
  onClear?: () => void;
  placeholder?: string;
  style?: ViewStyle;
}

export const SearchBar: React.FC<SearchBarProps> = ({
  value,
  onChangeText,
  onClear,
  placeholder = 'Search services or providers...',
  style,
}) => {
  return (
    <View style={[styles.container, style]}>
      <Text style={styles.icon}>🔍</Text>
      <TextInput
        style={styles.input}
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.textMuted}
        autoCapitalize="none"
        autoCorrect={false}
      />
      {value.length > 0 && (
        <TouchableOpacity
          onPress={() => {
            onChangeText('');
            if (onClear) onClear();
          }}
          style={styles.clearButton}
        >
          <Text style={styles.clearText}>✕</Text>
        </TouchableOpacity>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F3F4F6',
    borderRadius: 10,
    paddingHorizontal: spacing.md,
    height: 44,
  },
  icon: {
    fontSize: 16,
    marginRight: spacing.xs,
  },
  input: {
    flex: 1,
    fontFamily: typography.fontFamily.regular,
    fontSize: typography.fontSize.md,
    color: colors.text,
    paddingVertical: 0,
  },
  clearButton: {
    padding: spacing.xs,
  },
  clearText: {
    fontSize: 14,
    color: colors.textMuted,
  },
});
