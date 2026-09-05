import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StyleSheet, ScrollView } from 'react-native';

export const CustomerProfileSettingsScreen = () => {
  const [name, setName] = useState('John Doe');
  const [phone, setPhone] = useState('555-0199');

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>Account Profile Settings</Text>
      <Text style={styles.subtitle}>Update personal info and contact phone number.</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput value={name} onChangeText={setName} style={styles.input} />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput value={phone} onChangeText={setPhone} keyboardType="phone-pad" style={styles.input} />
      </View>

      <TouchableOpacity style={styles.saveBtn}>
        <Text style={styles.saveText}>Save Changes</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, padding: 16, backgroundColor: '#f8fafc' },
  title: { fontSize: 20, fontWeight: 'bold', color: '#0f172a' },
  subtitle: { fontSize: 12, color: '#64748b', marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  label: { fontSize: 12, fontWeight: '600', color: '#334155', marginBottom: 6 },
  input: { borderWidth: 1, borderColor: '#cbd5e1', borderRadius: 10, padding: 12, fontSize: 14, backgroundColor: '#ffffff' },
  saveBtn: { backgroundColor: '#4f46e5', paddingVertical: 14, borderRadius: 12, alignItems: 'center', marginTop: 10 },
  saveText: { color: '#ffffff', fontSize: 14, fontWeight: 'bold' },
});
