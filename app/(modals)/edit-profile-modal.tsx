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
import { Ionicons } from '@expo/vector-icons';
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
  initialProfileImage = 'https://via.placeholder.com/150',
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
            <TouchableOpacity onPress={onClose}>
              <Ionicons name="close" size={24} color={colors.black} />
            </TouchableOpacity>
            <Text style={styles.headerTitle}>Edit Profile</Text>
            <TouchableOpacity onPress={handleSave}>
              <Text style={styles.saveButton}>Save</Text>
            </TouchableOpacity>
          </View>

          {/* Profile Picture */}
          <View style={styles.profileImageContainer}>
            <TouchableOpacity onPress={handlePickImage}>
              <Image
                source={{ uri: profileImage }}
                style={styles.profileImage}
              />
              <View style={styles.editPhotoOverlay}>
                <Ionicons name="camera" size={24} color={colors.white} />
              </View>
            </TouchableOpacity>
          </View>

          {/* Username Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Username</Text>
            <TextInput
              style={styles.input}
              value={username}
              onChangeText={setUsername}
              placeholder="Enter username"
              placeholderTextColor={colors.mediumGray}
            />
          </View>

          {/* Bio Input */}
          <View style={styles.inputContainer}>
            <Text style={styles.label}>Bio</Text>
            <TextInput
              style={[styles.input, styles.bioInput]}
              value={bio}
              onChangeText={setBio}
              placeholder="Write a bio"
              placeholderTextColor={colors.mediumGray}
              multiline
              numberOfLines={4}
            />
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
    ...typography.heading,
    fontSize: 20,
  },
  saveButton: {
    color: colors.accent,
    ...typography.button,
  },
  profileImageContainer: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  profileImage: {
    width: 150,
    height: 150,
    borderRadius: 75,
  },
  editPhotoOverlay: {
    position: 'absolute',
    bottom: 0,
    right: 0,
    backgroundColor: 'rgba(0,0,0,0.5)',
    borderRadius: 20,
    padding: spacing.s,
  },
  inputContainer: {
    paddingHorizontal: spacing.m,
    marginBottom: spacing.l,
  },
  label: {
    ...typography.body,
    marginBottom: spacing.s,
    color: colors.black,
  },
  input: {
    borderWidth: 1,
    borderColor: colors.inputBorder,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    ...typography.body,
  },
  bioInput: {
    height: 120,
    textAlignVertical: 'top',
  },
});