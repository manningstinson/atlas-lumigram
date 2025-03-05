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
  Image,
  Alert,
  ActivityIndicator
} from 'react-native';
import { useRouter } from 'expo-router';
import { authStyles } from '@/styles/auth';
import { colors } from '@/styles/theme';
import { useAuth } from '../contexts/auth.context';

export default function RegisterScreen() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();
  const { register } = useAuth();

  const handleRegister = async () => {
    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters');
      return;
    }

    try {
      setIsLoading(true);
      await register(email, password);
      // No need to manually redirect - AuthProtection will handle it
    } catch (error: any) {
      Alert.alert('Registration Failed', error.message || 'Could not create account');
    } finally {
      setIsLoading(false);
    }
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
              editable={!isLoading}
            />
            <TextInput
              style={authStyles.input}
              placeholder="Password"
              placeholderTextColor={colors.authText + '80'}
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              autoCapitalize="none"
              editable={!isLoading}
            />
            <TouchableOpacity
              style={[authStyles.primaryButton, isLoading && { opacity: 0.7 }]}
              onPress={handleRegister}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color={colors.white} />
              ) : (
                <Text style={authStyles.primaryButtonText}>Create Account</Text>
              )}
            </TouchableOpacity>
            <TouchableOpacity
              style={authStyles.secondaryButton}
              onPress={navigateToLogin}
              disabled={isLoading}
            >
              <Text style={authStyles.secondaryButtonText}>Login to existing account</Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </TouchableWithoutFeedback>
  );
}