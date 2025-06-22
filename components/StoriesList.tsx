import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, FlatList, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Plus } from 'lucide-react-native';
import { mockStories, mockUsers } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

export function StoriesList() {
  const { user } = useAuth();

  const storiesWithUser = [
    {
      id: 'your-story',
      userId: user?.id || '1',
      imageUrl: user?.avatar || '',
      timestamp: new Date().toISOString(),
      viewed: false,
      type: 'add' as const,
    },
    ...mockStories,
  ];

  const renderStory = ({ item, index }: { item: any; index: number }) => {
    const storyUser = mockUsers.find(u => u.id === item.userId);
    const isAddStory = item.type === 'add';

    return (
      <TouchableOpacity style={styles.storyContainer}>
        <View style={styles.storyImageContainer}>
          {!isAddStory && !item.viewed && (
            <LinearGradient
              colors={['#833AB4', '#FD1D1D', '#FCB045']}
              style={styles.storyBorder}
            >
              <View style={styles.storyBorderInner}>
                <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
              </View>
            </LinearGradient>
          )}
          
          {!isAddStory && item.viewed && (
            <View style={styles.viewedStoryBorder}>
              <Image source={{ uri: item.imageUrl }} style={styles.storyImage} />
            </View>
          )}

          {isAddStory && (
            <View style={styles.addStoryContainer}>
              <Image source={{ uri: user?.avatar }} style={styles.storyImage} />
              <View style={styles.addIcon}>
                <Plus size={16} color="#fff" strokeWidth={3} />
              </View>
            </View>
          )}
        </View>
        
        <Text style={styles.storyUsername} numberOfLines={1}>
          {isAddStory ? 'Your Story' : storyUser?.username}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={storiesWithUser}
        renderItem={renderStory}
        keyExtractor={(item) => item.id}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.storiesContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  storiesContainer: {
    paddingHorizontal: 16,
  },
  storyContainer: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  storyImageContainer: {
    position: 'relative',
  },
  storyBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyBorderInner: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  viewedStoryBorder: {
    width: 66,
    height: 66,
    borderRadius: 33,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
  },
  storyImage: {
    width: 54,
    height: 54,
    borderRadius: 27,
  },
  addStoryContainer: {
    position: 'relative',
  },
  addIcon: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#0095f6',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: '#fff',
  },
  storyUsername: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000',
    marginTop: 4,
    textAlign: 'center',
  },
});