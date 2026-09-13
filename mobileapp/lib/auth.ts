// lib/auth.ts
// AsyncStorage-based JWT helpers.
// React Native does NOT have localStorage — AsyncStorage is the equivalent.
// All methods are async because AsyncStorage operations are always async.

import AsyncStorage from '@react-native-async-storage/async-storage';

const TOKEN_KEY = 'cc_token';
const USER_KEY = 'cc_user';

export const saveToken = async (token: string) => {
  await AsyncStorage.setItem(TOKEN_KEY, token);
};

export const getToken = async (): Promise<string | null> => {
  return AsyncStorage.getItem(TOKEN_KEY);
};

export const saveUser = async (user: object) => {
  await AsyncStorage.setItem(USER_KEY, JSON.stringify(user));
};

export const getUser = async (): Promise<Record<string, unknown> | null> => {
  const raw = await AsyncStorage.getItem(USER_KEY);
  return raw ? JSON.parse(raw) : null;
};

export const clearAuth = async () => {
  await AsyncStorage.multiRemove([TOKEN_KEY, USER_KEY]);
};

export const isAuthenticated = async (): Promise<boolean> => {
  const token = await getToken();
  return !!token;
};
