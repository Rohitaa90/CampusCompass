// lib/api.ts
// All API calls for the CampusCompass mobile app.
// Mirrors the pattern from webapp/lib/api.ts but uses AsyncStorage for JWT.

import { Platform } from 'react-native';
import { getToken } from './auth';

const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:5000/api';

// ─── Generic authenticated fetch ──────────────────────────────────────────────

async function authFetch(path: string, options: RequestInit = {}): Promise<Response> {
  const token = await getToken();
  return fetch(`${BASE_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options.headers ?? {}),
    },
  });
}

async function handleResponse<T>(res: Response): Promise<T> {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message ?? 'Request failed');
  return data as T;
}

// ─── Auth ─────────────────────────────────────────────────────────────────────

export interface AuthResponse {
  token: string;
  user: { _id: string; name: string; email: string };
}

export async function apiLogin(email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

export async function apiSignup(name: string, email: string, password: string): Promise<AuthResponse> {
  const res = await fetch(`${BASE_URL}/auth/signup`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name, email, password }),
  });
  return handleResponse<AuthResponse>(res);
}

// ─── Profile ──────────────────────────────────────────────────────────────────

export interface Profile {
  interests: string[];
  preferredStream: string;
  budget: number;
  locationPreference: string;
  photoUrl?: string;
  documentUrl?: string;
}

export async function apiGetProfile(): Promise<{ profile: Profile } | null> {
  const res = await authFetch('/profile');
  if (res.status === 404) return null;
  return handleResponse<{ profile: Profile }>(res);
}

export async function apiSaveProfile(data: Partial<Profile>): Promise<{ profile: Profile }> {
  const res = await authFetch('/profile', {
    method: 'POST',
    body: JSON.stringify(data),
  });
  return handleResponse<{ profile: Profile }>(res);
}

export async function apiUpdateProfileFile(fileKey: string, type: 'photo' | 'document'): Promise<void> {
  const res = await authFetch('/profile/file', {
    method: 'PATCH',
    body: JSON.stringify({ fileKey, type }),
  });
  if (!res.ok) throw new Error('Failed to update profile file');
}

// ─── Colleges ─────────────────────────────────────────────────────────────────

export interface College {
  _id: string;
  name: string;
  stream: string;
  location: string;
  fees: number;
  rating: number;
  description?: string;
}

export interface CollegesFilters {
  stream?: string;
  location?: string;
  maxBudget?: number;
  page?: number;
}

export async function apiGetColleges(filters: CollegesFilters = {}): Promise<{ count: number; colleges: College[] }> {
  const params = new URLSearchParams();
  if (filters.stream) params.set('stream', filters.stream);
  if (filters.location) params.set('location', filters.location);
  if (filters.maxBudget) params.set('maxBudget', String(filters.maxBudget));
  if (filters.page) params.set('page', String(filters.page));
  const query = params.toString() ? `?${params.toString()}` : '';
  const res = await authFetch(`/colleges${query}`);
  const data = await handleResponse<{ count: number; colleges: College[] }>(res);
  return data;
}

// ─── Bookmarks ────────────────────────────────────────────────────────────────

export interface Bookmark {
  _id: string;
  college: College;
}

export async function apiGetBookmarks(): Promise<Bookmark[]> {
  const res = await authFetch('/bookmarks');
  const data = await handleResponse<{ count: number; bookmarks: Bookmark[] }>(res);
  return data.bookmarks;
}

export async function apiAddBookmark(collegeId: string): Promise<Bookmark> {
  const res = await authFetch('/bookmarks', {
    method: 'POST',
    body: JSON.stringify({ collegeId }),
  });
  const data = await handleResponse<{ bookmark: Bookmark }>(res);
  return data.bookmark;
}

export async function apiRemoveBookmark(collegeId: string): Promise<void> {
  const res = await authFetch(`/bookmarks/${collegeId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Failed to remove bookmark');
}

// ─── AI Counselor ─────────────────────────────────────────────────────────────

export async function apiAskAI(question: string): Promise<{ answer: string }> {
  const res = await authFetch('/ai/ask', {
    method: 'POST',
    body: JSON.stringify({ question }),
  });
  return handleResponse<{ answer: string }>(res);
}

// ─── Upload ───────────────────────────────────────────────────────────────────

export async function apiGetPresignedUrl(
  filename: string,
  filetype: string
): Promise<{ uploadUrl: string; fileKey: string }> {
  const res = await authFetch('/upload/presign', {
    method: 'POST',
    body: JSON.stringify({ filename, filetype }),
  });
  return handleResponse<{ uploadUrl: string; fileKey: string }>(res);
}

/**
 * Upload a local file (from expo-image-picker) directly to an S3 presigned URL.
 *
 * React Native difference from Web:
 * - On Web, you pass a File/Blob object.
 * - In React Native, expo-image-picker gives you a local file URI (e.g. file:///...).
 * - React Native's fetch can handle local file URIs natively if you pass the uri
 *   as part of a FormData-like object, but for a raw PUT to S3, we pass the uri
 *   string directly as the body. React Native's networking layer resolves it.
 */
export async function uploadToS3(uploadUrl: string, localUri: string, filetype: string): Promise<void> {
  let body: BodyInit;
  
  if (Platform.OS === 'web') {
    // On web, convert the data URI or blob URL to an actual Blob before uploading
    const fetchRes = await fetch(localUri);
    body = await fetchRes.blob();
  } else {
    // On native, pass the URI object and React Native's networking handles it
    body = { uri: localUri, name: 'upload', type: filetype } as unknown as BodyInit;
  }

  const res = await fetch(uploadUrl, {
    method: 'PUT',
    headers: { 'Content-Type': filetype },
    body,
  });
  if (!res.ok) throw new Error(`S3 upload failed: ${res.status}`);
}
