// app/_layout.tsx
import React from 'react';
import { Stack } from 'expo-router';
import { AuthProvider } from '../app/contexts/auth.context';
import { AuthProtection } from '../components/AuthProtection';

export default function RootLayout() {
  return (
    <AuthProvider>
      <AuthProtection>
        <Stack>
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen name="(auth)" options={{ headerShown: false }} />
        </Stack>
      </AuthProtection>
    </AuthProvider>
  );
}