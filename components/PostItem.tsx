import React from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import ImageWithGestures from './ImageWithGestures';

interface PostItemProps {
  post: {
    id: string;
    imageUrl: string;
    caption: string;
    username: string;
    likes?: number;
  };
}

export default function PostItem({ post }: PostItemProps) {
  const handleDoubleTap = () => {
    Alert.alert(
      'Added to Favorites', 
      'This image has been added to your favorites.', 
      [{ text: 'OK' }]
    );
  };

  const handleLongPress = () => {
    // Existing long press logic
    console.log('Long press detected');
  };

  return (
    <View style={styles.container}>
      <ImageWithGestures
        source={{ uri: post.imageUrl }}
        caption={post.caption}
        onDoubleTap={handleDoubleTap}
        onLongPress={handleLongPress}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    borderRadius: 8,
  }
});