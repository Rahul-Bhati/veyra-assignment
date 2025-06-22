import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter } from 'expo-router';
import { ArrowLeft, Search, CreditCard as Edit, Camera } from 'lucide-react-native';
import { mockChats, mockUsers } from '@/data/mockData';

export default function MessagesScreen() {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  
  const filteredChats = mockChats.filter(chat => {
    const otherUserId = chat.participants.find(id => id !== '1');
    const otherUser = mockUsers.find(u => u.id === otherUserId);
    return otherUser?.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
           otherUser?.username.toLowerCase().includes(searchQuery.toLowerCase());
  });

  const formatTime = (timestamp: string) => {
    const now = new Date();
    const messageTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - messageTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const renderChat = ({ item }: { item: any }) => {
    const otherUserId = item.participants.find((id: string) => id !== '1');
    const otherUser = mockUsers.find(u => u.id === otherUserId);
    
    return (
      <TouchableOpacity
        style={styles.chatItem}
        onPress={() => router.push(`/chat/${item.id}`)}
      >
        <View style={styles.avatarContainer}>
          <Image source={{ uri: otherUser?.avatar }} style={styles.avatar} />
          {otherUser?.id === '2' && <View style={styles.onlineIndicator} />}
        </View>
        
        <View style={styles.chatContent}>
          <View style={styles.chatHeader}>
            <Text style={styles.chatName}>{otherUser?.fullName}</Text>
            <Text style={styles.chatTime}>{formatTime(item.timestamp)}</Text>
          </View>
          
          <View style={styles.chatPreview}>
            <Text style={[
              styles.lastMessage,
              item.unreadCount > 0 && styles.unreadMessage
            ]} numberOfLines={1}>
              {item.lastMessage.text}
            </Text>
            {item.unreadCount > 0 && (
              <View style={styles.unreadBadge}>
                <Text style={styles.unreadCount}>{item.unreadCount}</Text>
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerLeft}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Messages</Text>
        </View>
        
        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.headerButton}>
            <Camera size={24} color="#000" />
          </TouchableOpacity>
          <TouchableOpacity style={styles.headerButton}>
            <Edit size={24} color="#000" />
          </TouchableOpacity>
        </View>
      </View>

      {/* Search */}
      <View style={styles.searchContainer}>
        <View style={styles.searchInputContainer}>
          <Search size={16} color="#666" />
          <TextInput
            style={styles.searchInput}
            placeholder="Search messages..."
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>
      </View>

      {/* Active Users */}
      <View style={styles.activeSection}>
        <Text style={styles.sectionTitle}>Active</Text>
        <FlatList
          data={mockUsers.slice(1, 4)}
          renderItem={({ item }) => (
            <TouchableOpacity style={styles.activeUser}>
              <View style={styles.activeAvatarContainer}>
                <Image source={{ uri: item.avatar }} style={styles.activeAvatar} />
                <View style={styles.activeIndicator} />
              </View>
              <Text style={styles.activeUsername} numberOfLines={1}>
                {item.username}
              </Text>
            </TouchableOpacity>
          )}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.activeList}
        />
      </View>

      {/* Chats List */}
      <FlatList
        data={filteredChats}
        renderItem={renderChat}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.chatsList}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginLeft: 16,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
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
  activeSection: {
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    paddingHorizontal: 16,
    marginBottom: 12,
  },
  activeList: {
    paddingHorizontal: 16,
  },
  activeUser: {
    alignItems: 'center',
    marginRight: 16,
    width: 70,
  },
  activeAvatarContainer: {
    position: 'relative',
  },
  activeAvatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  activeIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00d848',
    borderWidth: 2,
    borderColor: '#fff',
  },
  activeUsername: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#000',
    marginTop: 8,
    textAlign: 'center',
  },
  chatsList: {
    paddingTop: 8,
  },
  chatItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  avatarContainer: {
    position: 'relative',
    marginRight: 12,
  },
  avatar: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  onlineIndicator: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: '#00d848',
    borderWidth: 2,
    borderColor: '#fff',
  },
  chatContent: {
    flex: 1,
  },
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  chatName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  chatTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  chatPreview: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  lastMessage: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    flex: 1,
  },
  unreadMessage: {
    color: '#000',
    fontFamily: 'Inter-Medium',
  },
  unreadBadge: {
    backgroundColor: '#0095f6',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  unreadCount: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
});