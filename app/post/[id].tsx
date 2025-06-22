import React, { useState, useRef } from 'react';
import { View, Text, StyleSheet, ScrollView, Image, TouchableOpacity, TextInput, KeyboardAvoidingView, Platform, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Heart, MessageCircle, Send, Bookmark, MoveHorizontal as MoreHorizontal, Smile } from 'lucide-react-native';
import { mockPosts, mockComments, mockUsers, Comment } from '@/data/mockData';
import Animated, { useSharedValue, withSpring, useAnimatedStyle } from 'react-native-reanimated';

export default function PostDetail() {
  const router = useRouter();
  const { id } = useLocalSearchParams();
  const [comments, setComments] = useState(mockComments.filter(c => c.postId === id));
  const [newComment, setNewComment] = useState('');
  const [showAllComments, setShowAllComments] = useState(false);
  const [replyingTo, setReplyingTo] = useState<string | null>(null);
  const commentInputRef = useRef<TextInput>(null);
  
  const post = mockPosts.find(p => p.id === id);
  const postUser = mockUsers.find(u => u.id === post?.userId);
  
  const likeScale = useSharedValue(1);
  const [liked, setLiked] = useState(post?.liked || false);
  const [saved, setSaved] = useState(post?.saved || false);

  if (!post) {
    return (
      <SafeAreaView style={styles.container}>
        <Text>Post not found</Text>
      </SafeAreaView>
    );
  }

  const handleLike = () => {
    setLiked(!liked);
    likeScale.value = withSpring(1.2, {}, () => {
      likeScale.value = withSpring(1);
    });
  };

  const handleCommentLike = (commentId: string) => {
    setComments(prev =>
      prev.map(comment =>
        comment.id === commentId
          ? {
              ...comment,
              liked: !comment.liked,
              likes: comment.liked ? comment.likes - 1 : comment.likes + 1,
            }
          : comment
      )
    );
  };

  const handleAddComment = () => {
    if (!newComment.trim()) return;

    const comment: Comment = {
      id: Date.now().toString(),
      postId: id as string,
      userId: '1', // Current user
      text: newComment,
      timestamp: new Date().toISOString(),
      likes: 0,
      liked: false,
    };

    setComments(prev => [...prev, comment]);
    setNewComment('');
    setReplyingTo(null);
  };

  const handleReply = (commentId: string, username: string) => {
    setReplyingTo(commentId);
    setNewComment(`@${username} `);
    commentInputRef.current?.focus();
  };

  const formatTimeAgo = (timestamp: string) => {
    const now = new Date();
    const commentTime = new Date(timestamp);
    const diffInMinutes = Math.floor((now.getTime() - commentTime.getTime()) / (1000 * 60));
    
    if (diffInMinutes < 1) return 'now';
    if (diffInMinutes < 60) return `${diffInMinutes}m`;
    if (diffInMinutes < 1440) return `${Math.floor(diffInMinutes / 60)}h`;
    return `${Math.floor(diffInMinutes / 1440)}d`;
  };

  const animatedHeartStyle = useAnimatedStyle(() => {
    return {
      transform: [{ scale: likeScale.value }],
    };
  });

  const displayedComments = showAllComments ? comments : comments.slice(0, 3);

  const renderComment = (comment: Comment) => {
    const commentUser = mockUsers.find(u => u.id === comment.userId);
    
    return (
      <View key={comment.id} style={styles.commentItem}>
        <Image source={{ uri: commentUser?.avatar }} style={styles.commentAvatar} />
        
        <View style={styles.commentContent}>
          <View style={styles.commentHeader}>
            <Text style={styles.commentUsername}>{commentUser?.username}</Text>
            <Text style={styles.commentTime}>{formatTimeAgo(comment.timestamp)}</Text>
          </View>
          
          {comment.text && (
            <Text style={styles.commentText}>{comment.text}</Text>
          )}
          
          {comment.voiceUrl && (
            <View style={styles.voiceComment}>
              <View style={styles.voiceWave}>
                <View style={[styles.waveLine, { height: 12 }]} />
                <View style={[styles.waveLine, { height: 20 }]} />
                <View style={[styles.waveLine, { height: 16 }]} />
                <View style={[styles.waveLine, { height: 24 }]} />
                <View style={[styles.waveLine, { height: 14 }]} />
              </View>
              <Text style={styles.voiceDuration}>{comment.voiceDuration}s</Text>
            </View>
          )}
          
          <View style={styles.commentActions}>
            <TouchableOpacity onPress={() => handleCommentLike(comment.id)}>
              <Text style={[styles.commentAction, comment.liked && styles.likedAction]}>
                {comment.likes > 0 ? `${comment.likes} likes` : 'Like'}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleReply(comment.id, commentUser?.username || '')}>
              <Text style={styles.commentAction}>Reply</Text>
            </TouchableOpacity>
          </View>
        </View>
        
        <TouchableOpacity onPress={() => handleCommentLike(comment.id)}>
          <Heart
            size={12}
            color={comment.liked ? '#ff3040' : '#666'}
            fill={comment.liked ? '#ff3040' : 'none'}
          />
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView 
        style={styles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <ArrowLeft size={24} color="#000" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Post</Text>
          <TouchableOpacity>
            <MoreHorizontal size={24} color="#000" />
          </TouchableOpacity>
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          {/* Post Header */}
          <View style={styles.postHeader}>
            <TouchableOpacity style={styles.userInfo}>
              <Image source={{ uri: postUser?.avatar }} style={styles.avatar} />
              <View>
                <Text style={styles.username}>{postUser?.username}</Text>
                {post.location && (
                  <Text style={styles.location}>{post.location}</Text>
                )}
              </View>
            </TouchableOpacity>
            <TouchableOpacity>
              <MoreHorizontal size={20} color="#000" />
            </TouchableOpacity>
          </View>

          {/* Post Image */}
          <Image source={{ uri: post.imageUrl }} style={styles.postImage} />

          {/* Post Actions */}
          <View style={styles.actions}>
            <View style={styles.leftActions}>
              <TouchableOpacity onPress={handleLike}>
                <Animated.View style={animatedHeartStyle}>
                  <Heart
                    size={24}
                    color={liked ? '#ff3040' : '#000'}
                    fill={liked ? '#ff3040' : 'none'}
                    strokeWidth={2}
                  />
                </Animated.View>
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <MessageCircle size={24} color="#000" strokeWidth={2} />
              </TouchableOpacity>
              
              <TouchableOpacity style={styles.actionButton}>
                <Send size={24} color="#000" strokeWidth={2} />
              </TouchableOpacity>
            </View>
            
            <TouchableOpacity onPress={() => setSaved(!saved)}>
              <Bookmark
                size={24}
                color="#000"
                fill={saved ? '#000' : 'none'}
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
              <Text style={styles.captionUsername}>{postUser?.username}</Text>
              {' '}
              {post.caption}
            </Text>
          </View>

          {/* Comments Section */}
          <View style={styles.commentsSection}>
            <Text style={styles.commentsTitle}>
              Comments ({comments.length})
            </Text>
            
            {displayedComments.map(renderComment)}
            
            {comments.length > 3 && !showAllComments && (
              <TouchableOpacity 
                style={styles.showMoreButton}
                onPress={() => setShowAllComments(true)}
              >
                <Text style={styles.showMoreText}>
                  View all {comments.length} comments
                </Text>
              </TouchableOpacity>
            )}
          </View>
        </ScrollView>

        {/* Comment Input */}
        <View style={styles.commentInputContainer}>
          <Image source={{ uri: mockUsers[0].avatar }} style={styles.inputAvatar} />
          <TextInput
            ref={commentInputRef}
            style={styles.commentInput}
            placeholder="Add a comment..."
            value={newComment}
            onChangeText={setNewComment}
            multiline
            maxLength={500}
          />
          <TouchableOpacity style={styles.emojiButton}>
            <Smile size={20} color="#666" />
          </TouchableOpacity>
          <TouchableOpacity 
            style={[styles.postButton, newComment.trim() && styles.postButtonActive]}
            onPress={handleAddComment}
            disabled={!newComment.trim()}
          >
            <Text style={[styles.postButtonText, newComment.trim() && styles.postButtonTextActive]}>
              Post
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
  headerTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  content: {
    flex: 1,
  },
  postHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  username: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  location: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  postImage: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
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
    marginBottom: 16,
  },
  caption: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
  },
  captionUsername: {
    fontFamily: 'Inter-SemiBold',
  },
  commentsSection: {
    paddingHorizontal: 16,
    paddingBottom: 20,
  },
  commentsTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 16,
  },
  commentItem: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  commentAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentContent: {
    flex: 1,
  },
  commentHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  commentUsername: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginRight: 8,
  },
  commentTime: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  commentText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    lineHeight: 20,
    marginBottom: 8,
  },
  voiceComment: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 8,
    alignSelf: 'flex-start',
  },
  voiceWave: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 8,
  },
  waveLine: {
    width: 2,
    backgroundColor: '#833AB4',
    borderRadius: 1,
    marginRight: 2,
  },
  voiceDuration: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  commentActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  commentAction: {
    fontSize: 12,
    fontFamily: 'Inter-SemiBold',
    color: '#666',
    marginRight: 16,
  },
  likedAction: {
    color: '#ff3040',
  },
  showMoreButton: {
    marginTop: 8,
  },
  showMoreText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  commentInputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  commentInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    maxHeight: 100,
    marginRight: 8,
  },
  emojiButton: {
    padding: 8,
  },
  postButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  postButtonActive: {
    backgroundColor: '#0095f6',
  },
  postButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#ccc',
  },
  postButtonTextActive: {
    color: '#fff',
  },
});