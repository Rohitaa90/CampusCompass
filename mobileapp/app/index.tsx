import { useEffect, useState } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { Redirect } from 'expo-router';
import { isAuthenticated } from '@/lib/auth';
import { Colors } from '@/lib/colors';

export default function Index() {
  const [authed, setAuthed] = useState<boolean | null>(null);

  useEffect(() => {
    isAuthenticated().then(setAuthed);
  }, []);

  if (authed === null) {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.parchment, justifyContent: 'center' }}>
        <ActivityIndicator color={Colors.sage} size="large" />
      </View>
    );
  }

  return authed ? <Redirect href="/(tabs)/colleges" /> : <Redirect href="/welcome" />;
}
