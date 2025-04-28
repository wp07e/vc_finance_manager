'use client'

import { useAuth } from '@/lib/auth/auth-provider'
import { Card } from '@/components/ui/card'
import { RecentExpenses } from '@/components/dashboard/recent-expenses'
import { BudgetOverview } from '@/components/dashboard/budget-overview'
import { ExpenseSummary } from '@/components/dashboard/expense-summary'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'
import Link from 'next/link'

export default function DashboardPage() {
  const { user, isLoading } = useAuth()

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!user) {
    return <div>Please sign in to access the dashboard.</div>
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <Button asChild>
          <Link href="/expenses/new">
            <PlusIcon className="mr-2 h-4 w-4" />
            Add Expense
          </Link>
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="p-6">
          <ExpenseSummary />
        </Card>
        <Card className="p-6">
          <BudgetOverview />
        </Card>
        <Card className="p-6">
          <RecentExpenses />
        </Card>
      </div>
    </div>
  )
}