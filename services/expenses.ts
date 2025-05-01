import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import type { Expense } from '@/types'

const db = getFirestore()

interface CreateExpenseInput {
  amount: number
  category: string
  description: string
  date: Date
  tags?: string[]
}

export async function createExpense({
  amount,
  category,
  description,
  date,
  tags = [],
}: CreateExpenseInput) {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) throw new Error('User must be logged in to create an expense')

  try {
    const expenseRef = await addDoc(collection(db, 'expenses'), {
      userId: user.uid,
      amount,
      category,
      description,
      date: Timestamp.fromDate(date),
      tags,
      createdAt: Timestamp.now(),
    })

    return {
      id: expenseRef.id,
      userId: user.uid,
      amount,
      category,
      description,
      date,
      tags,
    }
  } catch (error) {
    console.error('Error creating expense:', error)
    throw new Error('Failed to create expense')
  }
}

interface UpdateExpenseInput {
  id: string
  amount?: number
  category?: string
  description?: string
  date?: Date
  tags?: string[]
}

export async function updateExpense({
  id,
  amount,
  category,
  description,
  date,
  tags,
}: UpdateExpenseInput) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('User must be logged in to update an expense')

  try {
    const expenseRef = doc(db, 'expenses', id)
    const updateData: any = {}
    if (amount !== undefined) updateData.amount = amount
    if (category !== undefined) updateData.category = category
    if (description !== undefined) updateData.description = description
    if (date !== undefined) updateData.date = Timestamp.fromDate(date)
    if (tags !== undefined) updateData.tags = tags

    await updateDoc(expenseRef, updateData)

    // Optionally fetch and return the updated expense
    // For simplicity, we'll just return success status or the input data
    return { success: true, id }
  } catch (error) {
    console.error('Error updating expense:', error)
    throw new Error('Failed to update expense')
  }
}

export async function deleteExpense(id: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('User must be logged in to delete an expense')

  try {
    const expenseRef = doc(db, 'expenses', id)
    // Optional: Add a check to ensure the user owns the expense before deleting
    // const expenseDoc = await getDoc(expenseRef);
    // if (!expenseDoc.exists() || expenseDoc.data().userId !== user.uid) {
    //   throw new Error('Expense not found or user not authorized');
    // }

    await deleteDoc(expenseRef)

    return { success: true, id }
  } catch (error) {
    console.error('Error deleting expense:', error)
    throw new Error('Failed to delete expense')
  }
}

export async function getExpenses(): Promise<Expense[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) throw new Error('User must be logged in to fetch expenses')

  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid)
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date.toDate(),
        tags: data.tags || [],
      }
    })
  } catch (error) {
    console.error('Error fetching expenses:', error)
    throw new Error('Failed to fetch expenses')
  }
}

export async function getCurrentExpenses(): Promise<Expense[]> {
  const auth = getAuth()
  const user = auth.currentUser

  if (!user) throw new Error('User must be logged in to fetch expenses')

  const startOfMonth = new Date()
  startOfMonth.setDate(1)
  startOfMonth.setHours(0, 0, 0, 0)

  try {
    const q = query(
      collection(db, 'expenses'),
      where('userId', '==', user.uid),
      where('date', '>=', Timestamp.fromDate(startOfMonth))
    )
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        userId: data.userId,
        amount: data.amount,
        category: data.category,
        description: data.description,
        date: data.date.toDate(),
        tags: data.tags || [],
      }
    })
  } catch (error) {
    console.error('Error fetching current month expenses:', error)
    throw new Error('Failed to fetch current month expenses')
  }
}
