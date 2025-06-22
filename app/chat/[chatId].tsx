import React, { useState, useRef, useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TextInput, TouchableOpacity, KeyboardAvoidingView, Platform, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useRouter, useLocalSearchParams } from 'expo-router';
import { ArrowLeft, Send, Phone, Video, Info, Smile, Camera, Mic } from 'lucide-react-native';
import { mockMessages, mockUsers, mockChats, Message } from '@/data/mockData';

export default function ChatScreen() {
  const router = useRouter();
  const { chatId } = useLocalSearchParams();
  const [messages, setMessages] = useState<Message[]>(mockMessages.filter(m => m.chatId === chatId));
  const [newMessage, setNewMessage] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isOnline, setIsOnline] = useState(true);
  const flatListRef = useRef<FlatList>(null);
  
  const chat = mockChats.find(c => c.id === chatId);
  const currentUserId = '1'; // Current user ID
  const otherUserId = chat?.participants.find(id => id !== currentUserId);
  const otherUser = mockUsers.find(u => u.id === otherUserId);

  useEffect(() => {
    // Simulate typing indicator
    const typingTimer = setTimeout(() => {
      setIsTyping(false);
    }, 3000);

    return () => clearTimeout(typingTimer);
  }, [isTyping]);

  const handleSendMessage = () => {
    if (!newMessage.trim()) return;

    const message: Message = {
      id: Date.now().toString(),
      chatId: chatId as string,
      senderId: currentUserId,
      text: newMessage,
      timestamp: new Date().toISOString(),
      read: false,
      type: 'text',
    };

    setMessages(prev => [...prev, message]);
    setNewMessage('');
    setIsTyping(true);
    
    // Auto-scroll to bottom
    setTimeout(() => {
      flatListRef.current?.scrollToEnd({ animated: true });
    }, 100);

    // Simulate response after 2 seconds
    setTimeout(() => {
      const response: Message = {
        id: (Date.now() + 1).toString(),
        chatId: chatId as string,
        senderId: otherUserId || '2',
        text: getRandomResponse(),
        timestamp: new Date().toISOString(),
        read: false,
        type: 'text',
      };
      setMessages(prev => [...prev, response]);
      setIsTyping(false);
      
      setTimeout(() => {
        flatListRef.current?.scrollToEnd({ animated: true });
      }, 100);
    }, 2000);
  };

  const getRandomResponse = () => {
    const responses = [
      "That's awesome! 😊",
      "I totally agree!",
      "Haha, that's funny!",
      "Thanks for sharing that",
      "Really? Tell me more!",
      "That sounds great!",
      "I love that idea!",
      "You're so right about that",
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const formatTime = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
  };

  const renderMessage = ({ item, index }: { item: Message; index: number }) => {
    const isCurrentUser = item.senderId === currentUserId;
    const showTime = index === 0 || 
      new Date(item.timestamp).getTime() - new Date(messages[index - 1].timestamp).getTime() > 300000; // 5 minutes

    return (
      <View style={styles.messageContainer}>
        {showTime && (
          <Text style={styles.timeStamp}>
            {formatTime(item.timestamp)}
          </Text>
        )}
        
        <View style={[
          styles.messageBubble,
          isCurrentUser ? styles.sentMessage : styles.receivedMessage
        ]}>
          <Text style={[
            styles.messageText,
            isCurrentUser ? styles.sentMessageText : styles.receivedMessageText
          ]}>
            {item.text}
          </Text>
          
          {isCurrentUser && (
            <View style={styles.messageStatus}>
              <View style={[
                styles.readIndicator,
                item.read && styles.readIndicatorRead
              ]} />
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderTypingIndicator = () => {
    if (!isTyping) return null;
    
    return (
      <View style={styles.typingContainer}>
        <Image source={{ uri: otherUser?.avatar }} style={styles.typingAvatar} />
        <View style={styles.typingBubble}>
          <View style={styles.typingDots}>
            <View style={[styles.typingDot, { animationDelay: '0ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '150ms' }]} />
            <View style={[styles.typingDot, { animationDelay: '300ms' }]} />
          </View>
        </View>
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
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={() => router.back()}>
              <ArrowLeft size={24} color="#000" />
            </TouchableOpacity>
            
            <TouchableOpacity style={styles.userInfo}>
              <Image source={{ uri: otherUser?.avatar }} style={styles.headerAvatar} />
              <View>
                <Text style={styles.headerName}>{otherUser?.fullName}</Text>
                <Text style={styles.headerStatus}>
                  {isOnline ? 'Active now' : 'Last seen 2h ago'}
                </Text>
              </View>
            </TouchableOpacity>
          </View>
          
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.headerButton}>
              <Phone size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Video size={20} color="#000" />
            </TouchableOpacity>
            <TouchableOpacity style={styles.headerButton}>
              <Info size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Messages */}
        <FlatList
          ref={flatListRef}
          data={messages}
          renderItem={renderMessage}
          keyExtractor={(item) => item.id}
          style={styles.messagesList}
          contentContainerStyle={styles.messagesContent}
          showsVerticalScrollIndicator={false}
          ListFooterComponent={renderTypingIndicator}
        />

        {/* Input */}
        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.inputButton}>
            <Camera size={20} color="#666" />
          </TouchableOpacity>
          
          <View style={styles.textInputContainer}>
            <TextInput
              style={styles.textInput}
              placeholder="Message..."
              value={newMessage}
              onChangeText={setNewMessage}
              multiline
              maxLength={1000}
            />
            <TouchableOpacity style={styles.inputButton}>
              <Smile size={20} color="#666" />
            </TouchableOpacity>
          </View>
          
          {newMessage.trim() ? (
            <TouchableOpacity style={styles.sendButton} onPress={handleSendMessage}>
              <Send size={18} color="#fff" />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity style={styles.inputButton}>
              <Mic size={20} color="#666" />
            </TouchableOpacity>
          )}
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
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  userInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft: 16,
    flex: 1,
  },
  headerAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginRight: 12,
  },
  headerName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  headerStatus: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 2,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerButton: {
    marginLeft: 16,
    padding: 4,
  },
  messagesList: {
    flex: 1,
  },
  messagesContent: {
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  messageContainer: {
    marginBottom: 12,
  },
  timeStamp: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'center',
    marginBottom: 12,
  },
  messageBubble: {
    maxWidth: '80%',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 20,
    position: 'relative',
  },
  sentMessage: {
    backgroundColor: '#0095f6',
    alignSelf: 'flex-end',
    borderBottomRightRadius: 4,
  },
  receivedMessage: {
    backgroundColor: '#f0f0f0',
    alignSelf: 'flex-start',
    borderBottomLeftRadius: 4,
  },
  messageText: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    lineHeight: 20,
  },
  sentMessageText: {
    color: '#fff',
  },
  receivedMessageText: {
    color: '#000',
  },
  messageStatus: {
    position: 'absolute',
    bottom: -8,
    right: 8,
  },
  readIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#fff',
    backgroundColor: 'transparent',
  },
  readIndicatorRead: {
    backgroundColor: '#fff',
  },
  typingContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    marginTop: 8,
  },
  typingAvatar: {
    width: 24,
    height: 24,
    borderRadius: 12,
    marginRight: 8,
  },
  typingBubble: {
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 20,
    borderBottomLeftRadius: 4,
  },
  typingDots: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  typingDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#666',
    marginRight: 4,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  inputButton: {
    padding: 8,
  },
  textInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'flex-end',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    marginHorizontal: 8,
    maxHeight: 100,
  },
  textInput: {
    flex: 1,
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#000',
    paddingVertical: 4,
  },
  sendButton: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: '#0095f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
});