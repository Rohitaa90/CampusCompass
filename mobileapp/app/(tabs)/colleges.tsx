// app/(tabs)/colleges.tsx
// GET /api/colleges — with stream/location/budget filters
// POST /api/bookmarks — add bookmark
// DELETE /api/bookmarks/:id — remove bookmark

import React, { useState, useEffect, useCallback } from 'react';
import {
  View, Text, FlatList, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, RefreshControl
} from 'react-native';
import { apiGetColleges, apiAddBookmark, apiRemoveBookmark, apiGetBookmarks, type College } from '@/lib/api';
import { Colors } from '@/lib/colors';
import CollegeCard from '@/components/CollegeCard';

const STREAMS = ['All', 'Engineering', 'Medical', 'Commerce', 'Arts', 'Science', 'Law'];

export default function CollegesScreen() {
  const [colleges, setColleges] = useState<College[]>([]);
  const [bookmarksMap, setBookmarksMap] = useState<Record<string, string>>({}); // collegeId -> bookmarkId
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [selectedStream, setSelectedStream] = useState('All');
  const [location, setLocation] = useState('');
  const [maxBudget, setMaxBudget] = useState('');
  
  // Pagination state
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);

  async function loadData(showSpinner = true, fetchPage = 1) {
    if (showSpinner && fetchPage === 1) setLoading(true);
    if (fetchPage > 1) setLoadingMore(true);
    try {
      const filters = {
        stream: selectedStream === 'All' ? undefined : selectedStream,
        location: location.trim() || undefined,
        maxBudget: maxBudget ? Number(maxBudget) : undefined,
        page: fetchPage,
      };
      
      const [collegesRes, bookmarks] = await Promise.all([
        apiGetColleges(filters),
        fetchPage === 1 ? apiGetBookmarks() : Promise.resolve([]),
      ]);
      
      const newColleges = collegesRes.colleges || [];
      
      if (fetchPage === 1) {
        setColleges(newColleges);
        setHasMore(newColleges.length >= 10); // Assuming limit is 10
      } else {
        setColleges(prev => {
          const existingIds = new Set(prev.map(c => c._id));
          const uniqueNew = newColleges.filter(c => !existingIds.has(c._id));
          return [...prev, ...uniqueNew];
        });
        if (newColleges.length === 0) setHasMore(false);
      }
      
      if (fetchPage === 1 && bookmarks.length > 0) {
        const newMap: Record<string, string> = {};
        bookmarks.forEach((b: any) => { newMap[b.college._id] = b._id; });
        setBookmarksMap(newMap);
      }
    } catch (err) {
      console.error('Failed to load colleges:', err);
    } finally {
      setLoading(false);
      setLoadingMore(false);
      setRefreshing(false);
    }
  }

  useEffect(() => { 
    setPage(1);
    setHasMore(true);
    loadData(true, 1); 
  }, [selectedStream]);

  const onRefresh = useCallback(() => {
    setRefreshing(true);
    setPage(1);
    setHasMore(true);
    loadData(false, 1);
  }, [selectedStream, location, maxBudget]);

  const handleLoadMore = () => {
    if (!loading && !loadingMore && hasMore) {
      const nextPage = page + 1;
      setPage(nextPage);
      loadData(false, nextPage);
    }
  };

  async function toggleBookmark(college: College) {
    const cid = college._id;
    const bid = bookmarksMap[cid];
    const wasBookmarked = !!bid;

    // Optimistic UI
    setBookmarksMap(prev => {
      const next = { ...prev };
      if (wasBookmarked) delete next[cid];
      else next[cid] = 'temp';
      return next;
    });

    try {
      if (wasBookmarked) {
        await apiRemoveBookmark(bid);
      } else {
        const newBookmark = await apiAddBookmark(cid);
        setBookmarksMap(prev => ({ ...prev, [cid]: newBookmark._id }));
      }
    } catch {
      // Revert on error
      loadData(false);
    }
  }

  return (
    <View style={styles.screen}>
      {/* Filter Bar */}
      <View style={styles.filterBar}>
        <FlatList
          horizontal
          showsHorizontalScrollIndicator={false}
          data={STREAMS}
          keyExtractor={s => s}
          contentContainerStyle={styles.streamPills}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => setSelectedStream(item)}
              style={[styles.pill, selectedStream === item && styles.pillActive]}
            >
              <Text style={[styles.pillText, selectedStream === item && styles.pillTextActive]}>
                {item}
              </Text>
            </TouchableOpacity>
          )}
        />
        <View style={styles.textFilters}>
          <TextInput
            style={styles.filterInput}
            placeholder="Location (e.g. Delhi)"
            placeholderTextColor={Colors.steel}
            value={location}
            onChangeText={setLocation}
            onSubmitEditing={() => { setPage(1); loadData(true, 1); }}
            returnKeyType="search"
          />
          <TextInput
            style={styles.filterInput}
            placeholder="Max budget (₹)"
            placeholderTextColor={Colors.steel}
            value={maxBudget}
            onChangeText={setMaxBudget}
            keyboardType="numeric"
            onSubmitEditing={() => { setPage(1); loadData(true, 1); }}
            returnKeyType="search"
          />
        </View>
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator color={Colors.sage} size="large" />
        </View>
      ) : (
        <FlatList
          data={colleges}
          keyExtractor={item => item._id}
          contentContainerStyle={styles.list}
          refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} tintColor={Colors.sage} />}
          ListEmptyComponent={
            <View style={styles.center}>
              <Text style={styles.emptyText}>No colleges found. Try different filters.</Text>
            </View>
          }
          renderItem={({ item }) => (
            <CollegeCard
              college={item}
              isBookmarked={!!bookmarksMap[item._id]}
              onBookmarkToggle={() => toggleBookmark(item)}
            />
          )}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          ListFooterComponent={
            loadingMore ? (
              <View style={styles.footerLoader}>
                <ActivityIndicator color={Colors.sage} size="small" />
              </View>
            ) : null
          }
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: Colors.parchment },
  filterBar: {
    backgroundColor: Colors.white,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    paddingBottom: 12,
  },
  streamPills: { paddingHorizontal: 16, paddingTop: 12, gap: 8 },
  pill: {
    borderRadius: 20,
    paddingHorizontal: 14,
    paddingVertical: 6,
    backgroundColor: Colors.parchment,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  pillActive: { backgroundColor: Colors.sage, borderColor: Colors.sage },
  pillText: { fontSize: 13, color: Colors.midnight, fontWeight: '500' },
  pillTextActive: { color: Colors.white, fontWeight: '600' },
  textFilters: { flexDirection: 'row', paddingHorizontal: 16, paddingTop: 10, gap: 8 },
  filterInput: {
    flex: 1,
    backgroundColor: Colors.parchment,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 8,
    fontSize: 13,
    color: Colors.midnight,
  },
  list: { padding: 16 },
  center: { flex: 1, justifyContent: 'center', alignItems: 'center', paddingTop: 80 },
  emptyText: { fontFamily: 'Sora_400Regular', color: Colors.steel, fontSize: 15, textAlign: 'center' },
  footerLoader: { paddingVertical: 20, alignItems: 'center' },
});
