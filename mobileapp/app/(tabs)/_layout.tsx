// app/(tabs)/_layout.tsx
// Bottom tab navigator — Colleges, AI Chat, Dashboard

import { Tabs, useRouter } from 'expo-router';
import { Colors } from '@/lib/colors';
import { Feather } from '@expo/vector-icons';
import { TouchableOpacity, Platform, Text } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function TabLayout() {
  const router = useRouter();
  
  async function handleLogout() {
    if (Platform.OS === 'web') {
      localStorage.removeItem('cc_token');
    } else {
      await AsyncStorage.removeItem('cc_token');
    }
    router.replace('/welcome');
  }

  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.sage,
        tabBarInactiveTintColor: Colors.steel,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopColor: Colors.border,
          borderTopWidth: 1,
          paddingTop: 6,
          height: 64,
        },
        tabBarLabelStyle: {
          fontSize: 12,
          fontWeight: '600',
          marginBottom: 6,
        },
        headerStyle: { backgroundColor: Colors.parchment },
        headerTitleStyle: { fontWeight: '700', color: Colors.midnight },
        headerShadowVisible: false,
      }}
    >
      <Tabs.Screen
        name="colleges"
        options={{
          title: 'Colleges',
          tabBarIcon: ({ color }) => <Feather name="book-open" size={22} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16, padding: 8 }}>
              <Feather name="log-out" size={20} color={Colors.errorRed} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="chat"
        options={{
          title: 'AI Counselor',
          tabBarIcon: ({ color }) => <Feather name="message-circle" size={22} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16, padding: 8 }}>
              <Feather name="log-out" size={20} color={Colors.errorRed} />
            </TouchableOpacity>
          ),
        }}
      />
      <Tabs.Screen
        name="dashboard"
        options={{
          title: 'Dashboard',
          tabBarIcon: ({ color }) => <Feather name="user" size={22} color={color} />,
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 16, padding: 8 }}>
              <Feather name="log-out" size={20} color={Colors.errorRed} />
            </TouchableOpacity>
          ),
        }}
      />
    </Tabs>
  );
}
