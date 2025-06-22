import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Search, Filter } from 'lucide-react-native';
import { mockPosts } from '@/data/mockData';

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3;

export default function Explore() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);

  const moods = [
    { id: 'all', label: 'All', emoji: '🌟' },
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'excited', label: 'Excited', emoji: '🤩' },
    { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🌟' },
  ];

  const filteredPosts = mockPosts.filter(post => {
    const matchesSearch = post.caption.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         post.tags?.some(tag => tag.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesMood = !selectedMood || selectedMood === 'all' || post.mood === selectedMood;
    return matchesSearch && matchesMood;
  });

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity style={[styles.postItem, { marginRight: index % 3 === 2 ? 0 : 3 }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <Text style={styles.postStatText}>{item.likes}</Text>
          <Text style={styles.postStatText}>{item.comments}</Text>
        </View>
        {item.mood && (
          <Text style={styles.moodEmoji}>
            {item.mood === 'happy' ? '😊' : 
             item.mood === 'excited' ? '🤩' : 
             item.mood === 'relaxed' ? '😌' : 
             item.mood === 'adventurous' ? '🌟' : ''}
          </Text>
        )}
      </View>
    </TouchableOpacity>
  );

  const renderMoodFilter = ({ item }: { item: any }) => (
    <TouchableOpacity
      style={[
        styles.moodFilter,
        selectedMood === item.id && styles.selectedMoodFilter
      ]}
      onPress={() => setSelectedMood(item.id)}
    >
      <Text style={styles.moodEmoji}>{item.emoji}</Text>
      <Text style={[
        styles.moodLabel,
        selectedMood === item.id && styles.selectedMoodLabel
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Explore</Text>
        <TouchableOpacity>
          <Filter size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search posts, tags, or users..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      <View style={styles.moodFiltersContainer}>
        <FlatList
          data={moods}
          renderItem={renderMoodFilter}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.moodFilters}
        />
      </View>

      <FlatList
        data={filteredPosts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  title: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  searchContainer: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    marginLeft: 12,
  },
  moodFiltersContainer: {
    paddingVertical: 8,
  },
  moodFilters: {
    paddingHorizontal: 16,
  },
  moodFilter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
  },
  selectedMoodFilter: {
    backgroundColor: '#833AB4',
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  selectedMoodLabel: {
    color: '#fff',
  },
  grid: {
    padding: 16,
  },
  postItem: {
    width: imageSize,
    height: imageSize,
    marginBottom: 3,
    position: 'relative',
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
  postOverlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.3)',
    justifyContent: 'space-between',
    padding: 8,
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  postStatText: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});