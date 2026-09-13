// app/onboarding.tsx
// GET /api/profile to pre-fill (edit mode), POST /api/profile to save

import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { apiGetProfile, apiSaveProfile } from '@/lib/api';
import { Colors } from '@/lib/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

const STREAMS = ['Engineering', 'Medical', 'Commerce', 'Arts', 'Science', 'Law'];

const INTERESTS = [
  'Computer Science', 'AI', 'Medicine', 'Business',
  'Design & Creativity', 'Finance', 'Healthcare',
  'Environmental Science', 'Literature', 'Law'
];

export default function OnboardingScreen() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');

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
      } catch (_) {
        // No profile yet — fresh start
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

  async function handleSubmit() {
    if (!location.trim()) { setError('Please enter a location preference'); return; }
    setError('');
    setSaving(true);
    try {
      await apiSaveProfile({
        interests,
        preferredStream: stream,
        budget: Number(budget) || 500000,
        locationPreference: location,
      });
      router.replace('/(tabs)/colleges');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to save profile');
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
      <Text style={styles.heading}>Tell us about yourself</Text>
      <Text style={styles.subheading}>
        We'll use this to give you the most relevant college recommendations.
      </Text>

      {/* Interests */}
      <View style={styles.section}>
        <Text style={styles.label}>Your interests</Text>
        <View style={styles.chips}>
          {INTERESTS.map(item => (
            <TouchableOpacity
              key={item}
              onPress={() => toggleInterest(item)}
              style={[styles.chip, interests.includes(item) && styles.chipActive]}
            >
              <Text style={[styles.chipText, interests.includes(item) && styles.chipTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Stream */}
      <View style={styles.section}>
        <Text style={styles.label}>Preferred stream</Text>
        <View style={styles.chips}>
          {STREAMS.map(s => (
            <TouchableOpacity
              key={s}
              onPress={() => setStream(s)}
              style={[styles.chip, stream === s && styles.chipActive]}
            >
              <Text style={[styles.chipText, stream === s && styles.chipTextActive]}>{s}</Text>
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

      {!!error && <Text style={styles.error}>{error}</Text>}

      <Button title={saving ? 'Saving…' : 'Find my colleges →'} onPress={handleSubmit} loading={saving} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Colors.parchment, justifyContent: 'center', alignItems: 'center' },
  screen: { flex: 1, backgroundColor: Colors.parchment },
  container: { padding: 24, paddingTop: 72, gap: 8, paddingBottom: 48 },
  heading: { fontSize: 28, fontWeight: '700', color: Colors.midnight, marginBottom: 4 },
  subheading: { fontSize: 15, color: Colors.steel, marginBottom: 8, lineHeight: 22 },
  section: { marginTop: 20 },
  label: { fontSize: 14, fontWeight: '600', color: Colors.midnight, marginBottom: 10 },
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
  chipTextActive: { color: Colors.white, fontWeight: '600' },
  error: { color: Colors.errorRed, fontSize: 14 },
});
