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
  StatusBar 
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { colors, spacing, layout } from '@/styles/theme';
import { componentStyles } from '@/styles/components';

export default function AddPostScreen() {
  const [image, setImage] = useState<string | null>(null);
  const [caption, setCaption] = useState('');
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
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
      quality: 1,
    });

    if (!result.canceled && result.assets && result.assets.length > 0) {
      setImage(result.assets[0].uri);
    }
  };

  const handleSave = () => {
    if (!image) {
      Alert.alert('No Image Selected', 'Please select an image to post.');
      return;
    }

    // For now, just show an alert. In the future, this would save the post.
    Alert.alert('Post Created', 'Your post has been created successfully!');
    resetForm();
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
            />

            <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.resetButton} onPress={resetForm}>
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