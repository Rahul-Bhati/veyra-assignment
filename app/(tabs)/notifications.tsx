import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Heart, MessageCircle, UserPlus, Camera, Mic } from 'lucide-react-native';
import { mockUsers } from '@/data/mockData';

interface Notification {
  id: string;
  type: 'like' | 'comment' | 'follow' | 'mention' | 'voice_comment';
  userId: string;
  postId?: string;
  timestamp: string;
  read: boolean;
  content?: string;
}

const mockNotifications: Notification[] = [
  {
    id: '1',
    type: 'like',
    userId: '2',
    postId: '1',
    timestamp: '2024-01-15T10:30:00Z',
    read: false,
  },
  {
    id: '2',
    type: 'comment',
    userId: '3',
    postId: '1',
    timestamp: '2024-01-15T09:15:00Z',
    read: false,
    content: 'Amazing shot! 📸',
  },
  {
    id: '3',
    type: 'follow',
    userId: '4',
    timestamp: '2024-01-15T08:45:00Z',
    read: true,
  },
  {
    id: '4',
    type: 'voice_comment',
    userId: '5',
    postId: '2',
    timestamp: '2024-01-15T07:20:00Z',
    read: false,
  },
  {
    id: '5',
    type: 'like',
    userId: '2',
    postId: '3',
    timestamp: '2024-01-14T20:10:00Z',
    read: true,
  },
];

export default function Notifications() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const markAsRead = (notificationId: string) => {
    setNotifications(prev =>
      prev.map(notif =>
        notif.id === notificationId ? { ...notif, read: true } : notif
      )
    );
  };

  const getNotificationText = (notification: Notification) => {
    const user = mockUsers.find(u => u.id === notification.userId);
    const username = user?.username || 'Unknown';

    switch (notification.type) {
      case 'like':
        return `${username} liked your post`;
      case 'comment':
        return `${username} commented: ${notification.content}`;
      case 'follow':
        return `${username} started following you`;
      case 'mention':
        return `${username} mentioned you in a comment`;
      case 'voice_comment':
        return `${username} left a voice comment`;
      default:
        return '';
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'like':
        return <Heart size={20} color="#ff3040" fill="#ff3040" />;
      case 'comment':
        return <MessageCircle size={20} color="#0095f6" />;
      case 'follow':
        return <UserPlus size={20} color="#0095f6" />;
      case 'mention':
        return <MessageCircle size={20} color="#0095f6" />;
      case 'voice_comment':
        return <Mic size={20} color="#833AB4" />;
      default:
        return <Heart size={20} color="#666" />;
    }
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const notifTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - notifTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  const filteredNotifications = notifications.filter(notif => 
    filter === 'all' || !notif.read
  );

  const renderNotification = ({ item }: { item: Notification }) => {
    const user = mockUsers.find(u => u.id === item.userId);
    
    return (
      <TouchableOpacity
        style={[styles.notificationItem, !item.read && styles.unreadNotification]}
        onPress={() => markAsRead(item.id)}
      >
        <Image source={{ uri: user?.avatar }} style={styles.avatar} />
        
        <View style={styles.notificationContent}>
          <View style={styles.notificationHeader}>
            <Text style={styles.notificationText}>
              {getNotificationText(item)}
            </Text>
            <Text style={styles.timestamp}>
              {formatTimeAgo(item.timestamp)}
            </Text>
          </View>
          
          {!item.read && <View style={styles.unreadDot} />}
        </View>
        
        <View style={styles.notificationIcon}>
          {getNotificationIcon(item.type)}
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Activity</Text>
        <View style={styles.filterContainer}>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'all' && styles.activeFilter]}
            onPress={() => setFilter('all')}
          >
            <Text style={[styles.filterText, filter === 'all' && styles.activeFilterText]}>
              All
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.filterButton, filter === 'unread' && styles.activeFilter]}
            onPress={() => setFilter('unread')}
          >
            <Text style={[styles.filterText, filter === 'unread' && styles.activeFilterText]}>
              Unread
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={filteredNotifications}
        renderItem={renderNotification}
        keyExtractor={(item) => item.id}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.list}
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
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
    padding: 2,
  },
  filterButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 6,
  },
  activeFilter: {
    backgroundColor: '#fff',
  },
  filterText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  activeFilterText: {
    color: '#000',
  },
  list: {
    padding: 16,
  },
  notificationItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  unreadNotification: {
    backgroundColor: '#f8f9ff',
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    marginRight: 12,
  },
  notificationContent: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  notificationHeader: {
    flex: 1,
  },
  notificationText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  unreadDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#0095f6',
    marginLeft: 8,
  },
  notificationIcon: {
    marginLeft: 12,
  },
});