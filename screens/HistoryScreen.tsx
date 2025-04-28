"use client"

import { useState, useCallback } from "react"
import { StyleSheet, View, Text, FlatList, ActivityIndicator, RefreshControl, TouchableOpacity } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { useFocusEffect } from "@react-navigation/native"
import { getMoodEntries, type MoodEntry } from "../services/moodService"

// Helper function to format date
const formatDate = (timestamp) => {
  if (!timestamp) return "Unknown date"

  const date = timestamp.toDate()
  return date.toLocaleDateString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
}

// Get emoji for mood
const getMoodEmoji = (mood) => {
  const emojis = {
    happy: "😊",
    sad: "😢",
    angry: "😠",
    anxious: "😰",
    calm: "😌",
    excited: "🤩",
  }
  return emojis[mood] || "😐"
}

export default function HistoryScreen() {
  const [moodEntries, setMoodEntries] = useState<MoodEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const fetchMoodHistory = async () => {
    try {
      setLoading(true)
      setError(null)

      // Fetch mood entries using our service
      const entries = await getMoodEntries()
      setMoodEntries(entries)
    } catch (err) {
      console.error("Error fetching mood history:", err)
      setError("Failed to load your mood history. Please try again later.")
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Fetch data when the screen comes into focus
  useFocusEffect(
    useCallback(() => {
      fetchMoodHistory()
    }, []),
  )

  const onRefresh = () => {
    setRefreshing(true)
    fetchMoodHistory()
  }

  // Render each mood entry
  const renderMoodEntry = ({ item }: { item: MoodEntry }) => (
    <View style={styles.moodEntry}>
      <View style={styles.moodHeader}>
        <Text style={styles.moodEmoji}>{getMoodEmoji(item.mood)}</Text>
        <Text style={styles.moodDate}>{formatDate(item.timestamp)}</Text>
      </View>
      <Text style={styles.moodType}>{item.mood.charAt(0).toUpperCase() + item.mood.slice(1)}</Text>
      {item.note ? (
        <Text style={styles.moodNote}>{item.note}</Text>
      ) : (
        <Text style={styles.emptyNote}>No note added</Text>
      )}
    </View>
  )

  if (loading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6200ee" />
        <Text style={styles.loadingText}>Loading your mood history...</Text>
      </View>
    )
  }

  if (error) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>{error}</Text>
        <TouchableOpacity style={styles.retryButton} onPress={fetchMoodHistory}>
          <Text style={styles.retryButtonText}>Try Again</Text>
        </TouchableOpacity>
      </View>
    )
  }

  if (moodEntries.length === 0) {
    return (
      <View style={styles.centered}>
        <Text style={styles.emptyText}>You haven't logged any moods yet.</Text>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <FlatList
        data={moodEntries}
        renderItem={renderMoodEntry}
        keyExtractor={(item) => item.id || Math.random().toString()}
        contentContainerStyle={styles.listContent}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      />
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    fontSize: 16,
    color: "#666",
  },
  errorText: {
    fontSize: 16,
    color: "#b00020",
    textAlign: "center",
    marginBottom: 20,
  },
  retryButton: {
    backgroundColor: "#6200ee",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 8,
  },
  retryButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  emptyText: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  listContent: {
    padding: 16,
  },
  moodEntry: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  moodHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  moodEmoji: {
    fontSize: 24,
  },
  moodDate: {
    fontSize: 14,
    color: "#666",
  },
  moodType: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
    color: "#333",
  },
  moodNote: {
    fontSize: 16,
    color: "#444",
  },
  emptyNote: {
    fontSize: 14,
    fontStyle: "italic",
    color: "#999",
  },
})
