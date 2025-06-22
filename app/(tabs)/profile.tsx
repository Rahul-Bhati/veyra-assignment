import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Settings, Grid2x2 as Grid, Bookmark, User, MoveHorizontal as MoreHorizontal } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { mockPosts } from '@/data/mockData';

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3;

export default function Profile() {
  const { user, logout } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'saved'>('posts');

  const userPosts = mockPosts.filter(post => post.userId === user?.id);
  const savedPosts = mockPosts.filter(post => post.saved);

  const handleLogout = () => {
    logout();
  };

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity style={[styles.postItem, { marginRight: index % 3 === 2 ? 0 : 3 }]}>
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    const data = selectedTab === 'posts' ? userPosts : savedPosts;
    
    return (
      <FlatList
        data={data}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{user?.username}</Text>
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Settings size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton} onPress={handleLogout}>
            <MoreHorizontal size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.profileInfo}>
        <View style={styles.profileHeader}>
          <Image source={{ uri: user?.avatar }} style={styles.avatar} />
          
          <View style={styles.stats}>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user?.posts}</Text>
              <Text style={styles.statLabel}>posts</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user?.followers?.toLocaleString()}</Text>
              <Text style={styles.statLabel}>followers</Text>
            </View>
            <View style={styles.stat}>
              <Text style={styles.statNumber}>{user?.following}</Text>
              <Text style={styles.statLabel}>following</Text>
            </View>
          </View>
        </View>

        <View style={styles.profileDetails}>
          <Text style={styles.fullName}>{user?.fullName}</Text>
          {user?.bio && <Text style={styles.bio}>{user.bio}</Text>}
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.editButton}>
            <Text style={styles.editButtonText}>Edit Profile</Text>
          </TouchableOpacity>
          <TouchableOpacity style={styles.shareButton}>
            <Text style={styles.shareButtonText}>Share Profile</Text>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.tabContainer}>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
          onPress={() => setSelectedTab('posts')}
        >
          <Grid size={24} color={selectedTab === 'posts' ? '#000' : '#666'} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.tab, selectedTab === 'saved' && styles.activeTab]}
          onPress={() => setSelectedTab('saved')}
        >
          <Bookmark size={24} color={selectedTab === 'saved' ? '#000' : '#666'} />
        </TouchableOpacity>
      </View>

      {renderTabContent()}
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
  username: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
  },
  profileInfo: {
    padding: 16,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    marginRight: 20,
  },
  stats: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  stat: {
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  profileDetails: {
    marginBottom: 16,
  },
  fullName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 4,
  },
  bio: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 8,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  editButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  shareButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  tabContainer: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  activeTab: {
    borderBottomColor: '#000',
  },
  grid: {
    padding: 16,
  },
  postItem: {
    width: imageSize,
    height: imageSize,
    marginBottom: 3,
  },
  postImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f0f0f0',
  },
});