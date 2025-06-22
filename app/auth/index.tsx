import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image, Dimensions } from 'react-native';
import { useRouter } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { Camera, Heart, MessageCircle, Send } from 'lucide-react-native';

const { width, height } = Dimensions.get('window');

export default function AuthIndex() {
  const router = useRouter();

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={['#833AB4', '#FD1D1D', '#FCB045']}
        style={styles.gradient}
      >
        <View style={styles.content}>
          <View style={styles.logoContainer}>
            <Camera size={80} color="white" strokeWidth={1.5} />
            <Text style={styles.appName}>InstaClone</Text>
            <Text style={styles.tagline}>Share your moments</Text>
          </View>

          <View style={styles.featuresContainer}>
            <View style={styles.feature}>
              <Heart size={24} color="white" />
              <Text style={styles.featureText}>Connect with friends</Text>
            </View>
            <View style={styles.feature}>
              <MessageCircle size={24} color="white" />
              <Text style={styles.featureText}>Share your stories</Text>
            </View>
            <View style={styles.feature}>
              <Send size={24} color="white" />
              <Text style={styles.featureText}>Discover new content</Text>
            </View>
          </View>

          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.loginButton}
              onPress={() => router.push('/auth/login')}
            >
              <Text style={styles.loginButtonText}>Log In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.signupButton}
              onPress={() => router.push('/auth/register')}
            >
              <Text style={styles.signupButtonText}>Sign Up</Text>
            </TouchableOpacity>
          </View>
        </View>
      </LinearGradient>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  gradient: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 40,
  },
  logoContainer: {
    alignItems: 'center',
    marginBottom: 60,
  },
  appName: {
    fontSize: 42,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginTop: 20,
    letterSpacing: -1,
  },
  tagline: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: 8,
  },
  featuresContainer: {
    marginBottom: 60,
  },
  feature: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  featureText: {
    fontSize: 16,
    fontFamily: 'Inter-Medium',
    color: 'white',
    marginLeft: 16,
  },
  buttonContainer: {
    width: '100%',
  },
  loginButton: {
    backgroundColor: 'white',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 16,
  },
  loginButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#833AB4',
  },
  signupButton: {
    backgroundColor: 'transparent',
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'white',
  },
  signupButtonText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
});