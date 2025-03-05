// app/components/AuthProtection.tsx
import React, { useEffect } from 'react';
import { View, ActivityIndicator } from 'react-native';
import { useRouter, useSegments } from 'expo-router';
import { useAuth } from '../app/contexts/auth.context';
import { colors } from '@/styles/theme';

export function AuthProtection({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const segments = useSegments();
  const router = useRouter();

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === '(auth)';

    if (!user && !inAuthGroup) {
      // Redirect to login
      router.replace('/login');
    } else if (user && inAuthGroup) {
      // Redirect to home if already authenticated
      router.replace('/(tabs)/home');
    }
  }, [user, loading, segments]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: colors.appBackground }}>
        <ActivityIndicator size="large" color={colors.accent} />
      </View>
    );
  }

  return <>{children}</>;
}