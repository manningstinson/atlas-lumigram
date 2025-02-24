import React from 'react';
import { Redirect } from 'expo-router';

export default function Index() {
  // For now, redirect to the login screen
  return <Redirect href="/(auth)/login" />;
}
