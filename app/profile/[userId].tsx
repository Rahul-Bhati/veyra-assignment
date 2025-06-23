import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, FlatList, Dimensions, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Grid2x2 as Grid, Bookmark, User, MoveHorizontal as MoreHorizontal, MessageCircle, UserPlus, UserMinus, Settings, EllipsisVertical, ChevronLeft } from 'lucide-react-native';
import { mockUsers, mockPosts } from '@/data/mockData';
import { useAuth } from '@/contexts/AuthContext';

const { width } = Dimensions.get('window');
const imageSize = (width - 6) / 3;

export default function UserProfile() {
  const router = useRouter();
  const { userId } = useLocalSearchParams();
  const { user: currentUser } = useAuth();
  const [selectedTab, setSelectedTab] = useState<'posts' | 'tagged'>('posts');
  const [isFollowing, setIsFollowing] = useState(false);

  const user = mockUsers.find(u => u.id === userId);
  const isOwnProfile = currentUser?.id === userId;
  
  if (!user) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Profile</Text>
          <View style={{ width: 24 }} />
        </View>
        <View style={styles.notFoundContainer}>
          <User size={80} color="#ccc" />
          <Text style={styles.notFoundText}>User not found</Text>
          <TouchableOpacity style={styles.backButton} onPress={() => router.back()}>
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  const userPosts = mockPosts.filter(post => post.userId === userId);
  const taggedPosts = mockPosts.filter(post => 
    post.tags?.some(tag => tag.includes(user.username))
  );

  const handleFollowToggle = () => {
    setIsFollowing(!isFollowing);
  };

  const handleMessage = () => {
    // Navigate to chat with this user
    router.push(`/chat/chat-${userId}`);
  };

  const renderPost = ({ item, index }: { item: any; index: number }) => (
    <TouchableOpacity 
      style={[styles.postItem, { marginRight: index % 3 === 2 ? 0 : 3 }]}
      onPress={() => router.push(`/post/${item.id}`)}
    >
      <Image source={{ uri: item.imageUrl }} style={styles.postImage} />
      <View style={styles.postOverlay}>
        <View style={styles.postStats}>
          <Text style={styles.postStatText}>{item.likes}</Text>
          <Text style={styles.postStatText}>{item.comments}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderTabContent = () => {
    const data = selectedTab === 'posts' ? userPosts : taggedPosts;
    
    if (data.length === 0) {
      return (
        <View style={styles.emptyState}>
          <Grid size={60} color="#ccc" />
          <Text style={styles.emptyStateTitle}>
            {selectedTab === 'posts' ? 'No Posts Yet' : 'No Tagged Posts'}
          </Text>
          <Text style={styles.emptyStateText}>
            {selectedTab === 'posts' 
              ? `${isOwnProfile ? 'Share your first photo' : `${user.username} hasn't shared any photos yet`}`
              : `${isOwnProfile ? 'Photos of you will appear here' : `Photos of ${user.username} will appear here`}`
            }
          </Text>
        </View>
      );
    }

    return (
      <FlatList
        data={data}
        renderItem={renderPost}
        keyExtractor={(item) => item.id}
        numColumns={3}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.grid}
        scrollEnabled={false}
      />
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.header}>
          <View style={{display:"flex", flexDirection:"row", justifyContent:"center", alignItems:"center", gap:"10"}}>
            <TouchableOpacity onPress={() => router.back()}>
              <ChevronLeft size={20} color="#000" />
            </TouchableOpacity>
            
            <View style={styles.headerCenter}>
              <Text style={styles.username}>{user.username}</Text>
              {user.verified && <Text style={styles.verified}>✓</Text>}
            </View>
          </View>
          
          <TouchableOpacity>
            <EllipsisVertical size={24} color="#000" />
          </TouchableOpacity>
        </View>

        {/* Profile Info */}
        <View style={styles.profileSection}>
          <View style={styles.profileHeader}>
            <View style={styles.avatarContainer}>
              <Image source={{ uri: user.avatar }} style={styles.avatar} />
              {/* Online indicator for demonstration */}
              {user.id === '2' && <View style={styles.onlineIndicator} />}
            </View>
            
            <View style={styles.stats}>
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{userPosts.length}</Text>
                <Text style={styles.statLabel}>posts</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{user.followers?.toLocaleString()}</Text>
                <Text style={styles.statLabel}>followers</Text>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.stat}>
                <Text style={styles.statNumber}>{user.following}</Text>
                <Text style={styles.statLabel}>following</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Bio Section */}
          <View style={styles.bioSection}>
            <Text style={styles.fullName}>{user.fullName}</Text>
            {user.bio && (
              <Text style={styles.bio}>{user.bio}</Text>
            )}
          </View>

          {/* Action Buttons */}
          <View style={styles.actionButtons}>
            {isOwnProfile ? (
              <>
                <TouchableOpacity style={styles.editButton}>
                  <Text style={styles.editButtonText}>Edit Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.shareButton}>
                  <Text style={styles.shareButtonText}>Share Profile</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.iconButton}>
                  <Settings size={16} color="#000" />
                </TouchableOpacity>
              </>
            ) : (
              <>
                <TouchableOpacity 
                  style={[styles.followButton, isFollowing && styles.followingButton]}
                  onPress={handleFollowToggle}
                >
                  {isFollowing ? (
                    <UserMinus size={16} color="#000" />
                  ) : (
                    <UserPlus size={16} color="#fff" />
                  )}
                  <Text style={[styles.followButtonText, isFollowing && styles.followingButtonText]}>
                    {isFollowing ? 'Following' : 'Follow'}
                  </Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.messageButton} onPress={handleMessage}>
                  <MessageCircle size={16} color="#000" />
                  <Text style={styles.messageButtonText}>Message</Text>
                </TouchableOpacity>
                
                <TouchableOpacity style={styles.iconButton}>
                  <MoreHorizontal size={16} color="#000" />
                </TouchableOpacity>
              </>
            )}
          </View>

          {/* Highlights/Stories Section */}
          <View style={styles.highlightsSection}>
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              <View style={styles.highlights}>
                {/* Mock highlights */}
                {['Travel', 'Food', 'Work', 'Friends'].map((highlight, index) => (
                  <TouchableOpacity key={index} style={styles.highlightItem}>
                    <View style={styles.highlightCircle}>
                      <Image 
                        source={{ uri: `https://images.pexels.com/photos/${1000000 + index}/pexels-photo-${1000000 + index}.jpeg?auto=compress&cs=tinysrgb&w=100&h=100` }} 
                        style={styles.highlightImage} 
                      />
                    </View>
                    <Text style={styles.highlightText}>{highlight}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </ScrollView>
          </View>
        </View>

        {/* Tab Navigation */}
        <View style={styles.tabContainer}>
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'posts' && styles.activeTab]}
            onPress={() => setSelectedTab('posts')}
          >
            <Grid size={24} color={selectedTab === 'posts' ? '#000' : '#666'} />
          </TouchableOpacity>
          
          <TouchableOpacity
            style={[styles.tab, selectedTab === 'tagged' && styles.activeTab]}
            onPress={() => setSelectedTab('tagged')}
          >
            <User size={24} color={selectedTab === 'tagged' ? '#000' : '#666'} />
          </TouchableOpacity>
        </View>

        {/* Tab Content */}
        {renderTabContent()}
      </ScrollView>
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
  headerCenter: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  username: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  verified: {
    fontSize: 16,
    color: '#0095f6',
    marginLeft: 4,
  },
  profileSection: {
    paddingHorizontal: 16,
    paddingVertical: 20,
  },
  profileHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 20,
  },
  avatar: {
    width: 90,
    height: 90,
    borderRadius: 45,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 4,
    right: 4,
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#00d848',
    borderWidth: 3,
    borderColor: '#fff',
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
    fontSize: 20,
    fontFamily: 'Inter-Bold',
    color: '#000',
  },
  statLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  bioSection: {
    marginBottom: 20,
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
    alignItems: 'center',
    marginBottom: 20,
  },
  editButton: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    marginRight: 8,
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
    marginRight: 8,
  },
  shareButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  followButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0095f6',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  followingButton: {
    backgroundColor: '#f0f0f0',
    borderWidth: 1,
    borderColor: '#ddd',
  },
  followButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginLeft: 4,
  },
  followingButtonText: {
    color: '#000',
  },
  messageButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f0f0f0',
    paddingVertical: 8,
    borderRadius: 8,
    marginRight: 8,
  },
  messageButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginLeft: 4,
  },
  iconButton: {
    width: 36,
    height: 36,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  highlightsSection: {
    marginBottom: 8,
  },
  highlights: {
    flexDirection: 'row',
    paddingVertical: 8,
  },
  highlightItem: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  highlightCircle: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: '#ddd',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  highlightImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  highlightText: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000',
    textAlign: 'center',
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
    justifyContent: 'center',
    alignItems: 'center',
    opacity: 0,
  },
  postStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  postStatText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
    marginHorizontal: 8,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyStateTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginTop: 16,
    marginBottom: 8,
  },
  emptyStateText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  notFoundContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  notFoundText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginTop: 16,
    marginBottom: 24,
  },
  backButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});