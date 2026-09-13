// components/CollegeCard.tsx
import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Feather } from '@expo/vector-icons';
import { Colors } from '@/lib/colors';
import type { College } from '@/lib/api';

interface CollegeCardProps {
  college: College;
  isBookmarked: boolean;
  onBookmarkToggle: () => void;
}

export default function CollegeCard({ college, isBookmarked, onBookmarkToggle }: CollegeCardProps) {
  const formattedFees = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(college.fees);

  return (
    <View style={styles.cardRow}>
      <View style={styles.mainContent}>
        <Text style={styles.name} numberOfLines={1}>{college.name}</Text>
        
        <View style={styles.subTitleRow}>
          <Text style={styles.streamText}>{college.stream}</Text>
          <Text style={styles.separator}>•</Text>
          <Feather name="map-pin" size={12} color={Colors.steel} />
          <Text style={styles.metaTextSmall} numberOfLines={1}>{college.location}</Text>
        </View>

        <View style={styles.bottomRow}>
          <Text style={styles.priceText}>{formattedFees}/yr</Text>
          <View style={styles.ratingBadge}>
            <Feather name="star" size={12} color={Colors.amber} />
            <Text style={styles.ratingText}>{college.rating?.toFixed(1) ?? 'N/A'}</Text>
          </View>
        </View>
      </View>

      <TouchableOpacity onPress={onBookmarkToggle} style={styles.bookmarkBtnCompact} hitSlop={12}>
        <Feather 
          name="bookmark" 
          size={20} 
          color={isBookmarked ? Colors.amber : Colors.steel} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  cardRow: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 14,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: 'rgba(0,0,0,0.06)',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    // Minimal shadow
    shadowColor: Colors.midnight,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.03,
    shadowRadius: 8,
    elevation: 1,
  },
  mainContent: {
    flex: 1,
    paddingRight: 12,
  },
  name: {
    fontFamily: 'Sora_700Bold',
    fontSize: 16,
    color: Colors.midnight,
    marginBottom: 4,
  },
  subTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  streamText: {
    fontFamily: 'Sora_600SemiBold',
    color: Colors.sage,
    fontSize: 12,
  },
  separator: {
    color: Colors.border,
    marginHorizontal: 6,
    fontSize: 10,
  },
  metaTextSmall: {
    fontFamily: 'Sora_400Regular',
    fontSize: 12,
    color: Colors.steel,
    marginLeft: 4,
    flex: 1,
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  priceText: {
    fontFamily: 'Sora_600SemiBold',
    fontSize: 13,
    color: Colors.midnight,
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: `${Colors.amber}15`,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
    gap: 4,
  },
  ratingText: {
    fontFamily: 'Sora_700Bold',
    fontSize: 11,
    color: Colors.amber,
  },
  bookmarkBtnCompact: {
    padding: 8,
    backgroundColor: Colors.parchment,
    borderRadius: 20,
  },
});
