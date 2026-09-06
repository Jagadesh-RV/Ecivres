import React from 'react';
import { View, TextInput, StyleSheet } from 'react-native';

interface ServiceSearchHeaderProps {
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
}

export const ServiceSearchHeader: React.FC<ServiceSearchHeaderProps> = ({
  value,
  onChangeText,
  placeholder = 'Search services or providers...',
}) => {
  return (
    <View style={styles.container}>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor="#94a3b8"
        style={styles.input}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 12, backgroundColor: '#ffffff', borderBottomWidth: 1, borderBottomColor: '#e2e8f0' },
  input: { backgroundColor: '#f1f5f9', borderRadius: 10, paddingHorizontal: 14, paddingVertical: 10, fontSize: 14, color: '#0f172a' },
});
