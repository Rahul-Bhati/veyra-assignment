import React, { createContext, useContext, useState, useEffect } from 'react';
import { mockUsers } from '@/data/mockData';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from "firebase/auth"
import {auth} from "@/config/firbase.config"

interface User {
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
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<boolean>;
  register: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
  logout: () => void;
  updateProfile: (updates: Partial<User>) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    // Auto-login with mock user for demo
    const mockUser = mockUsers[0];
    setUser(mockUser);
    setIsAuthenticated(true);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Mock authentication
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser) {
      setUser(foundUser);
      setIsAuthenticated(true);
      return true;
    }
    return false;
  };

  const register = async (email: string, password: string, username: string, fullName: string): Promise<boolean> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email,
      username,
      fullName,
      avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
      bio: '',
      verified: false,
      followers: 0,
      following: 0,
      posts: 0,
    };

    try {
      const create = await createUserWithEmailAndPassword(auth, email, password);
      const user = create.user;
      console.log("user created successfully => ", user);
      setUser(newUser);
      setIsAuthenticated(true);
      return true;
    } catch (error) {
      console.error('Registration failed:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
  };

  const updateProfile = (updates: Partial<User>) => {
    if (user) {
      setUser({ ...user, ...updates });
    }
  };

  return (
    <AuthContext.Provider value={{
      user,
      isAuthenticated,
      login,
      register,
      logout,
      updateProfile,
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}