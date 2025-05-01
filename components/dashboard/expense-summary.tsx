'use client'

import { useMemo } from 'react'
import { useQuery } from '@tanstack/react-query'
import { getCurrentExpenses } from '@/services/expenses'
import type { Expense } from '@/types'
import { format } from 'date-fns'
import { toast } from 'sonner'

export function ExpenseSummary() {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses', 'current-month'],
    queryFn: getCurrentExpenses,
  })

  const totalMonthlyExpenses = useMemo(() => {
    if (!expenses) return 0
    return expenses.reduce((sum, expense) => sum + expense.amount, 0)
  }, [expenses])

  if (isLoading) return <div>Loading expenses...</div>
  if (error) {
    toast.error('Failed to load monthly expenses: ' + error.message)
    return <div>Error loading expenses</div>
  }

  return (
    <div className="space-y-2">
      <h3 className="font-medium">Monthly Expenses</h3>
      <p className="text-2xl font-bold">
        ${totalMonthlyExpenses.toLocaleString('en-US', { minimumFractionDigits: 2 })}
      </p>
      <p className="text-sm text-muted-foreground">
        For {format(new Date(), 'MMMM yyyy')}
      </p>
    </div>
  )
}
