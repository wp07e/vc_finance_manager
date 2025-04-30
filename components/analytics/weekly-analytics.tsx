'use client'

import { useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { startOfWeek, endOfWeek, eachDayOfInterval, format } from 'date-fns'
import { BarChart } from '@tremor/react'

export function WeeklyAnalytics() {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses'],
    queryFn: getExpenses,
  })

  const chartData = useMemo(() => {
    if (!expenses) return []

    const now = new Date()
    const weekStart = startOfWeek(now)
    const weekEnd = endOfWeek(now)
    const daysInWeek = eachDayOfInterval({ start: weekStart, end: weekEnd })

    return daysInWeek.map((date) => {
      const dayExpenses = expenses.filter(
        (expense) =>
          format(expense.date, 'yyyy-MM-dd') === format(date, 'yyyy-MM-dd')
      )

      const total = dayExpenses.reduce((sum, expense) => sum + expense.amount, 0)

      return {
        day: format(date, 'EEE'),
        'Daily Spending': total,
      }
    })
  }, [expenses])

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending Pattern</CardTitle>
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
            Failed to load weekly analytics
          </p>
        </CardContent>
      </Card>
    )
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Weekly Spending Pattern</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-10">
            No expenses found for this week
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Weekly Spending Pattern</CardTitle>
      </CardHeader>
      <CardContent>
        <BarChart
          className="mt-4 h-[300px]"
          data={chartData}
          index="day"
          categories={['Daily Spending']}
          colors={['blue']}
          valueFormatter={(value) => `$${value.toLocaleString()}`}
          showAnimation={true}
          showLegend={false}
          showGridLines={false}
        />
      </CardContent>
    </Card>
  )
}