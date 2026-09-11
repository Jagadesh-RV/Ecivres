import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';

export const ReferralInviteScreen: React.FC = () => {
  const [code] = useState('ECV-ALEX-9102');

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Invite Friends & Earn $25</Text>
      <Text style={styles.subtitle}>
        Give your friends $25 off their first booking. You earn $25 when they complete their first service!
      </Text>

      <View style={styles.card}>
        <Text style={styles.codeHeader}>YOUR EXCLUSIVE CODE</Text>
        <Text style={styles.codeText}>{code}</Text>

        <View style={styles.qrContainer}>
          <Image
            source={{
              uri: `https://api.qrserver.com/v1/create-qr-code/?size=250x250&data=https://ecivres.com/invite?code=${code}`,
            }}
            style={styles.qrImage}
          />
        </View>

        <TouchableOpacity style={styles.shareButton}>
          <Text style={styles.buttonText}>Share via WhatsApp</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0F172A',
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
    marginVertical: 12,
  },
  card: {
    backgroundColor: '#1E293B',
    borderRadius: 24,
    padding: 24,
    alignItems: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: '#334155',
  },
  codeHeader: {
    fontSize: 10,
    color: '#64748B',
    fontWeight: 'bold',
  },
  codeText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6366F1',
    marginVertical: 6,
  },
  qrContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    marginVertical: 16,
  },
  qrImage: {
    width: 160,
    height: 160,
  },
  shareButton: {
    backgroundColor: '#25D366',
    borderRadius: 16,
    paddingVertical: 14,
    paddingHorizontal: 28,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 13,
    fontWeight: 'bold',
  },
});
