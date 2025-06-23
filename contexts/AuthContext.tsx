import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  AuthErrorCodes,
} from 'firebase/auth';
import { auth, db } from '@/services/firebaseConfig';
import { doc, setDoc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { ToastAndroid } from 'react-native';

interface Post {
  id: string;
  imageUrl: string;
}

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
  posts?: Post[];
  [key: string]: any;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean; // Add isLoading to context
  selectedImage: string | null;
  setSelectedImage: (image: string) => void;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    email: string,
    password: string,
    username: string,
    fullName: string
  ) => Promise<boolean>;
  logout: () => Promise<void>;
  updateProfile: (updates: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (firebaseUser) => {
      console.log('Auth state changed:', { uid: firebaseUser?.uid, isAuthenticated });
      try {
        if (firebaseUser) {
          const userDoc = await getDoc(doc(db, 'users', firebaseUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data() as User;
            setUser({ ...userData, id: firebaseUser.uid });
            setIsAuthenticated(true);
          } else {
            console.warn('No user data found in Firestore');
            setUser(null);
            setIsAuthenticated(false);
          }
        } else {
          setUser(null);
          setIsAuthenticated(false);
        }
      } catch (error) {
        console.error('Error fetching user data:', error);
        ToastAndroid.show('Failed to load user data', ToastAndroid.SHORT);
      } finally {
        setIsLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      // User data is fetched via onAuthStateChanged
      console.log('User logged in:', userCredential.user.uid);
      return true;
    } catch (error: any) {
      let errorMessage = 'Login failed. Please try again.';
      switch (error.code) {
        case AuthErrorCodes.INVALID_EMAIL:
          errorMessage = 'Invalid email address.';
          break;
        default:
          console.error('Login error:', error);
      }
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };

  const register = async (
    email: string,
    password: string,
    username: string,
    fullName: string
  ): Promise<boolean> => {
    try {
      // Create user with Firebase Auth
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const firebaseUser = userCredential.user;

      // Create user profile in Firestore
      const newUser: User = {
        id: firebaseUser.uid,
        email,
        username,
        fullName,
        avatar:
          'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
        bio: '',
        verified: false,
        followers: 0,
        following: 0,
        posts: [],
      };

      // Ensure auth state is updated before Firestore write
      await new Promise((resolve) => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
          if (user && user.uid === firebaseUser.uid) {
            unsubscribe();
            resolve(true);
          }
        });
      });

      // Store user data in Firestore with UID as document ID
      await setDoc(doc(db, 'users', firebaseUser.uid), newUser);
      console.log('User created successfully:', firebaseUser.uid);

      // Update local state
      setUser(newUser);
      setIsAuthenticated(true);
      ToastAndroid.show('Registration successful!', ToastAndroid.SHORT);
      return true;
    } catch (error: any) {
      let errorMessage = 'Registration failed. Please try again.';
      switch (error.code) {
        case AuthErrorCodes.EMAIL_EXISTS:
          errorMessage = 'Email is already in use.';
          break;
        case AuthErrorCodes.INVALID_EMAIL:
          errorMessage = 'Invalid email address.';
          break;
        case AuthErrorCodes.WEAK_PASSWORD:
          errorMessage = 'Password is too weak.';
          break;
        case 'permission-denied':
          errorMessage = 'Database access denied. Contact support.';
          break;
        default:
          console.error('Registration error:', error);
      }
      ToastAndroid.show(errorMessage, ToastAndroid.SHORT);
      return false;
    }
  };

  const logout = async (): Promise<void> => {
    try {
      await signOut(auth);
      setUser(null);
      setIsAuthenticated(false);
      ToastAndroid.show('Logged out successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Logout error:', error);
      ToastAndroid.show('Logout failed', ToastAndroid.SHORT);
    }
  };


  const updateProfile = async (updates: Partial<User>): Promise<void> => {
    if (!user || !isAuthenticated) {
      ToastAndroid.show('No user is logged in', ToastAndroid.SHORT);
      return;
    }

    try {
      // If updating posts, use arrayUnion to append
      if (updates.posts) {
        await updateDoc(doc(db, 'users', user.id), {
          posts: arrayUnion(...updates.posts),
        });
      } else {
        // For other fields, use merge to update
        await setDoc(doc(db, 'users', user.id), { ...updates }, { merge: true });
      }

      // Update local state
      setUser((prevUser) => {
        if (!prevUser) return prevUser;
        if (updates.posts) {
          return { ...prevUser, posts: [...(prevUser.posts || []), ...updates.posts] };
        }
        return { ...prevUser, ...updates };
      });
      ToastAndroid.show('Profile updated successfully', ToastAndroid.SHORT);
    } catch (error) {
      console.error('Profile update error:', error);
      ToastAndroid.show('Failed to update profile', ToastAndroid.SHORT);
    }
  };

  // Avoid rendering children until auth state is resolved
  if (isLoading) {
    return null; // Or a loading spinner component
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading, // Expose isLoading
        selectedImage,
        setSelectedImage,
        login,
        register,
        logout,
        updateProfile,
      }}
    >
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


