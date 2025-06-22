import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Heart, MessageCircle, Send } from 'lucide-react-native';
import { useRouter } from 'expo-router';

export function Header() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <Text style={styles.logo}>InstaClone</Text>
      
      <View style={styles.rightIcons}>
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/notifications')}
        >
          <Heart size={24} color="#000" strokeWidth={2} />
        </TouchableOpacity>
        
        <TouchableOpacity
          style={styles.iconButton}
          onPress={() => router.push('/messages')}
        >
          <MessageCircle size={24} color="#000" strokeWidth={2} />
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
    backgroundColor: '#fff',
  },
  logo: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#000',
    letterSpacing: -0.5,
  },
  rightIcons: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 16,
    padding: 4,
  },
});