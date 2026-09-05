import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ServiceDetailHeaderProps {
  title: string;
  category: string;
  price: string;
}

export const ServiceDetailHeader: React.FC<ServiceDetailHeaderProps> = ({ title, category, price }) => {
  return (
    <View style={styles.banner}>
      <Text style={styles.tag}>{category.toUpperCase()}</Text>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.price}>{price}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  banner: { padding: 20, backgroundColor: '#0f172a', borderRadius: 16, marginBottom: 16 },
  tag: { color: '#818cf8', fontSize: 10, fontWeight: 'bold', tracking: 1 },
  title: { color: '#ffffff', fontSize: 22, fontWeight: 'bold', marginVertical: 6 },
  price: { color: '#38bdf8', fontSize: 20, fontWeight: 'bold' },
});
