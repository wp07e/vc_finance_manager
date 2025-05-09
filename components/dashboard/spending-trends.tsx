'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { startOfMonth, subMonths, format } from 'date-fns'
import { AreaChart } from '@tremor/react'

export function SpendingTrends() {
  const { data: expenses, isLoading, error } = useQuery({
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

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Monthly Spending Trends</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load spending trends
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Monthly Spending Trends</CardTitle>
      </CardHeader>
      <CardContent>
        <AreaChart
          className="mt-4 h-[300px]"
          data={chartData}
          index="month"
          categories={['Total Spending']}
          colors={['blue']}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
          showLegend={false}
          showGridLines={false}
          curveType="monotone"
        />
      </CardContent>
    </Card>
  )
}