'use client'

import React from 'react'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Expense } from '@/types'

function CategoryExpenseReport() {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>Loading...</CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Expense Breakdown by Category</CardTitle>
        </CardHeader>
        <CardContent>Error loading expenses: {error.message}</CardContent>
      </Card>
    )
  }

  // Calculate expense breakdown by category
  const categoryBreakdown: { [key: string]: number } = {}
  expenses?.forEach((expense: Expense) => {
    if (categoryBreakdown[expense.category]) {
      categoryBreakdown[expense.category] += expense.amount
    } else {
      categoryBreakdown[expense.category] = expense.amount
    }
  })

  return (
    <Card>
      <CardHeader>
        <CardTitle>Expense Breakdown by Category</CardTitle>
      </CardHeader>
      <CardContent>
        {/* TODO: Implement chart visualization */}
        <ul>
          {Object.entries(categoryBreakdown).map(([category, amount]) => (
            <li key={category}>
              {category}: ${amount.toFixed(2)}
            </li>
          ))}
        </ul>
      </CardContent>
    </Card>
  )
}

export { CategoryExpenseReport }

// Interfaces
interface CategoryExpenseReportProps {}
