import React from 'react';
import { View, Text, TouchableOpacity, Share, StyleSheet } from 'react-native';

interface NativeReferralShareWidgetProps {
  referralCode: string;
}

export const NativeReferralShareWidget: React.FC<NativeReferralShareWidgetProps> = ({ referralCode }) => {
  const handleShare = async () => {
    try {
      await Share.share({
        message: `Join me on EcivreS using my code ${referralCode} and get $15 off your first booking! https://ecivres.com/invite?ref=${referralCode}`,
      });
    } catch (error) {
      console.error('Error sharing referral code', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Share Your Referral Code</Text>
      <Text style={styles.code}>{referralCode}</Text>
      <TouchableOpacity style={styles.button} onPress={handleShare}>
        <Text style={styles.buttonText}>Share Invite Link</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { padding: 16, backgroundColor: '#0f172a', borderRadius: 12, alignItems: 'center' },
  title: { color: '#94a3b8', fontSize: 14, marginBottom: 8 },
  code: { color: '#38bdf8', fontSize: 24, fontWeight: 'bold', letterSpacing: 2, marginBottom: 16 },
  button: { backgroundColor: '#0284c7', paddingVertical: 12, paddingHorizontal: 24, borderRadius: 8 },
  buttonText: { color: '#ffffff', fontWeight: 'bold', fontSize: 14 },
});
