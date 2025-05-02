import { db } from '@/lib/firebase-config'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { SavingsGoal } from '@/types'

const SAVINGS_GOALS_COLLECTION = 'savingsGoals'

async function addSavingsGoal(goal: Omit<SavingsGoal, 'id'>): Promise<SavingsGoal> {
  try {
    const docRef = await addDoc(collection(db, SAVINGS_GOALS_COLLECTION), goal)
    return { id: docRef.id, ...goal }
  } catch (error) {
    console.error('Error adding savings goal:', error)
    throw new Error('Failed to add savings goal. Please try again.')
  }
}

async function getSavingsGoals(): Promise<SavingsGoal[]> {
  try {
    const querySnapshot = await getDocs(collection(db, SAVINGS_GOALS_COLLECTION))
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
  try {
    const goalRef = doc(db, SAVINGS_GOALS_COLLECTION, goal.id)
    await updateDoc(goalRef, { ...goal })
  } catch (error) {
    console.error('Error updating savings goal:', error)
    throw new Error('Failed to update savings goal. Please try again.')
  }
}

async function deleteSavingsGoal(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, SAVINGS_GOALS_COLLECTION, id))
  } catch (error) {
    console.error('Error deleting savings goal:', error)
    throw new Error('Failed to delete savings goal. Please try again.')
  }
}

export { addSavingsGoal, getSavingsGoals, updateSavingsGoal, deleteSavingsGoal }
