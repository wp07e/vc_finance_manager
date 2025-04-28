import { getFirestore, collection, addDoc, query, where, getDocs, Timestamp } from 'firebase/firestore'
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