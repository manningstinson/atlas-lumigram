import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  FlatList,
  Image,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  FlexAlignType
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import { userSearch } from '@/utils/placeholder';
import { layout, colors, typography, spacing } from '@/styles/theme';

export default function SearchScreen() {
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredUsers, setFilteredUsers] = useState(userSearch);
  const router = useRouter();

  const handleLogout = () => {
    router.replace('/login');
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    if (text) {
      const filtered = userSearch.filter(user =>
        user.username.toLowerCase().includes(text.toLowerCase())
      );
      setFilteredUsers(filtered);
    } else {
      setFilteredUsers(userSearch);
    }
  };

  const renderUserItem = ({ item }: { item: any }) => (
    <TouchableOpacity style={styles.userItem}>
      <Image
        source={{ uri: item.avatar }}
        style={styles.avatar}
      />
      <Text style={styles.username}>{item.username}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={[layout.safeArea, { backgroundColor: colors.appBackground }]}>
      <View style={[styles.container, { backgroundColor: colors.appBackground }]}>
        {/* Header - Same layout as other pages */}
        <View style={[styles.header, { backgroundColor: colors.appBackground }]}>
          <Text style={styles.headerTitle}>Search</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
        {/* Search Input */}
        <TextInput
          placeholder="Search users..."
          value={searchQuery}
          onChangeText={handleSearch}
          style={styles.searchInput}
          placeholderTextColor={colors.mediumGray}
        />
        {/* Search Results */}
        <FlatList
          data={filteredUsers}
          renderItem={renderUserItem}
          keyExtractor={item => item.id}
          contentContainerStyle={[styles.listContainer, { backgroundColor: colors.appBackground }]}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.appBackground,
  },
  header: {
    flexDirection: 'row' as 'row',
    justifyContent: 'space-between' as 'space-between',
    alignItems: 'center' as FlexAlignType,
    paddingHorizontal: layout.container.paddingHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.appBackground,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.black,
  },
  searchInput: {
    margin: spacing.m,
    borderWidth: 1,
    borderColor: colors.lightGray,
    borderRadius: layout.borderRadius,
    padding: spacing.m,
    ...typography.body,
    backgroundColor: colors.white,
  },
  listContainer: {
    paddingHorizontal: spacing.m,
    backgroundColor: colors.appBackground,
  },
  userItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: spacing.m,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
    backgroundColor: colors.appBackground,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginRight: spacing.m,
  },
  username: {
    ...typography.body,
    fontWeight: 'bold',
  },
});