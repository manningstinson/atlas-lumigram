import React from 'react';
import { View, Text, SafeAreaView, FlexAlignType } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import PostItem from '@/components/PostItem';
import { placeholderPosts } from '@/utils/placeholder';
import { layout, colors, typography } from '@/styles/theme';

export default function HomeScreen() {
  return (
    <SafeAreaView style={layout.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home Feed</Text>
          <Ionicons 
            name="share-outline" 
            size={24} 
            color={colors.accent} 
          />
        </View>
        <FlashList
          data={placeholderPosts}
          renderItem={({ item }) => <PostItem post={item} />}
          estimatedItemSize={400}
          showsVerticalScrollIndicator={false}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = {
  container: {
    flex: 1,
    backgroundColor: colors.white,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center' as FlexAlignType,
    paddingHorizontal: layout.container.paddingHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.black,
  }
};