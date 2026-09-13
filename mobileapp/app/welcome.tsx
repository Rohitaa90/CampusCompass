import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { Colors } from '@/lib/colors';
import Button from '@/components/Button';
import { Image } from 'expo-image';

const { width } = Dimensions.get('window');

export default function WelcomeScreen() {
  const router = useRouter();

  return (
    <View style={styles.screen}>
      <View style={styles.topSection}>
        <Text style={styles.welcomeText}>Welcome to</Text>
        <Image 
          source={require('../assets/logo.svg')} 
          style={styles.logoImage} 
          contentFit="contain" 
        />
        <Text style={styles.subtitle}>
          Find your perfect college, compare fees, and chat with our AI Counselor to make the right career choice.
        </Text>
      </View>

      <View style={styles.bottomSection}>
        <Button 
          title="Get Started" 
          onPress={() => router.push('/(auth)/signup')} 
          style={styles.btn}
        />
        <Button 
          title="Log in to existing account" 
          variant="outline"
          onPress={() => router.push('/(auth)/login')} 
          style={styles.btn}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: Colors.parchment,
    justifyContent: 'space-between',
    padding: 24,
  },
  topSection: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 16,
    paddingTop: 40,
  },
  welcomeText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 18,
    fontWeight: '600',
    color: Colors.sage,
    textTransform: 'uppercase',
    letterSpacing: 2,
    marginBottom: -8, // pull logo slightly closer
  },
  logoImage: {
    width: 240,
    height: 100,
    marginBottom: 16,
  },
  subtitle: {
    fontFamily: 'Sora_400Regular',
    fontSize: 16,
    color: Colors.steel,
    textAlign: 'center',
    lineHeight: 24,
    paddingHorizontal: 12,
  },
  bottomSection: {
    gap: 16,
    paddingBottom: 24,
  },
  btn: {
    width: '100%',
  },
});
