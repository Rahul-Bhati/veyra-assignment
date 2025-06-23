import React, { useCallback, useEffect, useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Image, TextInput, Alert, ScrollView, ToastAndroid } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import { Camera, Image as ImageIcon, Smile, MapPin, Tag, Mic, Eye, EyeOff } from 'lucide-react-native';
import { useAuth } from '@/contexts/AuthContext';
import { doc, setDoc } from 'firebase/firestore';
import { db } from '@/services/firebaseConfig';

export default function Create() {
  const router = useRouter();
  // const imageUri = useLocalSearchParams();
  // console.log(imageUri);
  const { user, selectedImage, setSelectedImage, updateProfile } = useAuth();
  const [caption, setCaption] = useState('');
  const [selectedMood, setSelectedMood] = useState<string | null>(null);
  const [location, setLocation] = useState('');
  const [isAnonymous, setIsAnonymous] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState<string | null>(null);

  const moods = [
    { id: 'happy', label: 'Happy', emoji: '😊' },
    { id: 'excited', label: 'Excited', emoji: '🤩' },
    { id: 'relaxed', label: 'Relaxed', emoji: '😌' },
    { id: 'adventurous', label: 'Adventurous', emoji: '🌟' },
    { id: 'sad', label: 'Thoughtful', emoji: '😢' },
  ];

  const filters = [
    { id: 'none', name: 'Original' },
    { id: 'vintage', name: 'Vintage' },
    { id: 'bright', name: 'Bright' },
    { id: 'dramatic', name: 'Dramatic' },
    { id: 'warm', name: 'Warm' },
    { id: 'cool', name: 'Cool' },
  ];

  const handleCameraPress = () => {
    router.push('/camera');
  };

  const handleGalleryPress = () => {
    // Mock image selection
    setSelectedImage('https://images.pexels.com/photos/1229861/pexels-photo-1229861.jpeg?auto=compress&cs=tinysrgb&w=600&h=600');
  };

  const handleShare = async () => {
    if (!selectedImage) {
      ToastAndroid.show("Please select an image first", ToastAndroid.SHORT);
      // Alert.alert('Error', 'Please select an image first');
      return;
    }

    if (!caption.trim()) {
      ToastAndroid.show("Please add a caption", ToastAndroid.SHORT);
      // Alert.alert('Error', 'Please add a caption');
      return;
    }

    if (!selectedImage) {
      ToastAndroid.show('Please select an image', ToastAndroid.SHORT);
      return;
    }

    try {
      const postId = Date.now().toString();
      const postData = {
        userId: user && user.id,
        imageUrl: selectedImage, // Rename selectedImage to imageUrl for clarity
        caption,
        timestamp: new Date(), // Use timestamp to match getPosts query
        likes: 0,
        comments: [],
      };

      // Store post in the posts collection
      await setDoc(doc(db, 'posts', postId), postData);

      // Update user's profile with the post reference
      await updateProfile({ posts: [{ id: postId, imageUrl: selectedImage }] });

      ToastAndroid.show('Post uploaded successfully', ToastAndroid.SHORT);
      // setS(null);
      setCaption('');
      router.replace('/(tabs)'); // Redirect to home feed
    } catch (error) {
      console.error('Post upload error:', error);
      ToastAndroid.show('Failed to upload post', ToastAndroid.SHORT);
    }

    // Mock post creation
    // Alert.alert('Success', 'Your post has been shared!', [
    //   { text: 'OK', onPress: () => router.push('/(tabs)') }
    // ]);
  };

  const handleCancel = () => {
    setSelectedImage(null!);
    router.back();
  }

  useFocusEffect(
    useCallback(() => {
      // Screen is focused; do nothing

      return () => {
        // Screen is unfocused
        setSelectedImage(null!);
      };
    }, [])
  );


  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={handleCancel}>
          <Text style={styles.cancelButton}>Cancel</Text>
        </TouchableOpacity>

        <Text style={styles.title}>New Post</Text>

        <TouchableOpacity onPress={handleShare} style={styles.shareButton}>
          <Text style={styles.shareButtonText}>Share</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image Selection */}
        <View style={styles.imageSection}>
          {selectedImage ? (
            <View style={styles.selectedImageContainer}>
              <Image source={{ uri: selectedImage }} style={styles.selectedImage} />
              <View style={styles.imageActions}>
                <TouchableOpacity
                  style={styles.imageAction}
                  onPress={handleCameraPress}
                >
                  <Camera size={20} color="#fff" />
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.imageAction}
                  onPress={handleGalleryPress}
                >
                  <ImageIcon size={20} color="#fff" />
                </TouchableOpacity>
              </View>
            </View>
          ) : (
            <View style={styles.imagePlaceholder}>
              <View style={styles.imageOptions}>
                <TouchableOpacity
                  style={styles.imageOption}
                  onPress={handleCameraPress}
                >
                  <Camera size={32} color="#666" />
                  <Text style={styles.imageOptionText}>Camera</Text>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.imageOption}
                  onPress={handleGalleryPress}
                >
                  <ImageIcon size={32} color="#666" />
                  <Text style={styles.imageOptionText}>Gallery</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {/* Filters */}
        {selectedImage && (
          <View style={styles.filtersSection}>
            <Text style={styles.sectionTitle}>Filters</Text>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.filters}>
              {filters.map((filter) => (
                <TouchableOpacity
                  key={filter.id}
                  style={[
                    styles.filterItem,
                    selectedFilter === filter.id && styles.selectedFilter
                  ]}
                  onPress={() => setSelectedFilter(filter.id)}
                >
                  <View style={styles.filterPreview}>
                    <Image source={{ uri: selectedImage }} style={styles.filterImage} />
                  </View>
                  <Text style={styles.filterName}>{filter.name}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>
          </View>
        )}

        {/* Caption */}
        <View style={styles.captionSection}>
          <TextInput
            style={styles.captionInput}
            placeholder="Write a caption..."
            multiline
            value={caption}
            onChangeText={setCaption}
            maxLength={500}
          />
          <Text style={styles.characterCount}>{caption.length}/500</Text>
        </View>

        {/* Mood Selection */}
        <View style={styles.moodSection}>
          <Text style={styles.sectionTitle}>How are you feeling?</Text>
          <View style={styles.moods}>
            {moods.map((mood) => (
              <TouchableOpacity
                key={mood.id}
                style={[
                  styles.moodItem,
                  selectedMood === mood.id && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(selectedMood === mood.id ? null : mood.id)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
                <Text style={styles.moodLabel}>{mood.label}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Location */}
        <View style={styles.locationSection}>
          <View style={styles.locationHeader}>
            <MapPin size={20} color="#666" />
            <Text style={styles.sectionTitle}>Add Location</Text>
          </View>
          <TextInput
            style={styles.locationInput}
            placeholder="Where was this taken?"
            value={location}
            onChangeText={setLocation}
          />
        </View>

        {/* Anonymous Toggle */}
        <View style={styles.anonymousSection}>
          <TouchableOpacity
            style={styles.anonymousToggle}
            onPress={() => setIsAnonymous(!isAnonymous)}
          >
            <View style={styles.anonymousInfo}>
              {isAnonymous ? <EyeOff size={20} color="#666" /> : <Eye size={20} color="#666" />}
              <Text style={styles.anonymousLabel}>Post Anonymously</Text>
            </View>
            <View style={[styles.switch, isAnonymous && styles.switchActive]}>
              <View style={[styles.switchThumb, isAnonymous && styles.switchThumbActive]} />
            </View>
          </TouchableOpacity>
          <Text style={styles.anonymousDescription}>
            Your username will be hidden from this post
          </Text>
        </View>
      </ScrollView>
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
  cancelButton: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
  },
  title: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
  },
  shareButton: {
    backgroundColor: '#0095f6',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  shareButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#fff',
  },
  content: {
    flex: 1,
  },
  imageSection: {
    margin: 16,
  },
  selectedImageContainer: {
    position: 'relative',
    aspectRatio: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
  selectedImage: {
    width: '100%',
    height: '100%',
  },
  imageActions: {
    position: 'absolute',
    top: 12,
    right: 12,
    flexDirection: 'row',
  },
  imageAction: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: 8,
  },
  imagePlaceholder: {
    aspectRatio: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  imageOptions: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  imageOption: {
    alignItems: 'center',
    marginHorizontal: 40,
  },
  imageOptionText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#666',
    marginTop: 8,
  },
  filtersSection: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#000',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  filters: {
    paddingLeft: 16,
  },
  filterItem: {
    alignItems: 'center',
    marginRight: 16,
  },
  selectedFilter: {
    opacity: 1,
  },
  filterPreview: {
    width: 60,
    height: 60,
    borderRadius: 8,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  filterImage: {
    width: '100%',
    height: '100%',
  },
  filterName: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
  },
  captionSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  captionInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    padding: 16,
    minHeight: 100,
    textAlignVertical: 'top',
    backgroundColor: '#f9f9f9',
  },
  characterCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#666',
    textAlign: 'right',
    marginTop: 8,
  },
  moodSection: {
    marginBottom: 24,
  },
  moods: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: 16,
  },
  moodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 12,
    marginBottom: 8,
  },
  selectedMood: {
    backgroundColor: '#833AB4',
  },
  moodEmoji: {
    fontSize: 16,
    marginRight: 6,
  },
  moodLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#666',
  },
  locationSection: {
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  locationHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  locationInput: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#000',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#f9f9f9',
  },
  anonymousSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  anonymousToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 12,
  },
  anonymousInfo: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  anonymousLabel: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: '#000',
    marginLeft: 12,
  },
  switch: {
    width: 44,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#ddd',
    padding: 2,
    justifyContent: 'center',
  },
  switchActive: {
    backgroundColor: '#0095f6',
  },
  switchThumb: {
    width: 20,
    height: 20,
    borderRadius: 10,
    backgroundColor: '#fff',
    alignSelf: 'flex-start',
  },
  switchThumbActive: {
    alignSelf: 'flex-end',
  },
  anonymousDescription: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#666',
    marginTop: 4,
    marginLeft: 32,
  },
});