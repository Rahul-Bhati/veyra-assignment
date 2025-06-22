export interface User {
  id: string;
  username: string;
  email: string;
  fullName: string;
  avatar: string;
  bio?: string;
  verified?: boolean;
  followers: number;
  following: number;
  posts: number;
  isFollowing?: boolean;
}

export interface Post {
  id: string;
  userId: string;
  imageUrl: string;
  caption: string;
  likes: number;
  comments: number;
  shares: number;
  timestamp: string;
  liked: boolean;
  saved: boolean;
  location?: string;
  mood?: 'happy' | 'sad' | 'excited' | 'relaxed' | 'adventurous';
  tags?: string[];
  isAnonymous?: boolean;
  shoppableTags?: ShoppableTag[];
}

export interface ShoppableTag {
  id: string;
  x: number;
  y: number;
  productName: string;
  price: string;
  link: string;
}

export interface Story {
  id: string;
  userId: string;
  imageUrl: string;
  timestamp: string;
  viewed: boolean;
  type: 'image' | 'video';
}

export interface Comment {
  id: string;
  postId: string;
  userId: string;
  text?: string;
  voiceUrl?: string;
  voiceDuration?: number;
  timestamp: string;
  likes: number;
  liked: boolean;
  replies?: Comment[];
}

export interface Message {
  id: string;
  chatId: string;
  senderId: string;
  text: string;
  timestamp: string;
  read: boolean;
  type: 'text' | 'image' | 'voice';
  mediaUrl?: string;
}

export interface Chat {
  id: string;
  participants: string[];
  lastMessage: Message;
  unreadCount: number;
  timestamp: string;
}

export const mockUsers: User[] = [
  {
    id: '1',
    username: 'johndoe',
    email: 'john@example.com',
    fullName: 'John Doe',
    avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    bio: 'Photography enthusiast 📸 | Travel lover ✈️ | Coffee addict ☕',
    verified: true,
    followers: 1234,
    following: 567,
    posts: 89,
  },
  {
    id: '2',
    username: 'sarahwilson',
    email: 'sarah@example.com',
    fullName: 'Sarah Wilson',
    avatar: 'https://images.pexels.com/photos/1239291/pexels-photo-1239291.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    bio: 'Artist & Designer 🎨 | Nature lover 🌿',
    verified: false,
    followers: 892,
    following: 234,
    posts: 45,
    isFollowing: true,
  },
  {
    id: '3',
    username: 'mikechef',
    email: 'mike@example.com',
    fullName: 'Mike Rodriguez',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    bio: 'Chef 👨‍🍳 | Food blogger | Sharing my culinary adventures',
    verified: true,
    followers: 5678,
    following: 123,
    posts: 234,
    isFollowing: false,
  },
  {
    id: '4',
    username: 'emmafit',
    email: 'emma@example.com',
    fullName: 'Emma Thompson',
    avatar: 'https://images.pexels.com/photos/1181690/pexels-photo-1181690.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    bio: 'Fitness coach 💪 | Yoga instructor 🧘‍♀️ | Wellness advocate',
    verified: false,
    followers: 3456,
    following: 789,
    posts: 156,
    isFollowing: true,
  },
  {
    id: '5',
    username: 'alextravel',
    email: 'alex@example.com',
    fullName: 'Alex Chen',
    avatar: 'https://images.pexels.com/photos/2182970/pexels-photo-2182970.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
    bio: 'Travel photographer 📷 | Digital nomad 🌍 | Adventure seeker',
    verified: true,
    followers: 12345,
    following: 456,
    posts: 321,
    isFollowing: false,
  },
];

