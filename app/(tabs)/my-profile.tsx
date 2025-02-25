import React from 'react';
import { 
  View, 
  Text, 
  Image, 
  TouchableOpacity, 
  StyleSheet, 
  Dimensions 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { FlatList } from 'react-native-gesture-handler';
import { profileFeed } from '@/utils/placeholder';
import { layout, colors, typography } from '@/styles/theme';

const { width } = Dimensions.get('window');
const numColumns = 3;
const itemSize = width / numColumns;

export default function ProfileScreen() {
  const navigation = useNavigation();

  const handleEditProfile = () => {
    // Navigate to edit profile screen
    // You'll need to create this screen and add navigation
    // navigation.navigate('EditProfile');
    console.log('Edit Profile Pressed');
  };

  const renderPostGridItem = ({ item }: { item: any }) => (
    <TouchableOpacity>
      <Image 
        source={{ uri: item.imageUrl }} 
        style={styles.gridImage} 
      />
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Export/Share Icon */}
      <View style={styles.headerIcons}>
        <TouchableOpacity>
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={colors.black} 
          />
        </TouchableOpacity>
      </View>

      {/* Profile Section */}
      <View style={styles.profileSection}>
        <TouchableOpacity onPress={handleEditProfile}>
          <Image 
            source={{ uri: "https://placedog.net/400x400?id=1" }} 
            style={styles.profileImage} 
          />
        </TouchableOpacity>
        <Text style={styles.username}>manning-stinson</Text>
      </View>

      {/* Posts Grid */}
      <FlatList
        data={profileFeed}
        renderItem={renderPostGridItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
        style={styles.gridContainer}
        contentContainerStyle={styles.gridContentContainer}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  headerIcons: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    padding: 15,
  },
  profileSection: {
    alignItems: 'center',
    marginBottom: 20,
  },
  profileImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    marginBottom: 10,
  },
  username: {
    ...typography.body, // Changed from subheading to body
    color: colors.black,
    fontWeight: 'bold', // Added to make it more prominent
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
  }
});