// app/(tabs)/favorites.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { View, Text, SafeAreaView, TouchableOpacity, StyleSheet, ActivityIndicator, RefreshControl } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PostItem from '@/components/PostItem';
import { layout, colors, typography, spacing } from '@/styles/theme';
import { DocumentData, QueryDocumentSnapshot } from 'firebase/firestore';
import { useAuth } from '../contexts/auth.context';
import { postService, PostWithFavorite } from '../services/post.service';

export default function FavoritesScreen() {
  const [posts, setPosts] = useState<PostWithFavorite[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [lastVisible, setLastVisible] = useState<QueryDocumentSnapshot<DocumentData> | undefined>(undefined);
  const [hasMorePosts, setHasMorePosts] = useState(true);
  
  const router = useRouter();
  const { logout } = useAuth();
  const PAGE_SIZE = 10;

  const handleLogout = async () => {
    try {
      await logout();
      // AuthProtection will handle redirect
    } catch (error) {
      console.error('Error signing out:', error);
    }
  };

  // Fetch favorited posts with pagination
  const fetchFavorites = async (refresh = false) => {
    if ((isLoading || isRefreshing) && !refresh) return;
    
    try {
      refresh ? setIsRefreshing(true) : setIsLoading(true);
      
      const result = await postService.getFavorites(refresh ? undefined : lastVisible, PAGE_SIZE);
      
      if (refresh) {
        setPosts(result.posts);
      } else {
        setPosts(prev => [...prev, ...result.posts]);
      }
      
      setLastVisible(result.lastVisible);
      setHasMorePosts(result.posts.length === PAGE_SIZE);
      
    } catch (error) {
      console.error('Error fetching favorites:', error);
    } finally {
      setIsLoading(false);
      setIsRefreshing(false);
    }
  };

  // Initial load
  useEffect(() => {
    fetchFavorites(true);
  }, []);

  // Handle refresh
  const handleRefresh = useCallback(() => {
    fetchFavorites(true);
  }, []);

  // Handle load more
  const handleLoadMore = () => {
    if (hasMorePosts && !isLoading) {
      fetchFavorites();
    }
  };
  
  // Handle favorite toggle (optional - to update UI immediately after favorite toggle)
  const handleFavoriteToggle = (postId: string, isFavorite: boolean) => {
    if (!isFavorite) {
      // If unfavorited, remove from the favorites list
      setPosts(prev => prev.filter(post => post.id !== postId));
    } else {
      // This shouldn't happen in the favorites tab but included for completeness
      setPosts(prev => 
        prev.map(post => 
          post.id === postId ? { ...post, isFavorite } : post
        )
      );
    }
  };
  
  // Render list empty component
  const renderEmptyComponent = () => (
    <View style={styles.emptyContainer}>
      {!isLoading && (
        <>
          <Ionicons name="heart-outline" size={64} color={colors.mediumGray} />
          <Text style={styles.emptyText}>No favorites yet</Text>
        </>
      )}
    </View>
  );

  // Render footer component
  const renderFooterComponent = () => {
    if (!isLoading || posts.length === 0) return null;
    
    return (
      <View style={styles.footer}>
        <ActivityIndicator size="small" color={colors.accent} />
      </View>
    );
  };

  return (
    <SafeAreaView style={[layout.safeArea, { backgroundColor: colors.appBackground }]}>
      <View style={[styles.container, { backgroundColor: colors.appBackground }]}>
        <View style={styles.header}>
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
          data={posts}
          renderItem={({ item }) => (
            <PostItem post={item} onFavoriteToggle={handleFavoriteToggle} />
          )}
          estimatedItemSize={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
          onEndReached={handleLoadMore}
          onEndReachedThreshold={0.5}
          refreshControl={
            <RefreshControl
              refreshing={isRefreshing}
              onRefresh={handleRefresh}
              colors={[colors.accent]}
              tintColor={colors.accent}
            />
          }
          ListEmptyComponent={renderEmptyComponent}
          ListFooterComponent={renderFooterComponent}
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
  },
  footer: {
    padding: spacing.m,
    alignItems: 'center',
  },
  emptyContainer: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: 100,
  },
  emptyText: {
    ...typography.body,
    color: colors.mediumGray,
    marginTop: spacing.m,
  }
});