import { getFirestore, collection, addDoc, getDocs, query, where, Timestamp, doc, updateDoc, deleteDoc } from 'firebase/firestore'
import { getAuth } from 'firebase/auth'

const db = getFirestore()

interface Category {
  id: string
  name: string
  color: string
  icon: string
  userId: string
  createdAt: Date
}

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
  if (!user) throw new Error('User must be logged in to fetch categories')

  try {
    const categoriesRef = collection(db, 'categories')
    const q = query(categoriesRef, where('userId', '==', user.uid))
    const querySnapshot = await getDocs(q)
    
    return querySnapshot.docs.map((doc) => {
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
  } catch (error) {
    console.error('Error fetching categories:', error)
    throw new Error('Failed to fetch categories')
  }
}
