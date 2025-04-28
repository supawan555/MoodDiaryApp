"use client"

import React, { useState, useEffect, useCallback } from 'react';
import { StyleSheet, View, Text, TextInput, TouchableOpacity, Alert, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useAuth } from '../contexts/AuthContext';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import NetInfo from '@react-native-community/netinfo';
import { checkConnectivity } from '../firebase/config';

type RootStackParamList = {
  Login: undefined;
  Home: undefined;
  LogMood: undefined;
  History: undefined;
};

type LoginScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Login'>;

interface LoginScreenProps {
  navigation: LoginScreenNavigationProp;
}

const MAX_RETRIES = 3;
const RETRY_DELAY = 2000;

export default function LoginScreen({ navigation }: LoginScreenProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckingConnection, setIsCheckingConnection] = useState(true);
  const [isFirebaseConnected, setIsFirebaseConnected] = useState(false);
  const [retryCount, setRetryCount] = useState(0);
  const { signIn, signUp } = useAuth();

  const checkFirebaseConnection = useCallback(async () => {
    try {
      setIsCheckingConnection(true);
      const connected = await checkConnectivity();
      setIsFirebaseConnected(connected);
      setRetryCount(0);
    } catch (error: any) {
      console.error('Error checking Firebase connection:', error);
      setIsFirebaseConnected(false);
      
      if (retryCount < MAX_RETRIES) {
        const delay = RETRY_DELAY * Math.pow(2, retryCount);
        setTimeout(() => {
          setRetryCount(prev => prev + 1);
          checkFirebaseConnection();
        }, delay);
      } else {
        Alert.alert(
          'Connection Error',
          error.message || 'Failed to connect to Firebase. Would you like to try again or proceed offline?',
          [
            { 
              text: 'Try Again', 
              onPress: () => {
                setRetryCount(0);
                checkFirebaseConnection();
              }
            },
            { 
              text: 'Proceed Offline', 
              onPress: () => {
                setIsFirebaseConnected(true);
                setIsCheckingConnection(false);
              }
            },
            { 
              text: 'Cancel', 
              style: 'cancel' 
            }
          ]
        );
      }
    } finally {
      setIsCheckingConnection(false);
    }
  }, [retryCount]);

  useEffect(() => {
    checkFirebaseConnection();
  }, [checkFirebaseConnection]);

  const handleLogin = async () => {
    if (!isFirebaseConnected) {
      Alert.alert(
        'Connection Error',
        'Please check your internet connection and try again.',
        [
          { 
            text: 'Check Connection', 
            onPress: () => {
              setRetryCount(0);
              checkFirebaseConnection();
            }
          },
          { 
            text: 'Proceed Offline', 
            onPress: () => {
              setIsFirebaseConnected(true);
              handleLogin();
            }
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    try {
      setIsLoading(true);
      await signIn(email, password);
    } catch (error: any) {
      let errorMessage = 'An error occurred during login';
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
        await checkFirebaseConnection();
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async () => {
    if (!isFirebaseConnected) {
      Alert.alert(
        'Connection Error',
        'Please check your internet connection and try again.',
        [
          { 
            text: 'Check Connection', 
            onPress: () => {
              setRetryCount(0);
              checkFirebaseConnection();
            }
          },
          { 
            text: 'Cancel', 
            style: 'cancel' 
          }
        ]
      );
      return;
    }

    if (!email || !password) {
      Alert.alert('Error', 'Please enter both email and password');
      return;
    }

    if (password.length < 6) {
      Alert.alert('Error', 'Password must be at least 6 characters long');
      return;
    }

    try {
      setIsLoading(true);
      await signUp(email, password);
    } catch (error: any) {
      let errorMessage = 'An error occurred during sign up';
      
      if (error.code === 'auth/network-request-failed') {
        errorMessage = 'Network error. Please check your internet connection.';
        await checkFirebaseConnection();
      } else if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try logging in.';
      } else if (error.code === 'auth/invalid-email') {
        errorMessage = 'Invalid email address.';
      } else if (error.code === 'auth/weak-password') {
        errorMessage = 'Password is too weak. Please use a stronger password.';
      }
      
      Alert.alert('Error', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Mood Diary</Text>
        <Text style={styles.subtitle}>Track your emotions</Text>

        {isCheckingConnection ? (
          <View style={styles.connectionStatus}>
            <ActivityIndicator size="large" color="#6200ee" />
            <Text style={styles.connectionText}>
              {retryCount > 0 
                ? `Checking connection (Attempt ${retryCount + 1}/${MAX_RETRIES + 1})...`
                : 'Checking connection...'}
            </Text>
          </View>
        ) : (
          <>
            <TextInput
              style={styles.input}
              placeholder="Email"
              value={email}
              onChangeText={setEmail}
              autoCapitalize="none"
              keyboardType="email-address"
              editable={!isLoading}
            />

            <TextInput
              style={styles.input}
              placeholder="Password"
              value={password}
              onChangeText={setPassword}
              secureTextEntry
              editable={!isLoading}
            />

            <TouchableOpacity 
              style={[styles.button, isLoading && styles.disabledButton]} 
              onPress={handleLogin}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Login</Text>
              )}
            </TouchableOpacity>

            <TouchableOpacity 
              style={[styles.button, styles.signUpButton, isLoading && styles.disabledButton]} 
              onPress={handleSignUp}
              disabled={isLoading}
            >
              {isLoading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Sign Up</Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 10,
    color: '#333',
  },
  subtitle: {
    fontSize: 18,
    textAlign: 'center',
    marginBottom: 40,
    color: '#666',
  },
  connectionStatus: {
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 20,
  },
  connectionText: {
    marginTop: 10,
    color: '#666',
    fontSize: 16,
  },
  input: {
    backgroundColor: '#fff',
    padding: 15,
    borderRadius: 10,
    marginBottom: 15,
    borderWidth: 1,
    borderColor: '#ddd',
  },
  button: {
    backgroundColor: '#6200ee',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 10,
  },
  signUpButton: {
    backgroundColor: '#03dac6',
  },
  disabledButton: {
    opacity: 0.7,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
