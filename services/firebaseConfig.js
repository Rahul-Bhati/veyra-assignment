import { initializeApp,  getApp, getApps  } from 'firebase/app';
import { initializeAuth, getReactNativePersistence } from 'firebase/auth';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { getFirestore } from 'firebase/firestore';
console.log( process.env.EXPO_PUBLIC_FIREBASE_API_KEY);

const firebaseConfig = {
    apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
    authDomain: "instaclone-927fd.firebaseapp.com",
    projectId: "instaclone-927fd",
    storageBucket: "instaclone-927fd.firebasestorage.app",
    messagingSenderId: "891529231479",
    appId: "1:891529231479:web:4d3a428e4039fce73e1a72",
    measurementId: "G-TVGXFGS41M"
};

// Initialize Firebase only if no app exists
const app = getApps().length === 0 ? initializeApp(firebaseConfig) : getApp();

// Initialize Auth with persistence
const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
}) || getAuth(app); // Fallback to getAuth if already initialized

// Initialize Firestore
const db = getFirestore(app);

export { app, auth, db };