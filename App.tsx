import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';

// Import screens
import HomeScreen from './screens/HomeScreen';
import LogMoodScreen from './screens/LogMoodScreen';
import HistoryScreen from './screens/HistoryScreen';

// Firebase config - make sure this import works
import './firebase/config';

// Create stack navigator
const Stack = createStackNavigator();

// Main App component
const App = () => {
  return (
    <SafeAreaProvider>
      {/* StatusBar outside navigation for consistency */}
      <StatusBar style="auto" />
      
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
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
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
};

export default App;
