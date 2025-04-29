import React, { useContext } from 'react';
import { 
  StyleSheet, 
  View, 
  Text, 
  SafeAreaView,
  ScrollView
} from 'react-native';
import { NotesContext } from '../App';

const AnalysisScreen = ({ route }) => {
  const { selectedDate } = route.params;
  const { notes } = useContext(NotesContext);

  // Format month for display (e.g., "January 2024")
  const formatMonth = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  };

  // Calculate mood statistics for selected month
  const calculateMoodStats = () => {
    const moodCounts = {};
    let totalEntries = 0;

    // Get the month and year from the selected date
    const selectedMonth = new Date(selectedDate).getMonth();
    const selectedYear = new Date(selectedDate).getFullYear();

    Object.entries(notes).forEach(([date, note]) => {
      const noteDate = new Date(date);
      // Only count notes from the selected month and year
      if (noteDate.getMonth() === selectedMonth && 
          noteDate.getFullYear() === selectedYear && 
          note.mood) {
        moodCounts[note.mood] = (moodCounts[note.mood] || 0) + 1;
        totalEntries++;
      }
    });

    return { moodCounts, totalEntries };
  };

  const { moodCounts, totalEntries } = calculateMoodStats();

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.scrollContainer}>
        <View style={styles.statsContainer}>
          <Text style={styles.title}>Mood Analysis</Text>
          <Text style={styles.monthTitle}>{formatMonth(selectedDate)}</Text>
          <Text style={styles.subtitle}>Total Entries: {totalEntries}</Text>
          
          {totalEntries > 0 ? (
            Object.entries(moodCounts).map(([mood, count]) => (
              <View key={mood} style={styles.moodStatRow}>
                <Text style={styles.moodEmoji}>{mood}</Text>
                <Text style={styles.moodCount}>{count}</Text>
                <Text style={styles.moodPercentage}>
                  {Math.round((count / totalEntries) * 100)}%
                </Text>
              </View>
            ))
          ) : (
            <View style={styles.emptyState}>
              <Text style={styles.emptyStateText}>
                No mood entries for this month
              </Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  scrollContainer: {
    flex: 1,
  },
  statsContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2d4150',
    marginBottom: 5,
  },
  monthTitle: {
    fontSize: 20,
    color: '#50cebb',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: '#666',
    marginBottom: 20,
  },
  moodStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 8,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  moodEmoji: {
    fontSize: 24,
    marginRight: 15,
  },
  moodCount: {
    fontSize: 18,
    color: '#2d4150',
    marginRight: 15,
  },
  moodPercentage: {
    fontSize: 18,
    color: '#50cebb',
    fontWeight: 'bold',
  },
  emptyState: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 8,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#666',
  },
});

export default AnalysisScreen;
