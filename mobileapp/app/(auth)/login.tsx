// app/(auth)/login.tsx
// POST /api/auth/login → save JWT → navigate to Dashboard or Onboarding

import React, { useState } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  KeyboardAvoidingView, Platform, StyleSheet
} from 'react-native';
import { useRouter } from 'expo-router';
import { Image } from 'expo-image';
import { apiLogin, apiGetProfile } from '@/lib/api';
import { saveToken, saveUser } from '@/lib/auth';
import { Colors } from '@/lib/colors';
import Input from '@/components/Input';
import Button from '@/components/Button';

export default function LoginScreen() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function handleLogin() {
    if (!email || !password) { setError('Please fill in all fields'); return; }
    setError('');
    setLoading(true);
    try {
      const data = await apiLogin(email, password);
      await saveToken(data.token);
      await saveUser(data.user);

      // Check if profile exists — if not, send to onboarding
      const profile = await apiGetProfile();
      if (!profile) {
        router.replace('/onboarding');
      } else {
        router.replace('/(tabs)/colleges');
      }
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Login failed');
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
          <Text style={styles.title}>Welcome back</Text>
          <Text style={styles.subheading}>Continue where you left off.</Text>
        </View>

        <View style={styles.card}>
          {!!error && (
            <View style={styles.errorBox}>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

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
            placeholder="Your password"
            value={password}
            onChangeText={setPassword}
            secureTextEntry
            textContentType="password"
          />

          <Button title={loading ? 'Logging in…' : 'Log in'} onPress={handleLogin} loading={loading} />

          <TouchableOpacity onPress={() => router.push('/(auth)/signup')}>
            <Text style={styles.switchText}>
              Don't have an account?{' '}
              <Text style={styles.switchLink}>Sign up free</Text>
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
