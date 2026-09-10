import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, TextInput, Alert, ScrollView, Share } from 'react-native';

export const ReferralScreen: React.FC = () => {
  const [referralCode] = useState('REF-M7K2P9');
  const [inputCode, setInputCode] = useState('');
  const [totalEarned] = useState(45.0);

  const handleShare = async () => {
    try {
      await Share.share({
        message: `Use my referral code ${referralCode} to get $15 off your first service booking on EcivreS Marketplace! Download now.`,
        title: 'EcivreS $15 Referral Reward',
      });
    } catch (err: any) {
      Alert.alert('Error', err.message);
    }
  };

  const handleRedeem = () => {
    if (inputCode.trim()) {
      Alert.alert('Success!', `Referral code "${inputCode.trim()}" applied! $15 credit added.`);
      setInputCode('');
    }
  };

  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <View style={styles.headerCard}>
        <Text style={styles.badge}>🎁 Referral Program</Text>
        <Text style={styles.title}>Invite Friends, Get $15</Text>
        <Text style={styles.subtitle}>
          Share your referral code. When your friend completes their first service, both of you earn $15 in booking credits.
        </Text>

        <TouchableOpacity style={styles.codeBox} onPress={handleShare} activeOpacity={0.8}>
          <Text style={styles.codeText}>{referralCode}</Text>
          <Text style={styles.shareHint}>Tap to Share Code 📤</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.statsRow}>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Referrals</Text>
          <Text style={styles.statValue}>3 Friends</Text>
        </View>
        <View style={styles.statCard}>
          <Text style={styles.statLabel}>Earnings</Text>
          <Text style={styles.statValue}>${totalEarned.toFixed(2)}</Text>
        </View>
      </View>

      <View style={styles.redeemSection}>
        <Text style={styles.sectionTitle}>Redeem a Code</Text>
        <TextInput
          style={styles.input}
          value={inputCode}
          onChangeText={setInputCode}
          placeholder="Enter friend's referral code"
          placeholderTextColor="#94A3B8"
        />
        <TouchableOpacity
          style={[styles.button, !inputCode.trim() && styles.buttonDisabled]}
          onPress={handleRedeem}
          disabled={!inputCode.trim()}
        >
          <Text style={styles.buttonText}>Claim $15 Reward</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
  },
  content: {
    padding: 16,
  },
  headerCard: {
    backgroundColor: '#1E293B',
    borderRadius: 20,
    padding: 20,
    borderWidth: 1,
    borderColor: '#6366F1',
    marginBottom: 16,
  },
  badge: {
    color: '#818CF8',
    fontSize: 12,
    fontWeight: '700',
    marginBottom: 8,
  },
  title: {
    color: '#F8FAFC',
    fontSize: 22,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  subtitle: {
    color: '#CBD5E1',
    fontSize: 13,
    lineHeight: 18,
    marginBottom: 16,
  },
  codeBox: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#4F46E5',
  },
  codeText: {
    color: '#A5B4FC',
    fontSize: 20,
    fontWeight: 'bold',
    letterSpacing: 2,
  },
  shareHint: {
    color: '#818CF8',
    fontSize: 11,
    marginTop: 4,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 16,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  statLabel: {
    color: '#94A3B8',
    fontSize: 12,
  },
  statValue: {
    color: '#F8FAFC',
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 4,
  },
  redeemSection: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: '#334155',
  },
  sectionTitle: {
    color: '#F8FAFC',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  input: {
    backgroundColor: '#090D16',
    borderRadius: 12,
    paddingHorizontal: 14,
    paddingVertical: 10,
    color: '#F8FAFC',
    fontSize: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#334155',
  },
  button: {
    backgroundColor: '#4F46E5',
    borderRadius: 12,
    paddingVertical: 12,
    alignItems: 'center',
  },
  buttonDisabled: {
    opacity: 0.5,
  },
  buttonText: {
    color: '#FFFFFF',
    fontWeight: 'bold',
    fontSize: 14,
  },
});
