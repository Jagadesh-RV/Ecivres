import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ScrollView } from 'react-native';

export const ExecutiveDecisionScreen: React.FC = () => {
  const [decisions, setDecisions] = useState([
    { id: 'dec-1', title: '35% Peak Surge Trigger', region: 'US-EAST', reason: 'Exceeded 30% soft threshold' },
    { id: 'dec-2', title: '$7,500 Marketing Shift', region: 'EU-WEST', reason: 'Exceeded $5,000 soft threshold' },
  ]);

  const handleAction = (id: string, action: 'APPROVE' | 'REJECT') => {
    setDecisions(prev => prev.filter(d => d.id !== id));
  };

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.headerTitle}>Pending Executive Sign-Offs</Text>
      <Text style={styles.subtitle}>Policy engine flagged decisions requiring executive review</Text>

      {decisions.map(item => (
        <View key={item.id} style={styles.card}>
          <Text style={styles.cardTitle}>{item.title}</Text>
          <Text style={styles.cardDetail}>Region: {item.region}</Text>
          <Text style={styles.cardReason}>Flag Reason: {item.reason}</Text>

          <View style={styles.btnRow}>
            <TouchableOpacity style={[styles.button, styles.btnReject]} onPress={() => handleAction(item.id, 'REJECT')}>
              <Text style={styles.btnText}>Reject</Text>
            </TouchableOpacity>
            <TouchableOpacity style={[styles.button, styles.btnApprove]} onPress={() => handleAction(item.id, 'APPROVE')}>
              <Text style={styles.btnText}>Approve</Text>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      {decisions.length === 0 && (
        <View style={styles.emptyBox}>
          <Text style={styles.emptyText}>All high-risk policy decisions reviewed.</Text>
        </View>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#0f172a', padding: 16 },
  headerTitle: { fontSize: 22, fontWeight: 'bold', color: '#38bdf8', marginBottom: 4 },
  subtitle: { fontSize: 13, color: '#94a3b8', marginBottom: 16 },
  card: { backgroundColor: '#1e293b', padding: 16, borderRadius: 10, marginBottom: 12, borderWidth: 1, borderColor: '#334155' },
  cardTitle: { fontSize: 16, fontWeight: 'bold', color: '#f8fafc' },
  cardDetail: { fontSize: 13, color: '#cbd5e1', marginTop: 4 },
  cardReason: { fontSize: 12, color: '#fbbf24', marginTop: 4, fontStyle: 'italic' },
  btnRow: { flexDirection: 'row', justifyContent: 'flex-end', marginTop: 12, gap: 10 },
  button: { paddingVertical: 8, paddingHorizontal: 16, borderRadius: 6 },
  btnReject: { backgroundColor: '#ef4444' },
  btnApprove: { backgroundColor: '#10b981' },
  btnText: { color: '#ffffff', fontWeight: '600', fontSize: 13 },
  emptyBox: { padding: 32, alignItems: 'center' },
  emptyText: { color: '#64748b', fontSize: 14 },
});
