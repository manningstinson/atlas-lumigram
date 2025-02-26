// app/(tabs)/home.tsx
import React from 'react';
import { View, Text, SafeAreaView, FlexAlignType, TouchableOpacity, StyleSheet } from 'react-native';
import { FlashList } from '@shopify/flash-list';
import { Ionicons } from '@expo/vector-icons';
import { useRouter } from 'expo-router';
import PostItem from '@/components/PostItem';
import { homeFeed } from '@/utils/placeholder';
import { layout, colors, typography, spacing } from '@/styles/theme';

export default function HomeScreen() {
  const router = useRouter();
  
  const handleLogout = () => {
    router.replace('/login');
  };

  return (
    <SafeAreaView style={layout.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.headerTitle}>Home</Text>
          <TouchableOpacity onPress={handleLogout}>
            <Ionicons
              name="log-out-outline"
              size={24}
              color={colors.accent}
            />
          </TouchableOpacity>
        </View>
        <FlashList
          data={homeFeed}
          renderItem={({ item }) => <PostItem post={item} />}
          estimatedItemSize={400}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.listContent}
        />
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: layout.container.paddingHorizontal,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: colors.lightGray,
  },
  headerTitle: {
    ...typography.heading,
    color: colors.black,
  },
  listContent: {
    paddingBottom: 80, // Add extra padding at the bottom for scrolling
  }
});