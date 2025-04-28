"use client"
import { NavigationContainer } from "@react-navigation/native"
import { createStackNavigator } from "@react-navigation/stack"
import { ActivityIndicator, View, StyleSheet } from "react-native"

// Auth Screens
import LoginScreen from "../screens/LoginScreen"
import SignupScreen from "../screens/SignupScreen"
import ForgotPasswordScreen from "../screens/ForgotPasswordScreen"

// App Screens
import HomeScreen from "../screens/HomeScreen"
import LogMoodScreen from "../screens/LogMoodScreen"
import HistoryScreen from "../screens/HistoryScreen"

// Auth Context
import { useAuth } from "../contexts/AuthContext"

const Stack = createStackNavigator()

const AuthStack = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Signup" component={SignupScreen} />
      <Stack.Screen name="ForgotPassword" component={ForgotPasswordScreen} />
    </Stack.Navigator>
  )
}

const AppStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Home" component={HomeScreen} options={{ title: "Mood Diary" }} />
      <Stack.Screen name="LogMood" component={LogMoodScreen} options={{ title: "Log Your Mood" }} />
      <Stack.Screen name="History" component={HistoryScreen} options={{ title: "Mood History" }} />
    </Stack.Navigator>
  )
}

export default function AppNavigator() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#6200ee" />
      </View>
    )
  }

  return <NavigationContainer>{user ? <AppStack /> : <AuthStack />}</NavigationContainer>
}

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
  },
})
