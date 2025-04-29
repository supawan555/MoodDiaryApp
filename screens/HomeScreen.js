import React, { useContext, useState } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  TouchableOpacity, 
  FlatList, 
  SafeAreaView 
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import { Ionicons } from '@expo/vector-icons';
import { NotesContext } from '../App';

const HomeScreen = ({ navigation }) => {
  const { notes } = useContext(NotesContext);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
  
  // Format date for display (e.g., "Monday, January 1, 2023")
  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Get all dates that have notes
  const markedDates = {};
  Object.keys(notes).forEach(date => {
    markedDates[date] = { 
      marked: true,
      dotColor: '#50cebb',
      customStyles: {
        container: {
          backgroundColor: 'transparent',
          justifyContent: 'center',
          alignItems: 'center',
        },
        text: {
          color: '#2d4150',
          fontSize: 12,
        }
      }
    };
  });
  
  // Add selected date marker
  markedDates[selectedDate] = { 
    ...markedDates[selectedDate],
    selected: true, 
    selectedColor: '#50cebb',
    customStyles: {
      container: {
        backgroundColor: '#50cebb',
        borderRadius: 20,
      },
      text: {
        color: 'white',
      }
    }
  };

  // Get notes for the selected date
  const selectedDateNote = notes[selectedDate] || { text: '', mood: null };
  
  // Create a preview of the note (first 100 characters)
  const notePreview = selectedDateNote.text.length > 100 
    ? `${selectedDateNote.text.substring(0, 100)}...` 
    : selectedDateNote.text;

  // Custom day component to show mood emoji
  const renderDay = ({ date, state, onPress }) => {
    const dateString = date.dateString;
    const note = notes[dateString];
    const isSelected = dateString === selectedDate;
    
    return (
      <TouchableOpacity
        onPress={() => onPress(date)}
        style={[
          styles.dayContainer,
          isSelected && styles.selectedDayContainer
        ]}
      >
        <Text style={[
          styles.dayText,
          note?.mood && styles.emojiText,
          isSelected && styles.selectedDayText,
          state === 'disabled' && styles.disabledDayText
        ]}>
          {note?.mood ? note.mood : date.day}
        </Text>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <Calendar
        onDayPress={day => setSelectedDate(day.dateString)}
        markedDates={markedDates}
        dayComponent={renderDay}
        theme={{
          calendarBackground: '#ffffff',
          textSectionTitleColor: '#b6c1cd',
          selectedDayBackgroundColor: '#50cebb',
          selectedDayTextColor: '#ffffff',
          todayTextColor: '#50cebb',
          dayTextColor: '#2d4150',
          textDisabledColor: '#d9e1e8',
          dotColor: '#50cebb',
          selectedDotColor: '#ffffff',
          arrowColor: '#50cebb',
          monthTextColor: '#2d4150',
          indicatorColor: '#50cebb',
        }}
      />
      
      <View style={styles.noteContainer}>
        <View style={styles.headerContainer}>
          <Text style={styles.dateHeader}>{formatDate(selectedDate)}</Text>
          <TouchableOpacity
            style={styles.analysisButton}
            onPress={() => navigation.navigate('Analysis', { selectedDate })}
          >
            <Ionicons name="bar-chart-outline" size={24} color="white" />
          </TouchableOpacity>
        </View>
        
        {selectedDateNote.text ? (
          <TouchableOpacity
            style={styles.notePreview}
            onPress={() => navigation.navigate('Note', { date: selectedDate, title: formatDate(selectedDate) })}
          >
            <View style={styles.noteHeader}>
              {selectedDateNote.mood && (
                <Text style={styles.moodEmoji}>{selectedDateNote.mood}</Text>
              )}
              <Text style={styles.noteText}>{notePreview}</Text>
            </View>
          </TouchableOpacity>
        ) : (
          <View style={styles.emptyNote}>
            <Text style={styles.emptyNoteText}>No notes for this date</Text>
          </View>
        )}
      </View>
      
      <TouchableOpacity
        style={styles.fab}
        onPress={() => navigation.navigate('Note', { date: selectedDate, title: formatDate(selectedDate) })}
      >
        <Ionicons name={selectedDateNote.text ? "create-outline" : "add"} size={24} color="white" />
      </TouchableOpacity>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  noteContainer: {
    flex: 1,
    padding: 15,
  },
  dateHeader: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
    color: '#2d4150',
  },
  notePreview: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    minHeight: 100,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  noteText: {
    fontSize: 16,
    color: '#333',
  },
  emptyNote: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    minHeight: 100,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyNoteText: {
    fontSize: 16,
    color: '#999',
  },
  fab: {
    position: 'absolute',
    width: 56,
    height: 56,
    alignItems: 'center',
    justifyContent: 'center',
    right: 20,
    bottom: 20,
    backgroundColor: '#50cebb',
    borderRadius: 28,
    elevation: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.3,
    shadowRadius: 3,
  },
  noteHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 10,
  },
  dayContainer: {
    width: 32,
    height: 32,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 1,
  },
  selectedDayContainer: {
    backgroundColor: '#50cebb',
    borderRadius: 16,
  },
  dayText: {
    fontSize: 16,
    color: '#2d4150',
  },
  emojiText: {
    fontSize: 20,
  },
  selectedDayText: {
    color: 'white',
  },
  disabledDayText: {
    color: '#d9e1e8',
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  analysisButton: {
    backgroundColor: '#50cebb',
    width: 40,
    height: 40,
    borderRadius: 20,
    justifyContent: 'center',
    alignItems: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
  },
});

export default HomeScreen;