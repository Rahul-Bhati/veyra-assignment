// src/services/getPosts.js
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig'; // Adjust path to your Firebase config
import { ToastAndroid, Platform } from 'react-native';

// Optional: For cross-platform toasts, you can use react-native-toast-message
// import Toast from 'react-native-toast-message';

const getPosts = (callback: any) => {
  try {
    // Create a query to fetch posts, ordered by timestamp (newest first)
    const postsQuery = query(collection(db, 'posts'), orderBy('timestamp', 'desc'));

    // Set up real-time listener with onSnapshot
    const unsubscribe = onSnapshot(
      postsQuery,
      (querySnapshot) => {
        const posts = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        callback(posts); // Pass posts to the provided callback for state updates
      },
      (error) => {
        console.error('Error fetching posts:', error);
        if (Platform.OS === 'android') {
          ToastAndroid.show('Error fetching posts!', ToastAndroid.SHORT);
        } else {
          // For iOS or other platforms, use an alternative
          // Toast.show({ type: 'error', text1: 'Error fetching posts!' });
          console.warn('Error toast not shown on non-Android platform');
        }
      }
    );

    // Return unsubscribe function to clean up listener
    return unsubscribe;
  } catch (error) {
    console.error('Error setting up posts listener:', error);
    if (Platform.OS === 'android') {
      ToastAndroid.show('Error network!', ToastAndroid.SHORT);
    } else {
      // Toast.show({ type: 'error', text1: 'Error network!' });
      console.warn('Error toast not shown on non-Android platform');
    }
    return () => {}; // Return a no-op unsubscribe function in case of setup failure
  }
};

export default getPosts;