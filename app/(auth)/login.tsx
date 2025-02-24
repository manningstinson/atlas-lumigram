// app/(auth)/login.tsx
import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  TouchableWithoutFeedback,
  Keyboard,
  Image
} from 'react-native';
import { useRouter } from 'expo-router';
import { authStyles } from '@/styles/auth';
import { colors } from '@/styles/theme';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleLogin = () => {
    // Navigate to home tab without authentication for now
    router.replace('/(tabs)/home');
  };

  const navigateToRegister = () => {
    router.push('/register');
  };

  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <KeyboardAvoidingView 
        style={authStyles.container} 
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <View style={authStyles.innerContainer}>
          <View style={authStyles.logoContainer}>
            <Image
              source={require('@/assets/images/logo.png')}
              style={authStyles.logo}
              resizeMode="contain"
            />
          </View>
          
          <Text style={authStyles.screenTitle}>Login</Text>
          
          <View style={authStyles.formContainer}>
            <TextInput
              style={authStyles.input}
              placeholder="Email"
              placeholderTextColor={colors.authText + '80'}
              value={email}
              onChangeText={setEmail}
              keyboardType="email-address"
              autoCapitalize="none"
            />
            
            <TextInput
              style={authStyles.input}
              placeholder="Password"
              placeholderTextColor={colors.authText + '80'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
            />
            
            <TouchableOpacity 
              style={authStyles.primaryButton} 
              onPress={handleLogin}
            >
              <Text style={authStyles.primaryButtonText}>Sign in</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={authStyles.secondaryButton} 
              onPress={navigateToRegister}
            >
              <Text style={authStyles.secondaryButtonText}>Create a new account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}