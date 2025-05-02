'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { Card } from '@/components/ui/card'
import { RecentExpenses } from '@/components/dashboard/recent-expenses'
import { BudgetOverview } from '@/components/dashboard/budget-overview'
import { ExpenseSummary } from '@/components/dashboard/expense-summary'
import { SpendingTrends } from '@/components/dashboard/spending-trends'
import { CategoryBreakdown } from '@/components/dashboard/category-breakdown'
import { NetWorthSummary } from '@/components/dashboard/net-worth-summary'
import { AddExpenseDialog } from '@/components/expenses/add-expense-dialog'
import { AddBudgetDialog } from '@/components/budgets/add-budget-dialog'
import { AddSavingsGoalDialog } from '@/components/savings-goals/add-savings-goal-dialog'
import { AddInvestmentDialog } from '@/components/investments/add-investment-dialog'
import { FinancialInsights } from '@/components/analytics/financial-insights'
import { WeeklyAnalytics } from '@/components/analytics/weekly-analytics'
import { CategoryExpenseReport } from '@/components/analytics/category-expense-report'
import { SavingsGoalsSummary } from '@/components/dashboard/savings-goals-summary'
import { InvestmentGoalsSummary } from '@/components/dashboard/investment-goals-summary'
import { Suspense } from 'react'
import { redirect } from 'next/navigation'
import { Separator } from '@/components/ui/separator'

function LoadingCard() {
  return (
    <Card className="p-6">
      <div className="h-20 animate-pulse rounded-md bg-muted" />
    </Card>
  )
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    )
  }

  if (!user) {
    redirect('/login')
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <div className="flex gap-4">
          <AddBudgetDialog />
          <AddExpenseDialog />
          <AddSavingsGoalDialog />
          <AddInvestmentDialog />
        </div>
      </div>

      <Suspense fallback={<div className="h-20 animate-pulse" />}>
        <NetWorthSummary />
      </Suspense>

      <Suspense fallback={<div className="h-20 animate-pulse" />}>
        <FinancialInsights />
      </Suspense>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <ExpenseSummary />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <SavingsGoalsSummary />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <InvestmentGoalsSummary />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <BudgetOverview />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <RecentExpenses />
          </Card>
        </Suspense>
      </div>

      <Separator />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <SpendingTrends />
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <CategoryBreakdown />
        </Suspense>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <WeeklyAnalytics />
        </Suspense>
      </div>

      <Separator />

      <div className="grid grid-cols-1 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <CategoryExpenseReport />
        </Suspense>
      </div>
    </div>
  )
}
