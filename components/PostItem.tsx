// components/PostItem.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
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
  return (
    <View style={styles.container}>
      <ImageWithGestures 
        source={{ uri: post.imageUrl }} 
        caption={post.caption} 
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  }
});