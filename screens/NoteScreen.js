import React, { useContext, useState, useEffect } from 'react';
import { 
  StyleSheet, 
  View, 
  TextInput, 
  TouchableOpacity, 
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Text
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { NotesContext } from '../App';

const MOODS = [
  { emoji: '😊', label: 'Happy' },
  { emoji: '😐', label: 'Neutral' },
  { emoji: '😢', label: 'Sad' },
  { emoji: '😡', label: 'Angry' },
  { emoji: '😴', label: 'Tired' }
];

const NoteScreen = ({ route, navigation }) => {
  const { date } = route.params;
  const { notes, saveNote, deleteNote } = useContext(NotesContext);
  const [noteText, setNoteText] = useState('');
  const [selectedMood, setSelectedMood] = useState(null);
  
  // Load existing note if available
  useEffect(() => {
    if (notes[date]) {
      setNoteText(notes[date].text || '');
      setSelectedMood(notes[date].mood || null);
    }
  }, [date, notes]);

  // Save note and go back
  const handleSave = () => {
    saveNote(date, { text: noteText, mood: selectedMood });
    navigation.goBack();
  };

  // Confirm and delete note
  const handleDelete = () => {
    if (!noteText.trim() && !selectedMood) {
      navigation.goBack();
      return;
    }
    
    Alert.alert(
      "Delete Note",
      "Are you sure you want to delete this note?",
      [
        { text: "Cancel", style: "cancel" },
        { 
          text: "Delete", 
          onPress: () => {
            deleteNote(date);
            navigation.goBack();
          },
          style: "destructive"
        }
      ]
    );
  };

  return (
    <KeyboardAvoidingView 
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      keyboardVerticalOffset={Platform.OS === "ios" ? 64 : 0}
    >
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.moodContainer}>
          <Text style={styles.moodLabel}>How are you feeling today?</Text>
          <View style={styles.moodButtons}>
            {MOODS.map((mood) => (
              <TouchableOpacity
                key={mood.label}
                style={[
                  styles.moodButton,
                  selectedMood === mood.emoji && styles.selectedMood
                ]}
                onPress={() => setSelectedMood(mood.emoji)}
              >
                <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <TextInput
          style={styles.noteInput}
          multiline
          value={noteText}
          onChangeText={setNoteText}
          placeholder="Write your note here..."
          autoFocus
        />
      </ScrollView>
      
      <View style={styles.buttonContainer}>
        <TouchableOpacity style={styles.deleteButton} onPress={handleDelete}>
          <Ionicons name="trash-outline" size={24} color="white" />
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
          <Ionicons name="save-outline" size={24} color="white" />
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
    padding: 15,
  },
  moodContainer: {
    marginBottom: 20,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  moodLabel: {
    fontSize: 16,
    marginBottom: 10,
    color: '#333',
  },
  moodButtons: {
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  moodButton: {
    padding: 10,
    borderRadius: 20,
    backgroundColor: '#f0f0f0',
  },
  selectedMood: {
    backgroundColor: '#50cebb',
  },
  moodEmoji: {
    fontSize: 24,
  },
  noteInput: {
    flex: 1,
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    minHeight: 300,
    fontSize: 16,
    color: '#333',
    textAlignVertical: 'top',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 15,
  },
  saveButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#50cebb',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
  deleteButton: {
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#ff6b6b',
    borderRadius: 28,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default NoteScreen;