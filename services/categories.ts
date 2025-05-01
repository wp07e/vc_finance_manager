import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'
import type { Category } from '@/types'

const db = getFirestore()

const defaultCategories: Category[] = [
  { id: 'default-1', name: 'Food', color: '#FF6347', icon: '🍕' },
  { id: 'default-2', name: 'Transportation', color: '#4682B4', icon: '🚗' },
  { id: 'default-3', name: 'Shopping', color: '#32CD32', icon: '🛍️' },
  { id: 'default-4', name: 'Entertainment', color: '#FFD700', icon: '🎮' },
  { id: 'default-5', name: 'Health', color: '#BA55D3', icon: '🏥' },
  { id: 'default-6', name: 'Housing', color: '#F08080', icon: '🏠' },
  { id: 'default-7', name: 'Utilities', color: '#ADD8E6', icon: '💡' },
  { id: 'default-8', name: 'Travel', color: '#20B2AA', icon: '✈️' },
  { id: 'default-9', name: 'Education', color: '#778899', icon: '📚' },
  { id: 'default-10', name: 'Miscellaneous', color: '#C0C0C0', icon: '📝' },
];

interface CreateCategoryInput {
  name: string
  color: string
  icon: string
}

export async function createCategory({
  name,
  color,
  icon,
}: CreateCategoryInput) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('User must be logged in to create a category')

  try {
    const categoryRef = await addDoc(collection(db, 'categories'), {
      name,
      color,
      icon,
      userId: user.uid,
      createdAt: Timestamp.now(),
    })

    return {
      id: categoryRef.id,
      name,
      color,
      icon,
      userId: user.uid,
      createdAt: new Date(),
    }
  } catch (error) {
    console.error('Error creating category:', error)
    throw new Error('Failed to create category')
  }
}

interface UpdateCategoryInput {
  id: string
  name?: string
  color?: string
  icon?: string
}

export async function updateCategory({
  id,
  name,
  color,
  icon,
}: UpdateCategoryInput) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('User must be logged in to update a category')

  try {
    const categoryRef = doc(db, 'categories', id)
    const updateData: any = {}
    if (name !== undefined) updateData.name = name
    if (color !== undefined) updateData.color = color
    if (icon !== undefined) updateData.icon = icon

    await updateDoc(categoryRef, updateData)

    return { success: true, id }
  } catch (error) {
    console.error('Error updating category:', error)
    throw new Error('Failed to update category')
  }
}

export async function deleteCategory(id: string) {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) throw new Error('User must be logged in to delete a category')

  try {
    const categoryRef = doc(db, 'categories', id)
    await deleteDoc(categoryRef)

    return { success: true, id }
  } catch (error) {
    console.error('Error deleting category:', error)
    throw new Error('Failed to delete category')
  }
}

export async function getCategories(): Promise<Category[]> {
  const auth = getAuth()
  const user = auth.currentUser
  if (!user) {
    // If user is not logged in, return only default categories
    return defaultCategories;
  }

  try {
    const categoriesRef = collection(db, 'categories')
    const q = query(categoriesRef, where('userId', '==', user.uid))
    const querySnapshot = await getDocs(q)

    const userCategories: Category[] = querySnapshot.docs.map((doc) => {
      const data = doc.data()
      return {
        id: doc.id,
        name: data.name,
        color: data.color,
        icon: data.icon,
        userId: data.userId,
        createdAt: data.createdAt.toDate(),
      }
    })

    // Combine default categories with user-specific categories
    return [...defaultCategories, ...userCategories];

  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}
