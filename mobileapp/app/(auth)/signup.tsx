// app/(auth)/signup.tsx
// POST /api/auth/signup → save JWT → go to Onboarding

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { apiSignup } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';
import { Colors } from '@/lib/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function SignupScreen() {
  const router = useRouter();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleSignup() {
    if (!name || !email || !password) { setError('Please fill in all fields'); return; }
    if (password.length < 6) { setError('Password must be at least 6 characters'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await apiSignup(name, email, password);
      await saveToken(data.token);
      await saveUser(data.user);
      router.replace('/onboarding');
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Signup failed');
    } finally {
      setLoading(false);
    }
  }

  return (
    <KeyboardAvoidingView
      style={styles.flex}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
    >
      <ScrollView
        contentContainerStyle={styles.container}
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.header}>
          <Image 
            source={require('../../assets/logo.svg')} 
            style={styles.logoImage} 
            contentFit="contain" 
          />
          <Text style={styles.title}>Create an account</Text>
          <Text style={styles.subheading}>Find your path, not someone else's.</Text>
        </View>

        <View style={styles.card}>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          <Input
            label="Full name"
            placeholder="Your name"
            value={name}
            onChangeText={setName}
            textContentType="name"
            autoCapitalize="words"
          />
          <Input
            label="Email"
            placeholder="you@email.com"
            value={email}
            onChangeText={setEmail}
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            textContentType="emailAddress"
          />
          <Input
            label="Password"
            placeholder="Min. 6 characters"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="newPassword"
          />

          <Button title={loading ? 'Creating account…' : 'Sign up free'} onPress={handleSignup} loading={loading} />

          <TouchableOpacity onPress={() => router.push('/(auth)/login')}>
            <Text style={styles.switchText}>
              Already have an account?{' '}
              <Text style={styles.switchLink}>Log in</Text>
            </Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1, backgroundColor: Colors.parchment },
  container: { flexGrow: 1, padding: 24, paddingTop: 16, gap: 16 },
  header: {
    marginBottom: 20,
    marginTop: 8,
  },
  logoImage: {
    width: 200,
    height: 60,
    marginBottom: 8,
  },
  title: { fontFamily: 'Sora_700Bold', fontSize: 32, fontWeight: '700', color: Colors.midnight },
  subheading: { fontFamily: 'Sora_400Regular', fontSize: 15, color: Colors.steel },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 24,
    gap: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  errorBox: {
    backgroundColor: Colors.errorBg,
    borderWidth: 1,
    borderColor: Colors.errorBorder,
    borderRadius: 8,
    padding: 12,
  },
  errorText: { fontFamily: 'Sora_400Regular', color: Colors.errorRed, fontSize: 14 },
  switchText: { fontFamily: 'Sora_400Regular', textAlign: 'center', color: Colors.steel, fontSize: 14 },
  switchLink: { fontFamily: 'Sora_600SemiBold', color: Colors.sage, fontWeight: '600' },
});
