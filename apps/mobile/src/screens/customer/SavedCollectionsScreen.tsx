import React, { useState } from 'react';
import { View, Text, TouchableOpacity, ScrollView, StyleSheet } from 'react-native';

export const SavedCollectionsScreen: React.FC = () => {
  const [collections] = useState([
    { id: '1', name: 'Home Repairs', count: 4 },
    { id: '2', name: 'Beauty & Wellness', count: 2 },
    { id: '3', name: 'Favorites', count: 7 },
  ]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Saved Collections</Text>
      <Text style={styles.subtitle}>Keep your favorite providers and services organized</Text>

      <ScrollView contentContainerStyle={styles.list}>
        {collections.map((col) => (
          <TouchableOpacity key={col.id} style={styles.card}>
            <View>
              <Text style={styles.cardTitle}>{col.name}</Text>
              <Text style={styles.cardSub}>{col.count} saved items</Text>
            </View>
            <Text style={styles.arrow}>→</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 20,
  },
  list: {
    gap: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#334155',
  },
  cardTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  cardSub: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  arrow: {
    fontSize: 18,
    color: '#6366F1',
    fontWeight: 'bold',
  },
});
