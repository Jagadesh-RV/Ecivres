import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

interface ProviderProfileHeaderProps {
  businessName: string;
  isVerified?: boolean;
}

export const ProviderProfileHeader: React.FC<ProviderProfileHeaderProps> = ({ businessName, isVerified }) => {
  return (
    <View style={styles.card}>
      <View style={styles.row}>
        <Text style={styles.title}>{businessName}</Text>
        {isVerified && <Text style={styles.verifiedBadge}>✓ Verified</Text>}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: { padding: 16, backgroundColor: '#ffffff', borderRadius: 14, borderWidth: 1, borderColor: '#e2e8f0', marginBottom: 12 },
  row: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  title: { fontSize: 16, fontWeight: 'bold', color: '#0f172a' },
  verifiedBadge: { backgroundColor: '#dcfce7', color: '#166534', fontSize: 11, fontWeight: 'bold', paddingHorizontal: 8, paddingVertical: 4, borderRadius: 10 },
});
