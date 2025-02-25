import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  SafeAreaView,
  FlexAlignType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { profileFeed } from '@/utils/placeholder';
import { layout, colors, typography, spacing } from '@/styles/theme';
import EditProfileModal from '../(modals)/edit-profile-modal';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemSize = width / numColumns;

export default function MyProfileScreen() {
  const [isEditProfileModalVisible, setIsEditProfileModalVisible] = useState(false);
  const [username, setUsername] = useState('manning-stinson');
  const [bio, setBio] = useState('');
  const [profileImage, setProfileImage] = useState('https://placedog.net/400x400?id=1');

  const handleEditProfile = () => {
    setIsEditProfileModalVisible(true);
  };

  const handleCloseEditProfile = () => {
    setIsEditProfileModalVisible(false);
  };

  const handleSaveProfile = (newUsername: string, newBio: string, newProfileImage?: string) => {
    setUsername(newUsername);
    setBio(newBio);
    if (newProfileImage) {
      setProfileImage(newProfileImage);
    }
  };

  const renderPostGridItem = ({ item }: { item: any }) => (
    <Image
      source={{ uri: item.imageUri || item.imageUrl }}
      style={styles.gridImage}
      resizeMode="cover"
    />
  );

  return (
    <SafeAreaView style={layout.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>My Profile</Text>
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={colors.accent} 
          />
        </View>

        <FlatList
          ListHeaderComponent={
            <View style={styles.profileSection}>
              <TouchableOpacity onPress={handleEditProfile}>
                <Image
                  source={{ uri: profileImage }}
                  style={styles.profileImage}
                />
              </TouchableOpacity>
              <Text style={styles.username}>{username}</Text>
              {bio.length > 0 && <Text style={styles.bio}>{bio}</Text>}
            </View>
          }
          data={profileFeed}
          renderItem={renderPostGridItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
          style={styles.gridContainer}
          contentContainerStyle={styles.gridContentContainer}
          showsVerticalScrollIndicator={false}
        />
      </View>

      {/* Edit Profile Modal */}
      <EditProfileModal
        isVisible={isEditProfileModalVisible}
        onClose={handleCloseEditProfile}
        initialUsername={username}
        initialBio={bio}
        initialProfileImage={profileImage}
        onSave={handleSaveProfile}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as FlexAlignType,
    paddingHorizontal: layout.container.paddingHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.black,
  },
  profileSection: {
    alignItems: 'center',
    marginVertical: spacing.xl,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: spacing.m,
  },
  username: {
    ...typography.heading,
    fontSize: 20,
    marginBottom: spacing.s,
  },
  bio: {
    ...typography.body,
    color: colors.mediumGray,
    textAlign: 'center',
    paddingHorizontal: spacing.m,
    marginBottom: spacing.m,
  },
  gridContainer: {
    flex: 1,
  },
  gridContentContainer: {
    paddingHorizontal: 2,
  },
  gridImage: {
    width: itemSize - 4,
    height: itemSize - 4,
    margin: 2,
  },
});