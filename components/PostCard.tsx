import React, { useState } from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Heart, MessageCircle, Send, Bookmark, MoveHorizontal as MoreHorizontal, MapPin, ShoppingBag, Mic } from 'lucide-react-native';
import { useRouter } from 'expo-router';
import { mockUsers } from '@/data/mockData';
import { Post } from '@/data/mockData';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

const { width } = Dimensions.get('window');

interface PostCardProps {
  post: Post;
  onLike: (postId: string) => void;
  onSave: (postId: string) => void;
}

export function PostCard({ post, onLike, onSave }: PostCardProps) {
  const router = useRouter();
  const [doubleTapTimeout, setDoubleTapTimeout] = useState<NodeJS.Timeout | null>(null);
  const likeScale = useSharedValue(1);
  
  const postUser = mockUsers.find(u => u.id === post.userId);
  
  const handleDoubleTap = () => {
    if (!post.liked) {
      onLike(post.id);
      likeScale.value = withSpring(1.2, {}, () => {
        likeScale.value = withSpring(1);
      });
    }
  };

  const handleSingleTap = () => {
    if (doubleTapTimeout) {
      clearTimeout(doubleTapTimeout);
      setDoubleTapTimeout(null);
      handleDoubleTap();
    } else {
      const timeout = setTimeout(() => {
        // Single tap action (could navigate to post detail)
        setDoubleTapTimeout(null);
      }, 300);
      setDoubleTapTimeout(timeout);
    }
  };

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  const getMoodEmoji = (mood?: string) => {
    const moodEmojis = {
      happy: '😊',
      sad: '😢',
      excited: '🤩',
      relaxed: '😌',
      adventurous: '🌟',
    };
    return mood ? moodEmojis[mood as keyof typeof moodEmojis] : '';
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const postTime = new Date(timestamp);
    const diffInHours = Math.floor((now.getTime() - postTime.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'now';
    if (diffInHours < 24) return `${diffInHours}h`;
    return `${Math.floor(diffInHours / 24)}d`;
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.userInfo}
          onPress={() => router.push(`/profile/${post.userId}`)}
        >
          <Image source={{ uri: postUser?.avatar }} style={styles.avatar} />
          <View style={styles.userTextContainer}>
            <View style={styles.usernameContainer}>
              <Text style={styles.username}>
                {post.isAnonymous ? 'Anonymous' : postUser?.username}
              </Text>
              {postUser?.verified && <Text style={styles.verified}>✓</Text>}
              {post.mood && <Text style={styles.mood}>{getMoodEmoji(post.mood)}</Text>}
            </View>
            {post.location && (
              <View style={styles.locationContainer}>
                <MapPin size={12} color="#666" />
                <Text style={styles.location}>{post.location}</Text>
              </View>
            )}
          </View>
        </TouchableOpacity>
        
        <TouchableOpacity>
          <MoreHorizontal size={20} color="#000" />
        </TouchableOpacity>
      </View>

      {/* Image */}
      <TouchableOpacity activeOpacity={1} onPress={handleSingleTap}>
        <View style={styles.imageContainer}>
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />
          
          {/* Shoppable Tags */}
          {post.shoppableTags?.map((tag) => (
            <TouchableOpacity
              key={tag.id}
              style={[
                styles.shoppableTag,
                {
                  left: width * tag.x,
                  top: width * tag.y,
                }
              ]}
            >
              <ShoppingBag size={16} color="#fff" />
            </TouchableOpacity>
          ))}
        </View>
      </TouchableOpacity>

      {/* Actions */}
      <View style={styles.actions}>
        <View style={styles.leftActions}>
          <TouchableOpacity onPress={() => onLike(post.id)}>
            <Animated.View style={animatedHeartStyle}>
              <Heart
                size={24}
                color={post.liked ? '#ff3040' : '#000'}
                fill={post.liked ? '#ff3040' : 'none'}
                strokeWidth={2}
              />
            </Animated.View>
          </TouchableOpacity>
          
          <TouchableOpacity
            style={styles.actionButton}
            onPress={() => router.push(`/post/${post.id}`)}
          >
            <MessageCircle size={24} color="#000" strokeWidth={2} />
          </TouchableOpacity>
          
          <TouchableOpacity style={styles.actionButton}>
            <Send size={24} color="#000" strokeWidth={2} />
          </TouchableOpacity>
        </View>
        
        <TouchableOpacity onPress={() => onSave(post.id)}>
          <Bookmark
            size={24}
            color="#000"
            fill={post.saved ? '#000' : 'none'}
            strokeWidth={2}
          />
        </TouchableOpacity>
      </View>

      {/* Likes */}
      <View style={styles.likesContainer}>
        <Text style={styles.likes}>{post.likes.toLocaleString()} likes</Text>
      </View>

      {/* Caption */}
      <View style={styles.captionContainer}>
        <Text style={styles.caption}>
          <Text style={styles.username}>
            {post.isAnonymous ? 'Anonymous' : postUser?.username}
          </Text>
          {' '}
          {post.caption}
        </Text>
      </View>

      {/* Comments Preview */}
      {post.comments > 0 && (
        <TouchableOpacity onPress={() => router.push(`/post/${post.id}`)}>
          <Text style={styles.viewComments}>
            View all {post.comments} comments
          </Text>
        </TouchableOpacity>
      )}

      {/* Timestamp */}
      <Text style={styles.timestamp}>{formatTimeAgo(post.timestamp)}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#fff',
    marginBottom: 16,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  userTextContainer: {
    flex: 1,
  },
  usernameContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  username: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  verified: {
    fontSize: 12,
    color: '#0095f6',
    marginLeft: 4,
  },
  mood: {
    fontSize: 14,
    marginLeft: 4,
  },
  locationContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 2,
  },
  location: {
    fontSize: 12,
    color: '#666',
    marginLeft: 4,
  },
  imageContainer: {
    position: 'relative',
  },
  postImage: {
    width: width,
    height: width,
    backgroundColor: '#f0f0f0',
  },
  shoppableTag: {
    position: 'absolute',
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    alignItems: 'center',
    justifyContent: 'center',
    transform: [{ translateX: -16 }, { translateY: -16 }],
  },
  actions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  leftActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  actionButton: {
    marginLeft: 16,
  },
  likesContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  likes: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  captionContainer: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
  },
  viewComments: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  timestamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    paddingHorizontal: 16,
    marginBottom: 8,
  },
});