import { Tabs } from 'expo-router';
import { Chrome as Home, Search, SquarePlus as PlusSquare, Heart, User } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { useRouter } from 'expo-router';
import { useEffect } from 'react';

export default function TabLayout() {
  const { isAuthenticated } = useAuth();
  const router = useRouter();

  useEffect(() => {
    if (!isAuthenticated) {
      router.replace('/auth');
    }
  }, [isAuthenticated]);

  if (!isAuthenticated) {
    return null;
  }

  return (
    <Tabs
      screenOptions={{
        headerShown: false,
        tabBarStyle: {
          backgroundColor: '#fff',
          borderTopWidth: 1,
          borderTopColor: '#f0f0f0',
          paddingBottom: 8,
          paddingTop: 8,
          height: 80,
        },
        tabBarActiveTintColor: '#000',
        tabBarInactiveTintColor: '#666',
        tabBarLabelStyle: {
          fontSize: 12,
          fontFamily: 'Inter-Medium',
          marginTop: 4,
        },
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Home',
          tabBarIcon: ({ size, color }) => (
            <Home size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="explore"
        options={{
          title: 'Explore',
          tabBarIcon: ({ size, color }) => (
            <Search size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="create"
        options={{
          title: 'Create',
          tabBarIcon: ({ size, color }) => (
            <PlusSquare size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="notifications"
        options={{
          title: 'Activity',
          tabBarIcon: ({ size, color }) => (
            <Heart size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Profile',
          tabBarIcon: ({ size, color }) => (
            <User size={size} color={color} strokeWidth={2} />
          ),
        }}
      />
    </Tabs>
  );
}