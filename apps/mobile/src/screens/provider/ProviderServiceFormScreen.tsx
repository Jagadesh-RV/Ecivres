import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, ScrollView, ActivityIndicator, Alert } from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { serviceService } from '../../services/api/serviceService';
import { categoryService } from '../../services/api/categoryService';

export const ProviderServiceFormScreen = () => {
  const route = useRoute<any>();
  const navigation = useNavigation<any>();
  const { serviceId } = route.params || {};

  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [duration, setDuration] = useState('');
  const [categoryId, setCategoryId] = useState('');
  
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const init = async () => {
      try {
        setLoading(true);
        const cats = await categoryService.getAllCategories();
        setCategories(cats);
        if (cats.length > 0) setCategoryId(cats[0].id);

        if (serviceId) {
          const svc = await serviceService.getServiceById(serviceId);
          setName(svc.name);
          setDescription(svc.description || '');
          setPrice(svc.price.toString());
          setDuration(svc.duration.toString());
          setCategoryId(svc.categoryId);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    init();
  }, [serviceId]);

  const handleSave = async () => {
    if (!name || !price || !duration || !categoryId) {
      setError('Please fill in all required fields.');
      return;
    }

    try {
      setSaving(true);
      setError(null);
      const data = {
        name,
        description,
        price: parseFloat(price),
        duration: parseInt(duration, 10),
        categoryId
      };

      if (serviceId) {
        await serviceService.updateService(serviceId, data);
      } else {
        await serviceService.createService(data);
      }
      
      navigation.goBack();
    } catch (err: any) {
      setError(err.response?.data?.message || err.message || 'Failed to save service');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <View style={styles.center}><ActivityIndicator size="large" /></View>;
  }

  return (
    <ScrollView style={styles.container}>
      <Text style={styles.title}>{serviceId ? 'Edit Service' : 'Create New Service'}</Text>
      
      {error && <Text style={styles.error}>{error}</Text>}

      <View style={styles.formGroup}>
        <Text style={styles.label}>Service Name *</Text>
        <TextInput 
          style={styles.input}
          value={name}
          onChangeText={setName}
          placeholder="e.g., Deep House Cleaning"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Category *</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.categoryChips}>
          {categories.map(cat => (
            <TouchableOpacity 
              key={cat.id} 
              style={[styles.chip, categoryId === cat.id && styles.chipSelected]}
              onPress={() => setCategoryId(cat.id)}
            >
              <Text style={[styles.chipText, categoryId === cat.id && styles.chipTextSelected]}>{cat.name}</Text>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, { flex: 1, marginRight: 8 }]}>
          <Text style={styles.label}>Price ($) *</Text>
          <TextInput 
            style={styles.input}
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="0.00"
          />
        </View>

        <View style={[styles.formGroup, { flex: 1, marginLeft: 8 }]}>
          <Text style={styles.label}>Duration (mins) *</Text>
          <TextInput 
            style={styles.input}
            value={duration}
            onChangeText={setDuration}
            keyboardType="numeric"
            placeholder="60"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Description</Text>
        <TextInput 
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          multiline
          numberOfLines={4}
          placeholder="Describe what is included in this service..."
        />
      </View>

      <TouchableOpacity style={styles.saveButton} onPress={handleSave} disabled={saving}>
        {saving ? <ActivityIndicator color="#fff" /> : <Text style={styles.saveButtonText}>Save Service</Text>}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container: { flex: 1, backgroundColor: '#fff', padding: 16 },
  title: { fontSize: 24, fontWeight: 'bold', marginBottom: 24 },
  error: { color: 'red', marginBottom: 16 },
  formGroup: { marginBottom: 16 },
  row: { flexDirection: 'row' },
  label: { fontSize: 14, fontWeight: 'bold', color: '#374151', marginBottom: 8 },
  input: { borderWidth: 1, borderColor: '#d1d5db', borderRadius: 8, padding: 12, fontSize: 16 },
  textArea: { height: 100, textAlignVertical: 'top' },
  categoryChips: { flexDirection: 'row', paddingVertical: 4 },
  chip: { paddingHorizontal: 16, paddingVertical: 8, borderRadius: 20, backgroundColor: '#f3f4f6', marginRight: 8, borderWidth: 1, borderColor: 'transparent' },
  chipSelected: { backgroundColor: '#000', borderColor: '#000' },
  chipText: { color: '#374151', fontWeight: 'bold' },
  chipTextSelected: { color: '#fff' },
  saveButton: { backgroundColor: '#000', padding: 16, borderRadius: 8, alignItems: 'center', marginTop: 16, marginBottom: 40 },
  saveButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' }
});
