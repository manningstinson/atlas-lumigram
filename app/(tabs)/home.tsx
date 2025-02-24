// app/(tabs)/home.tsx
import React from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import PostItem from '@/components/PostItem';
import { placeholderPosts } from '@/utils/placeholder';
import { Ionicons } from '@expo/vector-icons';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Home Feed</Text>
        <Ionicons name="share-outline" size={24} color="#4fd1c5" />
      </View>
      
      <FlashList
        data={placeholderPosts}
        renderItem={({ item }) => <PostItem post={item} />}
        estimatedItemSize={400}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#f1f1f1',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
  }
});