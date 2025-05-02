import { db } from '@/lib/firebase-config'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc, query, where } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import { SavingsGoal } from '@/types'

const SAVINGS_GOALS_COLLECTION = 'savingsGoals'

async function addSavingsGoal(goal: Omit<SavingsGoal, 'id' | 'userId'>): Promise<SavingsGoal> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User not authenticated.')
  }

  const newGoal = { ...goal, userId: user.uid }

  try {
    const docRef = await addDoc(collection(db, SAVINGS_GOALS_COLLECTION), newGoal)
    return { id: docRef.id, ...newGoal }
  } catch (error) {
    console.error('Error adding savings goal:', error)
    throw new Error('Failed to add savings goal. Please try again.')
  }
}

async function getSavingsGoals(): Promise<SavingsGoal[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User not authenticated.')
  }

  try {
    const q = query(collection(db, SAVINGS_GOALS_COLLECTION), where('userId', '==', user.uid))
    const querySnapshot = await getDocs(q)
    const goals: SavingsGoal[] = []
    querySnapshot.forEach((doc) => {
      goals.push({ id: doc.id, ...doc.data() } as SavingsGoal)
    })
    return goals
  } catch (error) {
    console.error('Error getting savings goals:', error)
    throw new Error('Failed to retrieve savings goals. Please try again.')
  }
}

async function updateSavingsGoal(goal: SavingsGoal): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User not authenticated.')
  }

  if (goal.userId !== user.uid) {
    throw new Error('Unauthorized to update this savings goal.')
  }

  try {
    const goalRef = doc(db, SAVINGS_GOALS_COLLECTION, goal.id)
    await updateDoc(goalRef, { ...goal })
  } catch (error) {
    console.error('Error updating savings goal:', error)
    throw new Error('Failed to update savings goal. Please try again.')
  }
}

async function deleteSavingsGoal(id: string): Promise<void> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) {
    throw new Error('User not authenticated.')
  }

  // Optional: Add a check here to ensure the user owns the goal before deleting
  // This would require fetching the goal first to get the userId

  try {
    await deleteDoc(doc(db, SAVINGS_GOALS_COLLECTION, id))
  } catch (error) {
    console.error('Error deleting savings goal:', error)
    throw new Error('Failed to delete savings goal. Please try again.')
  }
}

export { addSavingsGoal, getSavingsGoals, updateSavingsGoal, deleteSavingsGoal }
