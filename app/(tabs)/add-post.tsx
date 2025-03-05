// app/(tabs)/add-post.tsx
import React, { useState } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  Image, 
  TextInput, 
  TouchableOpacity, 
  Alert, 
  ScrollView,
  SafeAreaView,
  ActivityIndicator
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import * as FileSystem from 'expo-file-system';
import * as ImageManipulator from 'expo-image-manipulator';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, layout } from '@/styles/theme';
import { componentStyles } from '@/styles/components';
import { getStorage, ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { app } from '../../firebaseConfig';
import { useAuth } from '../contexts/auth.context';
import { postService } from '../services/post.service';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const router = useRouter();
  const { logout, user } = useAuth();
  const storage = getStorage(app);

  const handleLogout = async () => {
    try {
      await logout();
      // AuthProtection will handle redirect
    } catch (error) {
      console.error('Error logging out:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  // Image compression function
  const compressImage = async (uri: string): Promise<string> => {
    try {
      // Get file info
      const fileInfo = await FileSystem.getInfoAsync(uri, { size: true });
      console.log(`Original file info:`, fileInfo);
      
      // Check if file exists and has size info
      if (!fileInfo.exists) {
        console.log('File does not exist');
        return uri;
      }
      
      // Access size property with type assertion
      const fileSize = (fileInfo as any).size;
      console.log(`Original file size: ${fileSize} bytes`);
      
      // If file size is less than 300KB, don't compress
      if (!fileSize || fileSize < 300 * 1024) {
        console.log('Image is already small enough');
        return uri;
      }
      
      // Calculate compression ratio based on file size
      let compressionRatio = 0.7; // Default
      if (fileSize > 1000 * 1024) {
        compressionRatio = 0.3; // Higher compression for very large files
      } else if (fileSize > 500 * 1024) {
        compressionRatio = 0.5; // Medium compression for medium-sized files
      }
      
      console.log(`Compressing image with ratio: ${compressionRatio}`);
      
      // Use ImageManipulator for compression
      const result = await ImageManipulator.manipulateAsync(
        uri,
        [], // No resize operations
        { compress: compressionRatio, format: ImageManipulator.SaveFormat.JPEG }
      );
      
      // Check new file size
      const compressedInfo = await FileSystem.getInfoAsync(result.uri, { size: true });
      const compressedSize = (compressedInfo as any).size;
      console.log(`Compressed file size: ${compressedSize} bytes`);
      
      return result.uri;
    } catch (error) {
      console.error('Error compressing image:', error);
      // Return original if compression fails
      return uri;
    }
  };

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
      return;
    }

    // Launch image picker with correct media type
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: "images", // lowercase "images" instead of "Images"
        allowsEditing: true,
        aspect: [1, 1],
        quality: 0.8,
      });

      if (!result.canceled && result.assets && result.assets.length > 0) {
        setImage(result.assets[0].uri);
      }
    } catch (error) {
      console.error('Error picking image:', error);
      Alert.alert('Error', 'Failed to select image. Please try again.');
    }
  };

  const handleSave = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to post.');
      return;
    }

    try {
      setIsLoading(true);
      setUploadProgress(10);
      
      console.log('Starting upload process...');
      
      // Compress the image before uploading
      console.log('Compressing image...');
      const compressedImageUri = await compressImage(image);
      setUploadProgress(30);
      
      // 1. Upload image to Firebase Storage
      const response = await fetch(compressedImageUri);
      const blob = await response.blob();
      
      // Create a unique filename using timestamp
      const fileName = `post_${Date.now()}`;
      const storageRef = ref(storage, `posts/${fileName}`);
      
      console.log('Uploading image to Firebase...');
      // Upload the file
      setUploadProgress(50);
      await uploadBytes(storageRef, blob);
      
      console.log('Getting download URL...');
      setUploadProgress(70);
      // Get download URL
      const downloadURL = await getDownloadURL(storageRef);
      
      console.log('Creating post in Firestore...');
      setUploadProgress(90);
      
      // 2. Create post in Firestore with username derived from email
      const username = user?.email?.split('@')[0] || 'anonymous';
      await postService.createPost(downloadURL, caption);
      
      console.log('Post created successfully!');
      setUploadProgress(100);
      
      // Reset form before showing alert
      resetForm();
      
      // Show success message, then navigate
      Alert.alert(
        'Success', 
        'Your post has been created successfully!',
        [
          { 
            text: 'OK', 
            onPress: () => {
              console.log('Navigating to home...');
              router.push('/(tabs)/home');
            }
          }
        ]
      );
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
      setUploadProgress(0);
    }
  };

  const resetForm = () => {
    setImage(null);
    setCaption('');
  };

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.appBackground }]}>
      <View style={[styles.container, { backgroundColor: colors.appBackground }]}>
        <View style={[styles.header, { backgroundColor: colors.appBackground }]}>
          <Text style={styles.headerTitle}>Add Post</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons name="log-out-outline" size={24} color={colors.accent} />
          </TouchableOpacity>
        </View>

        <ScrollView 
          style={[styles.scrollView, { backgroundColor: colors.appBackground }]}
          contentContainerStyle={{ backgroundColor: colors.appBackground }}
        >
          <View style={[styles.content, { backgroundColor: colors.appBackground }]}>
            <TouchableOpacity 
              style={styles.imageContainer} 
              onPress={pickImage}
              disabled={isLoading}
            >
              {image ? (
                <Image 
                  source={{ uri: image }} 
                  style={styles.image} 
                  resizeMode="cover"
                />
              ) : (
                <View style={styles.placeholderContainer}>
                  <Ionicons name="add-circle-outline" size={40} color="#aaa" />
                  <Text style={styles.placeholderText}>Tap to select an image</Text>
                </View>
              )}
            </TouchableOpacity>

            <TextInput
              style={styles.captionInput}
              placeholder="Add a caption"
              value={caption}
              onChangeText={setCaption}
              multiline
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.saveButton, isLoading && { opacity: 0.7 }]} 
              onPress={handleSave}
              disabled={isLoading}
            >
              {isLoading ? (
                <View>
                  <ActivityIndicator color={colors.white} />
                  <Text style={[styles.saveButtonText, { marginTop: 5, fontSize: 14 }]}>
                    {uploadProgress < 100 ? `Uploading... ${uploadProgress}%` : 'Processing...'}
                  </Text>
                </View>
              ) : (
                <Text style={styles.saveButtonText}>Save</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={styles.resetButton} 
              onPress={resetForm}
              disabled={isLoading}
            >
              <Text style={styles.resetButtonText}>Reset</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: spacing.l,
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
    backgroundColor: colors.appBackground,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: colors.black,
  },
  scrollView: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  content: {
    padding: spacing.l,
    backgroundColor: colors.appBackground,
  },
  imageContainer: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    overflow: 'hidden',
    marginBottom: spacing.l,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderText: {
    marginTop: spacing.s,
    color: colors.mediumGray,
  },
  captionInput: {
    backgroundColor: colors.white,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    minHeight: 50,
    marginBottom: spacing.l,
  },
  saveButton: {
    backgroundColor: colors.accent,
    padding: spacing.l,
    borderRadius: layout.borderRadius,
    alignItems: 'center',
    marginBottom: spacing.m,
  },
  saveButtonText: {
    color: colors.white,
    fontSize: 18,
    fontWeight: '600',
  },
  resetButton: {
    padding: spacing.l,
    borderRadius: layout.borderRadius,
    alignItems: 'center',
    backgroundColor: colors.appBackground,
  },
  resetButtonText: {
    color: colors.darkGray,
    fontSize: 16,
  },
});