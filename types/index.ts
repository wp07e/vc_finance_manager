export interface ActionResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
  }
}

export interface Category {
  id: string
  name: string
  color: string
  icon: string
  userId?: string
  createdAt?: Date
}

export interface Expense {
  id: string
  userId: string
  amount: number
  category: string
  description: string
  date: Date
  tags?: string[]
}

export interface Budget {
  id: string
  userId: string
  category: string
  amount: number
  period: 'weekly' | 'monthly'
  startDate: Date
}

export interface User {
  id: string
  email: string
  displayName?: string
  photoURL?: string
  createdAt: Date
  settings: UserSettings
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system'
  currency: string
  notifications: {
    email: boolean
    push: boolean
  }
}
