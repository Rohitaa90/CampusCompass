// app/(tabs)/dashboard.tsx
// GET /api/profile — profile summary + completion
// GET /api/bookmarks — saved colleges
// DELETE /api/bookmarks/:id — remove bookmark
// expo-image-picker → POST /api/upload/presign → PUT S3 → PATCH /api/profile/file

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, RefreshControl
} from 'react-native';
import { useRouter } from 'expo-router';
import * as ImagePicker from 'expo-image-picker';
import { Image } from 'expo-image';
import { Feather } from '@expo/vector-icons';
import {
  apiGetProfile, apiGetBookmarks, apiRemoveBookmark,
  apiGetPresignedUrl, uploadToS3, apiUpdateProfileFile,
  type Profile, type Bookmark
} from '@/lib/api';
import { clearAuth } from '@/lib/auth';
import { Colors } from '@/lib/colors';
import Button from '@/components/Button';

export default function DashboardScreen() {
  const router = useRouter();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [uploading, setUploading] = useState<'photo' | 'document' | null>(null);

  async function loadData(spinner = true) {
    if (spinner) setLoading(true);
    try {
      const [profileData, bookmarkData] = await Promise.all([
        apiGetProfile(),
        apiGetBookmarks(),
      ]);
      const p = profileData?.profile;
      if (p && p.photoUrl) {
        // Append timestamp to bypass caching (so it updates immediately after upload)
        p.photoUrl = `${p.photoUrl}&t=${Date.now()}`;
      }
      setProfile(p ?? null);
      setBookmarks(Array.isArray(bookmarkData) ? bookmarkData : []);
    } catch (err) {
      console.error('Dashboard load error:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { loadData(); }, []);

  const onRefresh = useCallback(() => { setRefreshing(true); loadData(false); }, []);

  // Completion percentage: 70% base + 15% photo + 15% document
  const completion = profile
    ? 70 + (profile.photoUrl ? 15 : 0) + (profile.documentUrl ? 15 : 0)
    : 0;

  async function handleUpload(type: 'photo' | 'document') {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== 'granted') {
      Alert.alert('Permission needed', 'Please allow photo library access in Settings.');
      return;
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      quality: 0.8,
      allowsEditing: type === 'photo',
      aspect: type === 'photo' ? [1, 1] : undefined,
    });

    if (result.canceled || !result.assets[0]) return;

    const asset = result.assets[0];
    const filename = asset.fileName ?? `upload_${Date.now()}.jpg`;
    const filetype = asset.mimeType ?? 'image/jpeg';

    setUploading(type);
    try {
      // 1. Get presigned PUT URL from backend
      const { uploadUrl, fileKey } = await apiGetPresignedUrl(filename, filetype);

      // 2. Upload directly to S3 using the local file URI
      // React Native Note: Instead of a File/Blob (web), we pass the local URI.
      // React Native's fetch resolves file:// URIs natively.
      await uploadToS3(uploadUrl, asset.uri, filetype);

      // 3. Save the fileKey to the user's profile in our backend
      await apiUpdateProfileFile(fileKey, type);

      // 4. Refresh dashboard data
      await loadData(false);
      Alert.alert('Success', `${type === 'photo' ? 'Photo' : 'Document'} uploaded!`);
    } catch (err: unknown) {
      Alert.alert('Upload failed', err instanceof Error ? err.message : 'Something went wrong');
    } finally {
      setUploading(null);
    }
  }

  async function handleRemoveBookmark(bookmarkId: string) {
    setBookmarks(prev => prev.filter(b => b._id !== bookmarkId));
    try {
      await apiRemoveBookmark(bookmarkId);
    } catch {
      // Reload on error to restore state
      loadData(false);
    }
  }

  async function handleLogout() {
    await clearAuth();
    router.replace('/welcome');
  }

  if (loading) {
    return (
      <View style={styles.loading}>
        <ActivityIndicator color={Colors.sage} size="large" />
      </View>
    );
  }

  return (
    <ScrollView
      style={styles.screen}
      contentContainerStyle={styles.container}
      refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.sage} />}
    >
      {/* Profile Card */}
      <View style={styles.card}>
        <View style={styles.profileRow}>
          <TouchableOpacity onPress={() => handleUpload('photo')} disabled={!!uploading}>
            <View style={styles.avatarWrap}>
              {profile?.photoUrl ? (
                <Image source={{ uri: profile.photoUrl }} style={styles.avatar} contentFit="cover" />
              ) : (
                <View style={[styles.avatar, styles.avatarPlaceholder]}>
                  <Text style={styles.avatarPlaceholderText}>?</Text>
                </View>
              )}
              <View style={styles.avatarEdit}>
                {uploading === 'photo' ? (
                  <ActivityIndicator color={Colors.white} size="small" />
                ) : (
                  <Feather name="camera" size={12} color={Colors.white} />
                )}
              </View>
            </View>
          </TouchableOpacity>
          <View style={styles.profileInfo}>
            <Text style={styles.profileName}>My Profile</Text>
            {profile?.preferredStream && <Text style={styles.profileDetail}>{profile.preferredStream}</Text>}
            {profile?.locationPreference && (
              <View style={styles.profileRowItem}>
                <Feather name="map-pin" size={12} color={Colors.steel} />
                <Text style={styles.profileDetail}>{profile.locationPreference}</Text>
              </View>
            )}
            {profile?.budget && (
              <View style={styles.profileRowItem}>
                <Feather name="credit-card" size={12} color={Colors.steel} />
                <Text style={styles.profileDetail}>₹{profile.budget.toLocaleString('en-IN')}/yr budget</Text>
              </View>
            )}
            
            <TouchableOpacity onPress={() => router.push('/(modals)/edit-profile')}>
              <Text style={styles.editProfileBtn}>Edit profile details</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Completion bar */}
        <View style={styles.completionSection}>
          <View style={styles.completionHeader}>
            <Text style={styles.completionLabel}>Profile completion</Text>
            <Text style={styles.completionPct}>{completion}%</Text>
          </View>
          <View style={styles.completionTrack}>
            <View style={[styles.completionFill, { width: `${completion}%` as any }]} />
          </View>

          {completion < 100 && (
            <View style={styles.uploadBtns}>
              {!profile?.photoUrl && (
                <TouchableOpacity
                  onPress={() => handleUpload('photo')}
                  disabled={!!uploading}
                  style={styles.uploadBtn}
                >
                  {uploading === 'photo' ? (
                    <ActivityIndicator color={Colors.sage} size="small" />
                  ) : (
                    <Text style={styles.uploadBtnText}>+ Add photo (+15%)</Text>
                  )}
                </TouchableOpacity>
              )}
              {!profile?.documentUrl && (
                <TouchableOpacity
                  onPress={() => handleUpload('document')}
                  disabled={!!uploading}
                  style={styles.uploadBtn}
                >
                  {uploading === 'document' ? (
                    <ActivityIndicator color={Colors.sage} size="small" />
                  ) : (
                    <Text style={styles.uploadBtnText}>+ Add document (+15%)</Text>
                  )}
                </TouchableOpacity>
              )}
            </View>
          )}
        </View>
      </View>

      {/* Saved Colleges */}
      <Text style={styles.sectionTitle}>Saved Colleges ({bookmarks.length})</Text>

      {bookmarks.length === 0 ? (
        <View style={styles.emptyCard}>
          <Feather name="bookmark" size={32} color={Colors.border} />
          <Text style={styles.emptyText}>No saved colleges yet.</Text>
          <Text style={styles.emptySubtext}>Browse colleges and tap the bookmark icon to save them here.</Text>
        </View>
      ) : (
        bookmarks.map(b => (
          <View key={b._id} style={styles.bookmarkCard}>
            <View style={styles.bookmarkInfo}>
              <Text style={styles.bookmarkName} numberOfLines={2}>{b.college.name}</Text>
              <Text style={styles.bookmarkMeta}>
                {b.college.stream} · {b.college.location} · ₹{b.college.annualFees?.toLocaleString('en-IN')}/yr
              </Text>
            </View>
            <TouchableOpacity onPress={() => handleRemoveBookmark(b._id)} hitSlop={8}>
              <Feather name="x" size={20} color={Colors.steel} />
            </TouchableOpacity>
          </View>
        ))
      )}

      {/* Logout */}
      <Button title="Log out" onPress={handleLogout} variant="ghost" style={styles.logoutBtn} />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loading: { flex: 1, backgroundColor: Colors.parchment, justifyContent: 'center', alignItems: 'center' },
  screen: { flex: 1, backgroundColor: Colors.parchment },
  container: { padding: 16, gap: 14, paddingBottom: 40 },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
    gap: 16,
  },
  profileRow: { flexDirection: 'row', gap: 14, alignItems: 'flex-start' },
  avatarWrap: { position: 'relative' },
  avatar: { width: 70, height: 70, borderRadius: 35 },
  avatarPlaceholder: {
    backgroundColor: Colors.parchment,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.border,
    borderStyle: 'dashed',
  },
  avatarPlaceholderText: { fontSize: 24, color: Colors.steel, fontWeight: '600' },
  avatarEdit: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: Colors.sage,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.white,
  },
  profileInfo: { flex: 1, gap: 4, paddingVertical: 4 },
  profileName: { fontSize: 18, fontWeight: '700', color: Colors.midnight },
  profileRowItem: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  profileDetail: { fontFamily: 'Sora_400Regular', fontSize: 13, color: Colors.steel },
  editProfileBtn: { fontFamily: 'Sora_600SemiBold', fontSize: 13, color: Colors.sage, marginTop: 12 },
  completionSection: { gap: 8 },
  completionHeader: { flexDirection: 'row', justifyContent: 'space-between' },
  completionLabel: { fontSize: 13, color: Colors.steel, fontWeight: '500' },
  completionPct: { fontSize: 13, fontWeight: '700', color: Colors.sage },
  completionTrack: {
    height: 6,
    backgroundColor: Colors.parchment,
    borderRadius: 3,
    overflow: 'hidden',
  },
  completionFill: { height: '100%', backgroundColor: Colors.sage, borderRadius: 3 },
  uploadBtns: { flexDirection: 'row', gap: 8, flexWrap: 'wrap' },
  uploadBtn: {
    borderWidth: 1,
    borderColor: Colors.sage,
    borderStyle: 'dashed',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 7,
  },
  uploadBtnText: { color: Colors.sage, fontSize: 13, fontWeight: '600' },
  sectionTitle: { fontSize: 17, fontWeight: '700', color: Colors.midnight },
  emptyCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 24,
    alignItems: 'center',
    gap: 4,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  emptyText: { color: Colors.midnight, fontSize: 15, fontWeight: '600' },
  emptySubtext: { color: Colors.steel, fontSize: 13, textAlign: 'center' },
  bookmarkCard: {
    backgroundColor: Colors.white,
    borderRadius: 14,
    padding: 14,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  bookmarkInfo: { flex: 1, gap: 3 },
  bookmarkName: { fontSize: 15, fontWeight: '600', color: Colors.midnight },
  bookmarkMeta: { fontSize: 12, color: Colors.steel },
  removeBtn: { color: Colors.steel, fontSize: 18, padding: 4 },
  logoutBtn: { marginTop: 8 },
});
