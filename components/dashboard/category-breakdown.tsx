'use client'

import { useMemo } from 'react'
import { Card, Title, DonutChart } from '@tremor/react'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { startOfMonth } from 'date-fns'

export function CategoryBreakdown() {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  const chartData = useMemo(() => {
    if (!expenses) return []

    const currentMonth = startOfMonth(new Date())
    const monthlyExpenses = expenses.filter(
      (expense) =>
        startOfMonth(expense.date).getTime() === currentMonth.getTime()
    )

    const categoryTotals = monthlyExpenses.reduce((acc, expense) => {
      acc[expense.category] = (acc[expense.category] || 0) + expense.amount
      return acc
    }, {} as Record<string, number>)

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }))
  }, [expenses])

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <Title>Category Breakdown</Title>
      <DonutChart
        className="mt-4 h-72"
        data={chartData}
        category="amount"
        index="category"
        valueFormatter={(value) => `$${value.toLocaleString()}`}
        colors={[
          'blue',
          'cyan',
          'indigo',
          'violet',
          'fuchsia',
          'rose',
          'orange',
          'amber',
        ]}
      />
    </Card>
  )
}