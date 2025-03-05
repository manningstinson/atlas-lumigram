import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Image, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { layout, colors, typography, spacing } from '@/styles/theme';
import { Post, PostWithFavorite } from '../app/services/post.service';
import { postService } from '../app/services/post.service';
import ImageWithGestures from './ImageWithGestures';

interface PostItemProps {
  post: Post | PostWithFavorite;
  onFavoriteToggle?: (postId: string, isFavorite: boolean) => void;
}

export default function PostItem({ post, onFavoriteToggle }: PostItemProps) {
  const [isFavorite, setIsFavorite] = useState('isFavorite' in post ? post.isFavorite : false);
  const [isTogglingFavorite, setIsTogglingFavorite] = useState(false);
  
  // Format date (can be adjusted based on your needs)
  const formatDate = (timestamp: any) => {
    if (!timestamp) return '';
    
    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp);
      return date.toLocaleDateString();
    } catch (error) {
      console.error('Error formatting date:', error);
      return '';
    }
  };
  
  const handleFavoriteToggle = async () => {
    if (isTogglingFavorite || !post.id) return;
    
    setIsTogglingFavorite(true);
    
    try {
      const newFavoriteStatus = await postService.toggleFavorite(post.id);
      setIsFavorite(newFavoriteStatus);
      
      // Callback to parent component if provided
      if (onFavoriteToggle) {
        onFavoriteToggle(post.id, newFavoriteStatus);
      }
    } catch (error) {
      console.error('Error toggling favorite:', error);
      // Optional: Show an error alert
      Alert.alert('Error', 'Failed to update favorite status');
      
      // Revert UI state on error
      setIsFavorite('isFavorite' in post ? post.isFavorite : false);
    } finally {
      setIsTogglingFavorite(false);
    }
  };
  
  const handleDoubleTap = () => {
    if (!isFavorite) {
      handleFavoriteToggle();
    }
  };
  
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.username}>{post.username || 'Anonymous'}</Text>
        <Text style={styles.date}>{formatDate(post.createdAt)}</Text>
      </View>
      
      <ImageWithGestures
        source={{ uri: post.imageUrl }}
        caption={post.caption}
        onDoubleTap={handleDoubleTap}
        onLongPress={() => {}}
      />
      
      <View style={styles.footer}>
        {isTogglingFavorite ? (
          <ActivityIndicator 
            size="small" 
            color={colors.accent} 
            style={styles.favoriteButton} 
          />
        ) : (
          <TouchableOpacity 
            style={styles.favoriteButton} 
            onPress={handleFavoriteToggle}
            disabled={isTogglingFavorite}
          >
            <Ionicons 
              name={isFavorite ? "heart" : "heart-outline"} 
              size={24} 
              color={isFavorite ? colors.accent : colors.darkGray} 
            />
          </TouchableOpacity>
        )}
        <Text style={styles.caption}>{post.caption}</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.white,
    borderRadius: layout.borderRadius,
    marginHorizontal: spacing.m,
    marginVertical: spacing.s,
    shadowColor: colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    overflow: 'hidden',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: spacing.m,
  },
  username: {
    ...typography.body,
    fontWeight: '600',
  },
  date: {
    color: colors.mediumGray,
    fontSize: 12,
  },
  footer: {
    padding: spacing.m,
  },
  favoriteButton: {
    marginBottom: spacing.s,
  },
  caption: {
    ...typography.body,
  },
});