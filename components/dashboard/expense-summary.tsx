'use client'

import { useState, useEffect } from 'react'
import { getExpenses } from '@/services/expenses'
import type { Expense } from '@/types'
import { format } from 'date-fns'

export function ExpenseSummary() {
  const [totalExpenses, setTotalExpenses] = useState(0)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    async function fetchExpenses() {
      try {
        const expenses = await getExpenses()
        const total = expenses.reduce((sum, expense) => sum + expense.amount, 0)
        setTotalExpenses(total)
      } catch (error) {
        console.error('Error fetching expenses:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchExpenses()
  }, [])

  if (isLoading) return <div>Loading...</div>

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Monthly Expenses</h3>
      <p className="text-2xl font-bold">
        ${totalExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-sm text-muted-foreground">
        For {format(new Date(), 'MMMM yyyy')}
      </p>
    </div>
  )
}