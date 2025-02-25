import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Modal,
  SafeAreaView,
  Alert,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { colors, layout, typography, spacing } from '@/styles/theme';

interface EditProfileModalProps {
  isVisible: boolean;
  onClose: () => void;
  initialUsername?: string;
  initialBio?: string;
  initialProfileImage?: string;
  onSave?: (username: string, bio: string, profileImage?: string) => void;
}

export default function EditProfileModal({
  isVisible,
  onClose,
  initialUsername = '',
  initialBio = '',
  initialProfileImage = 'https://placedog.net/400x400?id=1',
  onSave
}: EditProfileModalProps) {
  const [username, setUsername] = useState(initialUsername);
  const [bio, setBio] = useState(initialBio);
  const [profileImage, setProfileImage] = useState(initialProfileImage);

  const handleSave = () => {
    // Basic validation
    if (username.trim().length === 0) {
      Alert.alert('Error', 'Username cannot be empty');
      return;
    }

    // Call onSave prop if provided
    onSave && onSave(username, bio, profileImage);
    onClose();
  };

  const handlePickImage = async () => {
    // Request permission to access camera roll
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    
    if (status !== 'granted') {
      Alert.alert('Sorry', 'We need camera roll permissions to make this work');
      return;
    }

    // Launch image picker
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [1, 1],
      quality: 1,
    });

    if (!result.canceled) {
      setProfileImage(result.assets[0].uri);
    }
  };

  return (
    <Modal
      animationType="slide"
      transparent={false}
      visible={isVisible}
      onRequestClose={onClose}
    >
      <SafeAreaView style={styles.container}>
        <KeyboardAvoidingView 
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          style={styles.keyboardContainer}
        >
          {/* Header */}
          <View style={styles.header}>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave} style={styles.saveButton}>
              <Text style={styles.saveButtonText}>Save</Text>
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Profile Picture */}
            <TouchableOpacity 
              style={styles.profileImageContainer}
              onPress={handlePickImage}
            >
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
            </TouchableOpacity>

            {/* Username Input */}
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Username"
              placeholderTextColor={colors.mediumGray}
            />

            {/* Save Profile Button - Moved higher up */}
            <TouchableOpacity 
              style={styles.saveProfileButton}
              onPress={handleSave}
            >
              <Text style={styles.saveProfileButtonText}>Save profile</Text>
            </TouchableOpacity>
          </View>
        </KeyboardAvoidingView>
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  keyboardContainer: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  saveButton: {
    padding: spacing.s,
  },
  saveButtonText: {
    color: colors.accent,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    padding: spacing.m,
    alignItems: 'center',
  },
  profileImageContainer: {
    marginVertical: spacing.l,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
  },
  input: {
    width: '100%',
    height: 50,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: layout.borderRadius,
    paddingHorizontal: spacing.m,
    marginBottom: spacing.l,
  },
  saveProfileButton: {
    width: '100%',
    height: 50,
    backgroundColor: colors.accent,
    borderRadius: layout.borderRadius,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: spacing.m, // Changed from 'auto' to spacing.m to position it just below the username
    marginBottom: spacing.l,
  },
  saveProfileButtonText: {
    color: colors.white,
    fontWeight: 'bold',
  },
});