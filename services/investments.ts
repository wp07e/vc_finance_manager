import { db } from '@/lib/firebase-config'
import { collection, addDoc, getDocs, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { Investment } from '@/types'

const INVESTMENTS_COLLECTION = 'investments'

async function addInvestment(investment: Omit<Investment, 'id'>): Promise<Investment> {
  try {
    const docRef = await addDoc(collection(db, INVESTMENTS_COLLECTION), investment)
    return { id: docRef.id, ...investment }
  } catch (error) {
    console.error('Error adding investment:', error)
    throw new Error('Failed to add investment. Please try again.')
  }
}

async function getInvestments(): Promise<Investment[]> {
  try {
    const querySnapshot = await getDocs(collection(db, INVESTMENTS_COLLECTION))
    const investments: Investment[] = []
    querySnapshot.forEach((doc) => {
      investments.push({ id: doc.id, ...doc.data() } as Investment)
    })
    return investments
  } catch (error) {
    console.error('Error getting investments:', error)
    throw new Error('Failed to retrieve investments. Please try again.')
  }
}

async function updateInvestment(investment: Investment): Promise<void> {
  try {
    const investmentRef = doc(db, INVESTMENTS_COLLECTION, investment.id)
    await updateDoc(investmentRef, { ...investment })
  } catch (error) {
    console.error('Error updating investment:', error)
    throw new Error('Failed to update investment. Please try again.')
  }
}

async function deleteInvestment(id: string): Promise<void> {
  try {
    await deleteDoc(doc(db, INVESTMENTS_COLLECTION, id))
  } catch (error) {
    console.error('Error deleting investment:', error)
    throw new Error('Failed to delete investment. Please try again.')
  }
}

export { addInvestment, getInvestments, updateInvestment, deleteInvestment }
