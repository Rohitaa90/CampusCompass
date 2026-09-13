import React, { useState, useEffect } from 'react';
import { View, ScrollView, TouchableOpacity, StyleSheet, ActivityIndicator, Alert } from 'react-native';
import { useRouter } from 'expo-router';
import { apiGetProfile, apiSaveProfile } from '@/lib/api';
import { Colors } from '@/lib/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';
import { Text } from '@/components/Text';
import { Feather } from '@expo/vector-icons';

const STREAMS = ['Engineering', 'Medical', 'Commerce', 'Arts', 'Science', 'Law'];
const INTERESTS = [
  'Computer Science', 'AI', 'Medicine', 'Business',
  'Design & Creativity', 'Finance', 'Healthcare',
  'Environmental Science', 'Literature', 'Law'
];

export default function EditProfileScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  
  const [interests, setInterests] = useState<string[]>([]);
  const [stream, setStream] = useState('Engineering');
  const [budget, setBudget] = useState('500000');
  const [location, setLocation] = useState('');

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await apiGetProfile();
        if (data?.profile) {
          setInterests(data.profile.interests ?? []);
          setStream(data.profile.preferredStream ?? 'Engineering');
          setBudget(String(data.profile.budget ?? 500000));
          setLocation(data.profile.locationPreference ?? '');
        }
      } catch (err) {
        Alert.alert('Error', 'Failed to load profile data');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  function toggleInterest(item: string) {
    setInterests(prev =>
      prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]
    );
  }

  async function handleSave() {
    if (!location.trim()) { 
      Alert.alert('Validation Error', 'Please enter a location preference'); 
      return; 
    }
    
    setSaving(true);
    try {
      await apiSaveProfile({
        interests,
        preferredStream: stream,
        budget: Number(budget) || 500000,
        locationPreference: location,
      });
      // The dashboard will refresh when focused because of useEffect/navigation, 
      // but to be safe we can use router.back() to go back to dashboard.
      router.back();
    } catch (err: unknown) {
      Alert.alert('Save Failed', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setSaving(false);
    }
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.sage} size="large" />
      </View>
    );
  }

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.container}>
      {/* Interests */}
      <View style={styles.section}>
        <Text weight="600" style={styles.label}>Your interests</Text>
        <View style={styles.chips}>
          {INTERESTS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => toggleInterest(item)}
              style={[styles.chip, interests.includes(item) && styles.chipActive]}
            >
              <Text weight={interests.includes(item) ? '600' : '400'} style={[styles.chipText, interests.includes(item) && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stream */}
      <View style={styles.section}>
        <Text weight="600" style={styles.label}>Preferred stream</Text>
        <View style={styles.chips}>
          {STREAMS.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStream(s)}
              style={[styles.chip, stream === s && styles.chipActive]}
            >
              <Text weight={stream === s ? '600' : '400'} style={[styles.chipText, stream === s && styles.chipTextActive]}>{s}</Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Budget */}
      <View style={styles.section}>
        <Input
          label={`Annual budget (₹${Number(budget).toLocaleString('en-IN')})`}
          placeholder="e.g. 500000"
          value={budget}
          onChangeText={setBudget}
          keyboardType="numeric"
        />
      </View>

      {/* Location */}
      <View style={styles.section}>
        <Input
          label="Location preference"
          placeholder="e.g. Delhi NCR, Mumbai, Anywhere"
          value={location}
          onChangeText={setLocation}
        />
      </View>

      <Button title={saving ? 'Saving...' : 'Save Changes'} onPress={handleSave} loading={saving} style={styles.saveBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Colors.parchment, justifyContent: 'center', alignItems: 'center' },
  screen: { flex: 1, backgroundColor: Colors.parchment },
  container: { padding: 24, gap: 12, paddingBottom: 48 },
  section: { marginTop: 12 },
  label: { fontSize: 15, color: Colors.midnight, marginBottom: 10 },
  chips: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  chip: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 7,
    backgroundColor: Colors.white,
  },
  chipActive: { backgroundColor: Colors.sage, borderColor: Colors.sage },
  chipText: { fontSize: 13, color: Colors.midnight },
  chipTextActive: { color: Colors.white },
  saveBtn: { marginTop: 24 },
});