export const mockPosts: Post[] = [
  {
    id: '1',
    userId: '2',
    imageUrl: 'https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600&h=600',
    caption: 'Beautiful sunset from my hike today! Nature never fails to amaze me 🌅 #sunset #hiking #nature',
    likes: 234,
    comments: 18,
    shares: 12,
    timestamp: '2024-01-15T10:30:00Z',
    liked: false,
    saved: false,
    location: 'Mountain View Trail',
    mood: 'relaxed',
    tags: ['#sunset', '#hiking', '#nature'],
  },
  {
    id: '2',
    userId: '3',
    imageUrl: 'https://images.pexels.com/photos/1640777/pexels-photo-1640777.jpeg?auto=compress&cs=tinysrgb&w=600&h=600',
    caption: 'Trying out a new recipe today - homemade pasta with truffle oil! 🍝 Who wants the recipe?',
    likes: 456,
    comments: 32,
    shares: 28,
    timestamp: '2024-01-15T14:20:00Z',
    liked: true,
    saved: true,
    mood: 'happy',
    tags: ['#cooking', '#pasta', '#chef'],
    shoppableTags: [
      {
        id: '1',
        x: 0.3,
        y: 0.4,
        productName: 'Truffle Oil',
        price: '$24.99',
        link: 'https://example.com/truffle-oil'
      }
    ],
  },
  {
    id: '3',
    userId: '4',
    imageUrl: 'https://images.pexels.com/photos/1552106/pexels-photo-1552106.jpeg?auto=compress&cs=tinysrgb&w=600&h=600',
    caption: 'Morning yoga session complete! Starting the day with positive energy ✨ #yoga #wellness #mindfulness',
    likes: 189,
    comments: 15,
    shares: 8,
    timestamp: '2024-01-15T08:00:00Z',
    liked: true,
    saved: false,
    mood: 'relaxed',
    tags: ['#yoga', '#wellness', '#mindfulness'],
  },
  {
    id: '4',
    userId: '5',
    imageUrl: 'https://images.pexels.com/photos/1371360/pexels-photo-1371360.jpeg?auto=compress&cs=tinysrgb&w=600&h=600',
    caption: 'Street art in Tokyo is absolutely incredible! The creativity here is mind-blowing 🎨 #tokyo #streetart #travel',
    likes: 567,
    comments: 43,
    shares: 21,
    timestamp: '2024-01-14T20:15:00Z',
    liked: false,
    saved: true,
    location: 'Shibuya, Tokyo',
    mood: 'excited',
    tags: ['#tokyo', '#streetart', '#travel'],
  },
  {
    id: '5',
    userId: '1',
    imageUrl: 'https://images.pexels.com/photos/1133957/pexels-photo-1133957.jpeg?auto=compress&cs=tinysrgb&w=600&h=600',
    caption: 'Coffee and contemplation ☕ Sometimes the best moments are the quiet ones.',
    likes: 123,
    comments: 9,
    shares: 3,
    timestamp: '2024-01-14T16:45:00Z',
    liked: true,
    saved: false,
    mood: 'relaxed',
    tags: ['#coffee', '#quiet', '#reflection'],
    isAnonymous: true,
  },
];

export const mockStories: Story[] = [
  {
    id: '1',
    userId: '2',
    imageUrl: 'https://images.pexels.com/photos/1239288/pexels-photo-1239288.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    timestamp: '2024-01-15T12:00:00Z',
    viewed: false,
    type: 'image',
  },
  {
    id: '2',
    userId: '3',
    imageUrl: 'https://images.pexels.com/photos/1640772/pexels-photo-1640772.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    timestamp: '2024-01-15T11:30:00Z',
    viewed: true,
    type: 'image',
  },
  {
    id: '3',
    userId: '4',
    imageUrl: 'https://images.pexels.com/photos/1552242/pexels-photo-1552242.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    timestamp: '2024-01-15T10:15:00Z',
    viewed: false,
    type: 'image',
  },
  {
    id: '4',
    userId: '5',
    imageUrl: 'https://images.pexels.com/photos/1371409/pexels-photo-1371409.jpeg?auto=compress&cs=tinysrgb&w=400&h=600',
    timestamp: '2024-01-15T09:45:00Z',
    viewed: true,
    type: 'image',
  },
];

export const mockComments: Comment[] = [
  {
    id: '1',
    postId: '1',
    userId: '3',
    text: 'Absolutely stunning! Where was this taken?',
    timestamp: '2024-01-15T11:00:00Z',
    likes: 12,
    liked: false,
  },
  {
    id: '2',
    postId: '1',
    userId: '4',
    text: 'Love this shot! 📸✨',
    timestamp: '2024-01-15T11:15:00Z',
    likes: 8,
    liked: true,
  },
  {
    id: '3',
    postId: '2',
    userId: '2',
    text: 'Recipe please! 🙏',
    timestamp: '2024-01-15T14:30:00Z',
    likes: 15,
    liked: false,
  },
  {
    id: '4',
    postId: '2',
    userId: '1',
    voiceUrl: 'mock-voice-url',
    voiceDuration: 8,
    timestamp: '2024-01-15T14:45:00Z',
    likes: 5,
    liked: false,
  },
];

export const mockChats: Chat[] = [
  {
    id: '1',
    participants: ['1', '2'],
    lastMessage: {
      id: '1',
      chatId: '1',
      senderId: '2',
      text: 'Hey! Love your latest post 😊',
      timestamp: '2024-01-15T15:30:00Z',
      read: false,
      type: 'text',
    },
    unreadCount: 2,
    timestamp: '2024-01-15T15:30:00Z',
  },
  {
    id: '2',
    participants: ['1', '3'],
    lastMessage: {
      id: '2',
      chatId: '2',
      senderId: '1',
      text: 'Thanks for the recipe! 👨‍🍳',
      timestamp: '2024-01-15T14:20:00Z',
      read: true,
      type: 'text',
    },
    unreadCount: 0,
    timestamp: '2024-01-15T14:20:00Z',
  },
];

export const mockMessages: Message[] = [
  {
    id: '1',
    chatId: '1',
    senderId: '2',
    text: 'Hey! Love your latest post 😊',
    timestamp: '2024-01-15T15:30:00Z',
    read: false,
    type: 'text',
  },
  {
    id: '2',
    chatId: '1',
    senderId: '2',
    text: 'The coffee shot was perfect!',
    timestamp: '2024-01-15T15:28:00Z',
    read: false,
    type: 'text',
  },
  {
    id: '3',
    chatId: '1',
    senderId: '1',
    text: 'Thank you so much! ☕',
    timestamp: '2024-01-15T15:25:00Z',
    read: true,
    type: 'text',
  },
];