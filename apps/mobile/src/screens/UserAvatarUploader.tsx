import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';

export const UserAvatarUploader = () => {
  return (
    <View style={styles.container}>
      <View style={styles.avatarCircle}>
        <Text style={styles.initials}>JD</Text>
      </View>
      <TouchableOpacity style={styles.changeBtn}>
        <Text style={styles.changeText}>Upload New Photo</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: { alignItems: 'center', marginVertical: 16 },
  avatarCircle: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#4f46e5', justifyContent: 'center', alignItems: 'center' },
  initials: { color: '#ffffff', fontSize: 28, fontWeight: 'bold' },
  changeBtn: { marginTop: 10, paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20, backgroundColor: '#e0e7ff' },
  changeText: { color: '#4338ca', fontSize: 12, fontWeight: '600' },
});
