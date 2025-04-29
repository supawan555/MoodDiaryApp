import React, { useState, useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import { StatusBar } from 'expo-status-bar';
import AsyncStorage from '@react-native-async-storage/async-storage';

import HomeScreen from './screens/HomeScreen';
import NoteScreen from './screens/NoteScreen';
import AnalysisScreen from './screens/AnalysisScreen';

// Create a context for notes data
export const NotesContext = React.createContext();

const Stack = createStackNavigator();

export default function App() {
  const [notes, setNotes] = useState({});
  const [isLoading, setIsLoading] = useState(true);

  // Load notes from storage on app start
  useEffect(() => {
    const loadNotes = async () => {
      try {
        const storedNotes = await AsyncStorage.getItem('notes');
        if (storedNotes !== null) {
          setNotes(JSON.parse(storedNotes));
        }
      } catch (error) {
        console.error('Failed to load notes:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadNotes();
  }, []);

  // Save notes to storage whenever they change
  useEffect(() => {
    const saveNotes = async () => {
      try {
        await AsyncStorage.setItem('notes', JSON.stringify(notes));
      } catch (error) {
        console.error('Failed to save notes:', error);
      }
    };

    if (!isLoading) {
      saveNotes();
    }
  }, [notes, isLoading]);

  // Function to add or update a note
  const saveNote = (date, noteData) => {
    setNotes(prevNotes => ({
      ...prevNotes,
      [date]: noteData
    }));
  };

  // Function to delete a note
  const deleteNote = (date) => {
    setNotes(prevNotes => {
      const updatedNotes = { ...prevNotes };
      delete updatedNotes[date];
      return updatedNotes;
    });
  };

  if (isLoading) {
    return null; // Or a loading screen
  }

  return (
    <NotesContext.Provider value={{ notes, saveNote, deleteNote }}>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Home">
          <Stack.Screen 
            name="Home" 
            component={HomeScreen} 
            options={{ title: 'Daily Notes' }} 
          />
          <Stack.Screen 
            name="Note" 
            component={NoteScreen} 
            options={({ route }) => ({ title: route.params?.title || 'Note' })} 
          />
          <Stack.Screen 
            name="Analysis" 
            component={AnalysisScreen} 
            options={{ title: 'Mood Analysis' }} 
          />
        </Stack.Navigator>
        <StatusBar style="auto" />
      </NavigationContainer>
    </NotesContext.Provider>
  );
}