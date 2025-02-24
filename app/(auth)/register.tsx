// app/(auth)/register.tsx
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

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();

  const handleRegister = () => {
    // Navigate to home tab without authentication for now
    router.replace('/(tabs)/home');
  };

  const navigateToLogin = () => {
    router.push('/login');
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
          
          <Text style={authStyles.screenTitle}>Register</Text>
          
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
              onPress={handleRegister}
            >
              <Text style={authStyles.primaryButtonText}>Create Account</Text>
            </TouchableOpacity>
            
            <TouchableOpacity 
              style={authStyles.secondaryButton} 
              onPress={navigateToLogin}
            >
              <Text style={authStyles.secondaryButtonText}>Login to existing account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}