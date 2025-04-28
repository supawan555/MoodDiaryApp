import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { AuthProvider, useAuth } from './contexts/AuthContext';

// Import screens
import HomeScreen from './screens/HomeScreen';
import LogMoodScreen from './screens/LogMoodScreen';
import HistoryScreen from './screens/HistoryScreen';
import LoginScreen from './screens/LoginScreen';

// Firebase config - make sure this import works
import './firebase/config';

// Create stack navigator
const Stack = createStackNavigator();

// Navigation component
const Navigation = () => {
  const { user } = useAuth();

  return (
    <Stack.Navigator>
      {user ? (
        // Authenticated stack
        <>
          <Stack.Screen
            name="Home"
            component={HomeScreen}
            options={{ title: 'Mood Diary' }}
          />
          <Stack.Screen
            name="LogMood"
            component={LogMoodScreen}
            options={{ title: 'Log Your Mood' }}
          />
          <Stack.Screen
            name="History"
            component={HistoryScreen}
            options={{ title: 'Mood History' }}
          />
        </>
      ) : (
        // Auth stack
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{ headerShown: false }}
        />
      )}
    </Stack.Navigator>
  );
};

// Main App component
const App = () => {
  return (
    <AuthProvider>
      <SafeAreaProvider>
        {/* StatusBar outside navigation for consistency */}
        <StatusBar style="auto" />
        
        <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      </SafeAreaProvider>
    </AuthProvider>
  );
};

export default App;
