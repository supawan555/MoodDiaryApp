import { initializeApp } from "firebase/app"
import { getFirestore } from "firebase/firestore"
import { initializeAuth, getReactNativePersistence } from "firebase/auth"
import AsyncStorage from "@react-native-async-storage/async-storage"

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

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firestore
export const db = getFirestore(app)

// Initialize Auth with AsyncStorage for persistence
export const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(AsyncStorage),
})

export default app
