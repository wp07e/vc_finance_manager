'use client'

import { useQuery } from '@tanstack/react-query'
import { getCurrentMonthBudgets } from '@/services/budgets'
import { Progress } from '@/components/ui/progress'
import { type Budget } from '@/types'
import { format } from 'date-fns'

export function BudgetOverview() {
  const { data: budgets, isLoading, error } = useQuery({
    queryKey: ['budgets', 'current-month'],
    queryFn: getCurrentMonthBudgets
  })

  if (isLoading) return <div>Loading budgets...</div>
  if (error) return <div>Error loading budgets</div>
  if (!budgets?.length) return <div>No budgets set for this month</div>

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Budget Overview</h3>
      <div className="space-y-4">
        {budgets.map((budget) => (
          <BudgetItem key={budget.id} budget={budget} />
        ))}
      </div>
    </div>
  )
}

interface BudgetItemProps {
  budget: Budget
}

function BudgetItem({ budget }: BudgetItemProps) {
  // TODO: Replace with actual spent amount from expenses
  const spentAmount = Math.random() * budget.amount // Placeholder
  const progress = (spentAmount / budget.amount) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{budget.category}</span>
        <span className="text-sm text-muted-foreground">
          ${spentAmount.toFixed(2)} / ${budget.amount.toFixed(2)}
        </span>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}