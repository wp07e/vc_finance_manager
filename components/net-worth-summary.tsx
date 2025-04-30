'use client'

import { useQuery } from '@tanstack/react-query'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { useState } from 'react'
import { getBudgets } from '@/services/budgets'
import { Skeleton } from '@/components/ui/skeleton'
import { getCurrentExpenses } from '@/services/expenses'
import { cn, formatCurrency } from '@/lib/utils'

export function NetWorthSummary() {
  const [progress, setProgress] = useState(0)

  const {
    data: budgets,
    isLoading: isLoadingBudgets,
    error: budgetError,
  } = useQuery({
    queryKey: ['budgets'],
    queryFn: () => getBudgets(),
  })

  const {
    data: expenses,
    isLoading: isLoadingExpenses,
    error: expenseError,
  } = useQuery({
    queryKey: ['current-month-expenses'],
    queryFn: () => getCurrentExpenses(),
  })

  if (isLoadingBudgets || isLoadingExpenses) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Net Worth Summary</CardTitle>
          <CardDescription>Your current financial position</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
          <Skeleton className="h-4 w-1/2" />
        </CardContent>
      </Card>
    )
  }

  if (budgetError || expenseError) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
          <CardDescription>Failed to load net worth data</CardDescription>
        </CardHeader>
      </Card>
    )
  }

  const totalBudget = budgets?.reduce((acc, budget) => acc + budget.amount, 0) || 0
  const totalExpenses =
    expenses?.reduce((acc, expense) => acc + expense.amount, 0) || 0
  const netWorth = totalBudget - totalExpenses
  const percentageUsed = Math.min((totalExpenses / totalBudget) * 100, 100)

  return (
    <Card>
      <CardHeader>
        <CardTitle>Net Worth Summary</CardTitle>
        <CardDescription>Your current financial position</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Budget</span>
          <span className="text-sm font-medium">{formatCurrency(totalBudget)}</span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Total Expenses</span>
          <span className={cn("text-sm font-medium", "text-destructive")}>
            {formatCurrency(totalExpenses)}
          </span>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium">Net Worth</span>
          <span
            className={cn(
              "text-sm font-medium",
              netWorth >= 0 ? "text-emerald-600" : "text-destructive"
            )}
          >
            {formatCurrency(netWorth)}
          </span>
        </div>
        <Progress value={percentageUsed} className="h-2" />
        <p className="text-xs text-muted-foreground text-center">
          {percentageUsed.toFixed(1)}% of budget used
        </p>
      </CardContent>
    </Card>
  )
}