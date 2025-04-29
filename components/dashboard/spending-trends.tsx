'use client'

import { useMemo } from 'react'
import { Card, Title, AreaChart } from '@tremor/react'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { startOfMonth, subMonths, format } from 'date-fns'

export function SpendingTrends() {
  const { data: expenses, isLoading } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  const chartData = useMemo(() => {
    if (!expenses) return []

    const months = Array.from({ length: 6 }, (_, i) => {
      const date = subMonths(new Date(), i)
      return {
        date: startOfMonth(date),
        monthLabel: format(date, 'MMM yyyy'),
      }
    }).reverse()

    return months.map(({ date, monthLabel }) => {
      const monthlyExpenses = expenses.filter(
        (expense) =>
          startOfMonth(expense.date).getTime() === date.getTime()
      )

      const total = monthlyExpenses.reduce(
        (sum, expense) => sum + expense.amount,
        0
      )

      return {
        month: monthLabel,
        'Total Spending': total,
      }
    })
  }, [expenses])

  if (isLoading) return <div>Loading...</div>

  return (
    <Card>
      <Title>Monthly Spending Trends</Title>
      <AreaChart
        className="mt-4 h-72"
        data={chartData}
        index="month"
        categories={['Total Spending']}
        colors={['blue']}
        valueFormatter={(value) => `$${value.toLocaleString()}`}
      />
    </Card>
  )
}