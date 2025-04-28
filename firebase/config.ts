import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, browserLocalPersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"
import NetInfo from '@react-native-community/netinfo'

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA6-ImHiytxEhZwTdaVc_VMecnaXCiGGdo",
  authDomain: "mood-diary-f8f6d.firebaseapp.com",
  projectId: "mood-diary-f8f6d",
  storageBucket: "mood-diary-f8f6d.firebasestorage.app",
  messagingSenderId: "650764587534",
  appId: "1:650764587534:web:7343342d85b8fbb16ee25f",
  // Note: removed measurementId as it's not used in React Native
}

// Check network connectivity before initializing Firebase
const checkFirebaseConnectivity = async () => {
  try {
    // First check general internet connectivity
    const netInfo = await NetInfo.fetch();
    if (!netInfo.isConnected) {
      throw new Error('No internet connection');
    }

    // Then check Firebase connectivity using a simpler endpoint
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 5000); // 5 second timeout

    try {
      // Try to connect to Firebase Auth endpoint first
      const response = await fetch('https://identitytoolkit.googleapis.com/v1/accounts:signInWithPassword?key=' + firebaseConfig.apiKey, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: 'test@test.com',
          password: 'test123',
          returnSecureToken: true
        }),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      // Even if the authentication fails, we know Firebase is reachable
      if (response.status === 400) {
        return true; // Firebase is reachable, just invalid credentials
      }

      if (!response.ok) {
        throw new Error(`Firebase server returned status: ${response.status}`);
      }

      return true;
    } catch (error: any) {
      if (error.name === 'AbortError') {
        throw new Error('Connection timed out. Please check your internet connection.');
      }
      throw error;
    }
  } catch (error: any) {
    console.error('Firebase connectivity check failed:', error);
    
    // Provide more specific error messages
    if (error.message.includes('timeout')) {
      throw new Error('Connection timed out. Please check your internet connection.');
    } else if (error.message.includes('network')) {
      throw new Error('Network error. Please check your internet connection.');
    } else if (error.message.includes('No internet connection')) {
      throw new Error('No internet connection detected.');
    } else {
      throw new Error('Unable to connect to Firebase servers. Please try again later.');
    }
  }
};

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: browserLocalPersistence,
})

// Export connectivity check
export const checkConnectivity = checkFirebaseConnectivity;

export default app
