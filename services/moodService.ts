import { collection, addDoc, getDocs, query, where, orderBy, serverTimestamp, Timestamp } from "firebase/firestore"
import { db, auth } from "../firebase/config"

// Interface for mood entry
export interface MoodEntry {
  id?: string
  mood: string
  note: string
  timestamp: Timestamp
  userId: string
}

/**
 * Save a new mood entry to Firestore
 * @param mood The mood type (e.g., happy, sad)
 * @param note Optional note about the mood
 * @returns Promise with the document ID of the created entry
 */
export const saveMoodEntry = async (mood: string, note: string): Promise<string> => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser
    if (!user) {
      throw new Error("User must be authenticated to save mood entries")
    }

    // Create a reference to the moods collection
    const moodsRef = collection(db, "moods")

    // Add a new document with the mood data
    const docRef = await addDoc(moodsRef, {
      mood,
      note: note.trim(),
      timestamp: serverTimestamp(),
      userId: user.uid,
      createdAt: serverTimestamp(),
    })

    console.log("Mood entry saved with ID:", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error saving mood entry:", error)
    throw new Error("Failed to save mood entry")
  }
}

/**
 * Get all mood entries for the current user
 * @returns Promise with an array of mood entries
 */
export const getMoodEntries = async (): Promise<MoodEntry[]> => {
  try {
    // Check if user is authenticated
    const user = auth.currentUser
    if (!user) {
      throw new Error("User must be authenticated to fetch mood entries")
    }

    // Create a query against the moods collection
    const q = query(collection(db, "moods"), where("userId", "==", user.uid), orderBy("timestamp", "desc"))

    // Execute the query
    const querySnapshot = await getDocs(q)

    // Map the query results to an array of mood entries
    const entries: MoodEntry[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      entries.push({
        id: doc.id,
        mood: data.mood,
        note: data.note,
        timestamp: data.timestamp,
        userId: data.userId,
      })
    })

    return entries
  } catch (error) {
    console.error("Error fetching mood entries:", error)
    throw new Error("Failed to fetch mood entries")
  }
}

/**
 * Get mood entries for a specific date range
 * @param startDate Start date for the range
 * @param endDate End date for the range
 * @returns Promise with an array of mood entries
 */
export const getMoodEntriesByDateRange = async (startDate: Date, endDate: Date): Promise<MoodEntry[]> => {
  try {
    const user = auth.currentUser
    if (!user) {
      throw new Error("User must be authenticated to fetch mood entries")
    }

    const startTimestamp = Timestamp.fromDate(startDate)
    const endTimestamp = Timestamp.fromDate(endDate)

    const q = query(
      collection(db, "moods"),
      where("userId", "==", user.uid),
      where("timestamp", ">=", startTimestamp),
      where("timestamp", "<=", endTimestamp),
      orderBy("timestamp", "desc"),
    )

    const querySnapshot = await getDocs(q)

    const entries: MoodEntry[] = []
    querySnapshot.forEach((doc) => {
      const data = doc.data()
      entries.push({
        id: doc.id,
        mood: data.mood,
        note: data.note,
        timestamp: data.timestamp,
        userId: data.userId,
      })
    })

    return entries
  } catch (error) {
    console.error("Error fetching mood entries by date range:", error)
    throw new Error("Failed to fetch mood entries by date range")
  }
}
