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
  const router = useRouter();
  const { logout } = useAuth();
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

  const pickImage = async () => {
    // Request permissions
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Permission Required', 'Please allow access to your photo library to select images.');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 0.5, // Reduced quality to minimize file size
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      // Compress and resize the image
      try {
        const manipulatedImage = await ImageManipulator.manipulateAsync(
          result.assets[0].uri,
          [{ resize: { width: 800, height: 800 } }], // Resize to max 800x800
          { 
            compress: 0.5, // Further compress the image
            format: ImageManipulator.SaveFormat.JPEG 
          }
        );
        setImage(manipulatedImage.uri);
      } catch (error) {
        console.error('Image manipulation error:', error);
        Alert.alert('Error', 'Failed to process image. Please try again.');
      }
    }
  };

  const handleSave = async () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to post.');
      return;
    }

    try {
      setIsLoading(true);
      
      // Create a unique filename using timestamp
      const fileName = `post_${Date.now()}.jpg`;
      const storageRef = ref(storage, `posts/${fileName}`);
      
      // Convert image to blob with error handling
      const response = await fetch(image);
      const blob = await response.blob();
      
      // Check blob size and show warning if too large
      if (blob.size > 5 * 1024 * 1024) { // 5MB limit
        Alert.alert('File Too Large', 'Please select a smaller image (max 5MB).');
        setIsLoading(false);
        return;
      }
      
      // Create an AbortController for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30 second timeout
      
      try {
        // Upload the file
        await uploadBytes(storageRef, blob);
        
        // Clear timeout
        clearTimeout(timeoutId);
        
        // Get download URL
        const downloadURL = await getDownloadURL(storageRef);
        
        // Create post in Firestore
        await postService.createPost(downloadURL, caption);
        
        // Reset form
        resetForm();
        
        // Show success message and navigate
        Alert.alert(
          'Success', 
          'Your post has been created successfully!',
          [
            { 
              text: 'OK', 
              onPress: () => {
                router.push('/(tabs)/home');
              }
            }
          ]
        );
      } catch (uploadError) {
        // Clear timeout in case of error
        clearTimeout(timeoutId);
        
        // More specific error handling
        if (uploadError instanceof Error) {
          const errorMessage = uploadError.message.toLowerCase();
          
          if (errorMessage.includes('aborted')) {
            Alert.alert('Timeout', 'Upload took too long. Please check your internet connection.');
          } else if (errorMessage.includes('network')) {
            Alert.alert('Network Error', 'Please check your internet connection.');
          } else if (errorMessage.includes('storage/unauthorized')) {
            Alert.alert('Permission Denied', 'You do not have permission to upload.');
          } else {
            Alert.alert('Error', 'Failed to create post. Please try again.');
          }
          
          console.error('Upload error:', uploadError);
        }
        
        throw uploadError; // Re-throw to be caught by outer catch block
      }
    } catch (error) {
      console.error('Error creating post:', error);
      Alert.alert('Error', 'Failed to create post. Please try again.');
    } finally {
      setIsLoading(false);
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
                    Uploading...
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