import React, { useState, useRef } from 'react';
import { View, StyleSheet, FlatList, Dimensions, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Header } from '@/components/Header';
import { StoriesList } from '@/components/StoriesList';
import { PostCard } from '@/components/PostCard';
import { mockPosts } from '@/data/mockData';

const { height } = Dimensions.get('window');

export default function Home() {
  const [posts, setPosts] = useState(mockPosts);
  const [refreshing, setRefreshing] = useState(false);
  const flatListRef = useRef<FlatList>(null);

  const handleRefresh = async () => {
    setRefreshing(true);
    // Simulate API call
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  const handleLike = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? {
              ...post,
              liked: !post.liked,
              likes: post.liked ? post.likes - 1 : post.likes + 1,
            }
          : post
      )
    );
  };

  const handleSave = (postId: string) => {
    setPosts(prevPosts =>
      prevPosts.map(post =>
        post.id === postId
          ? { ...post, saved: !post.saved }
          : post
      )
    );
  };

  const renderPost = ({ item }: { item: typeof mockPosts[0] }) => (
    <PostCard
      post={item}
      onLike={handleLike}
      onSave={handleSave}
    />
  );

  const renderHeader = () => (
    <View>
      <Header />
      <StoriesList />
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        ref={flatListRef}
        data={posts}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        ListHeaderComponent={renderHeader}
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={handleRefresh}
            tintColor="#833AB4"
          />
        }
        style={styles.list}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  list: {
    flex: 1,
  },
});