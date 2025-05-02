'use client'

import { useQuery } from '@tanstack/react-query'
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { getSavingsGoals } from '@/services/savings-goals'
import { SavingsGoal } from '@/types'
import { Skeleton } from '@/components/ui/skeleton'

function SavingsGoalsSummary() {
  const { data: savingsGoals, isLoading, error } = useQuery<SavingsGoal[], Error>({
    queryKey: ['savingsGoals'],
    queryFn: getSavingsGoals,
  })

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Skeleton className="h-4 w-[250px]" />
          <Skeleton className="h-4 w-[200px]" />
          <Skeleton className="h-4 w-[200px]" />
        </CardContent>
      </Card>
    )
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-red-500">Error loading savings goals.</p>
        </CardContent>
      </Card>
    )
  }

  if (!savingsGoals || savingsGoals.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Savings Goals</CardTitle>
        </CardHeader>
        <CardContent>
          <p>No savings goals added yet.</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Savings Goals</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {savingsGoals.map((goal) => {
          const progress = (goal.currentAmount / goal.targetAmount) * 100
          return (
            <div key={goal.id} className="space-y-2">
              <div className="flex justify-between">
                <span className="text-sm font-medium">{goal.name}</span>
                <span className="text-sm text-muted-foreground">
                  ${goal.currentAmount.toFixed(2)} / ${goal.targetAmount.toFixed(2)}
                </span>
              </div>
              <Progress value={progress} className="w-full" />
            </div>
          )
        })}
      </CardContent>
    </Card>
  )
}

export { SavingsGoalsSummary }
