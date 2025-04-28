"use client"

import { useState } from "react"
import { StyleSheet, View, Text, TextInput, TouchableOpacity, ScrollView, Alert, ActivityIndicator } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { saveMoodEntry } from "../services/moodService"

// Mood options with emoji
const moodOptions = [
  { label: "Happy", emoji: "😊", value: "happy" },
  { label: "Sad", emoji: "😢", value: "sad" },
  { label: "Angry", emoji: "😠", value: "angry" },
  { label: "Anxious", emoji: "😰", value: "anxious" },
  { label: "Calm", emoji: "😌", value: "calm" },
  { label: "Excited", emoji: "🤩", value: "excited" },
]

export default function LogMoodScreen({ navigation }) {
  const [selectedMood, setSelectedMood] = useState(null)
  const [note, setNote] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleSaveMood = async () => {
    if (!selectedMood) {
      Alert.alert("Please select a mood")
      return
    }

    try {
      setIsSubmitting(true)

      // Save to Firestore using our service
      await saveMoodEntry(selectedMood, note)

      Alert.alert("Success", "Your mood has been saved!", [{ text: "OK", onPress: () => navigation.navigate("Home") }])
    } catch (error) {
      console.error("Error saving mood:", error)
      Alert.alert("Error", "Failed to save your mood. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <Text style={styles.title}>How are you feeling today?</Text>

        <View style={styles.moodContainer}>
          {moodOptions.map((mood) => (
            <TouchableOpacity
              key={mood.value}
              style={[styles.moodOption, selectedMood === mood.value && styles.selectedMood]}
              onPress={() => setSelectedMood(mood.value)}
            >
              <Text style={styles.moodEmoji}>{mood.emoji}</Text>
              <Text style={styles.moodLabel}>{mood.label}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Text style={styles.noteLabel}>Add a note (optional):</Text>
        <TextInput
          style={styles.noteInput}
          multiline
          numberOfLines={4}
          placeholder="How was your day? What made you feel this way?"
          value={note}
          onChangeText={setNote}
        />

        <TouchableOpacity
          style={[styles.saveButton, isSubmitting && styles.disabledButton]}
          onPress={handleSaveMood}
          disabled={isSubmitting}
        >
          {isSubmitting ? (
            <ActivityIndicator color="#fff" size="small" />
          ) : (
            <Text style={styles.saveButtonText}>Save Mood</Text>
          )}
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  scrollContent: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#333",
  },
  moodContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "center",
    marginBottom: 30,
  },
  moodOption: {
    width: 90,
    height: 90,
    justifyContent: "center",
    alignItems: "center",
    margin: 8,
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.2,
    shadowRadius: 2,
    elevation: 2,
  },
  selectedMood: {
    backgroundColor: "#e0f7fa",
    borderWidth: 2,
    borderColor: "#03dac6",
  },
  moodEmoji: {
    fontSize: 32,
    marginBottom: 5,
  },
  moodLabel: {
    fontSize: 14,
    color: "#333",
  },
  noteLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 10,
    color: "#333",
  },
  noteInput: {
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 15,
    minHeight: 120,
    borderColor: "#ddd",
    borderWidth: 1,
    marginBottom: 20,
    fontSize: 16,
  },
  saveButton: {
    backgroundColor: "#6200ee",
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 10,
    height: 50,
    justifyContent: "center",
  },
  disabledButton: {
    backgroundColor: "#b39ddb",
  },
  saveButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
})