// import React, { createContext, useContext, useState, useEffect } from 'react';
// import { mockUsers } from '@/data/mockData';
// import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'firebase/auth';
// import { auth, db } from '@/services/firebaseConfig';
// import { addDoc, collection, doc, getDoc } from 'firebase/firestore';
// import { ToastAndroid } from 'react-native';

// interface User {
//   id: string;
//   username: string;
//   email: string;
//   fullName: string;
//   avatar: string;
//   bio?: string;
//   verified?: boolean;
//   followers: number;
//   following: number;
//   posts: number;
// }

// interface AuthContextType {
//   user: User | null;
//   isAuthenticated: boolean;
//   login: (email: string, password: string) => Promise<boolean>;
//   register: (email: string, password: string, username: string, fullName: string) => Promise<boolean>;
//   logout: () => void;
//   updateProfile: (updates: Partial<User>) => void;
// }

// const AuthContext = createContext<AuthContextType | undefined>(undefined);

// export function AuthProvider({ children }: { children: React.ReactNode }) {
//   const [user, setUser] = useState<User | null>(null);
//   const [isAuthenticated, setIsAuthenticated] = useState(false);

//   useEffect(() => {
//     // Auto-login with mock user for demo
//     const mockUser = mockUsers[0];
//     setUser(mockUser);
//     setIsAuthenticated(true);
//   }, []);

//   const login = async (email: string, password: string): Promise<boolean> => {
//     // Mock authentication
//     try {
//       const userCredential = await signInWithEmailAndPassword(auth, email, password);
//       console.log('User logged in:', userCredential.user);
//       // setUser(userCredential.user);
//       setIsAuthenticated(true);
//       return true;
//     } catch (error) {
//       console.error('Login error:', error);
//       return false;
//     }
//   };

//   const register = async (email: string, password: string, username: string, fullName: string): Promise<boolean> => {
//     // Mock registration
//     const newUser: User = {
//       id: Date.now().toString(),
//       email,
//       username,
//       fullName,
//       avatar: 'https://images.pexels.com/photos/1130626/pexels-photo-1130626.jpeg?auto=compress&cs=tinysrgb&w=150&h=150',
//       bio: '',
//       verified: false,
//       followers: 0,
//       following: 0,
//       posts: 0,
//     };

//     try {
//       const create = await createUserWithEmailAndPassword(auth, email, password);

//       const user = create.user;

//       await addDoc(collection(db, 'users'), newUser);
//       console.log("user created successfully => ", user);
//       setUser(newUser);
//       setIsAuthenticated(true);
//       return true;
//     } catch (error) {
//       ToastAndroid.show("Registration failed!", ToastAndroid.SHORT);
//       console.error('Registration failed:', error);
//       return false;
//     }
//   };

//   const logout = async () => {
//     try {
//       await signOut(auth);
//       setUser(null);
//       setIsAuthenticated(false);
//       console.log('User logged out');
//     } catch (error) {
//       console.error('Logout error:', error);
//     }
//   };

//   const updateProfile = (updates: Partial<User>) => {
//     if (user) {
//       setUser({ ...user, ...updates });
//     }
//   };

//   return (
//     <AuthContext.Provider value={{
//       user,
//       isAuthenticated,
//       login,
//       register,
//       logout,
//       updateProfile,
//     }}>
//       {children}
//     </AuthContext.Provider>
//   );
// }

// export function useAuth() {
//   const context = useContext(AuthContext);
//   if (context === undefined) {
//     throw new Error('useAuth must be used within an AuthProvider');
//   }
//   return context;
// }