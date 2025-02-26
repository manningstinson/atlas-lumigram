// app/(tabs)/favorites.tsx
import React from 'react';
import { View, Text, SafeAreaView, FlexAlignType, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PostItem from '@/components/PostItem';
import { favoritesFeed } from '@/utils/placeholder';
import { layout, colors, typography, spacing } from '@/styles/theme';

export default function FavoritesScreen() {
  const router = useRouter();
  
  const handleLogout = () => {
    router.replace('/login');
  };
  
  return (
    <SafeAreaView style={[layout.safeArea, { backgroundColor: colors.appBackground }]}>
      <View style={[styles.container, { backgroundColor: colors.appBackground }]}>
        <View style={[styles.header, { backgroundColor: colors.appBackground }]}>
          <Text style={styles.headerTitle}>Favorites</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
        <FlashList
          data={favoritesFeed}
          renderItem={({ item }) => <PostItem post={item} />}
          estimatedItemSize={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ ...styles.listContent, backgroundColor: colors.appBackground }}
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
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  listContent: {
    paddingBottom: 80, // Add extra padding at the bottom for scrolling
    backgroundColor: colors.appBackground,
  }
});