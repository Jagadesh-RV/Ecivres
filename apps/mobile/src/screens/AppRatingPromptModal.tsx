import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const AppRatingPromptModal = () => {
  return (
    <View style={styles.card}>
      <Text style={styles.title}>Enjoying EcivreS?</Text>
      <Text style={styles.desc}>Rate your experience on the App Store to help us improve platform service quality!</Text>

      <View style={styles.stars}>
        {['⭐', '⭐', '⭐', '⭐', '⭐'].map((s, idx) => (
          <TouchableOpacity key={idx}>
            <Text style={styles.star}>{s}</Text>
          </TouchableOpacity>
        ))}
      </View>

      <View style={styles.actions}>
        <TouchableOpacity style={styles.cancelBtn}>
          <Text style={styles.cancelText}>Maybe Later</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.submitBtn}>
          <Text style={styles.submitText}>Submit Rating</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 20, backgroundColor: '#ffffff', borderRadius: 16, border: '1px solid #e2e8f0', alignItems: 'center' },
  title: { fontSize: 18, fontWeight: 'bold', color: '#0f172a' },
  desc: { fontSize: 12, color: '#64748b', textAlign: 'center', marginVertical: 10 },
  stars: { flexDirection: 'row', gap: 8, marginVertical: 12 },
  star: { fontSize: 24 },
  actions: { flexDirection: 'row', gap: 10, marginTop: 10, width: '100%' },
  cancelBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, borderWidth: 1, borderColor: '#cbd5e1', alignItems: 'center' },
  cancelText: { color: '#64748b', fontSize: 13, fontWeight: '600' },
  submitBtn: { flex: 1, paddingVertical: 10, borderRadius: 10, backgroundColor: '#4f46e5', alignItems: 'center' },
  submitText: { color: '#ffffff', fontSize: 13, fontWeight: 'bold' },
});
