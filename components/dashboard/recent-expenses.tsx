'use client'

import { useQuery } from '@tanstack/react-query'
import { getExpenses } from '@/services/expenses'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'

export function RecentExpenses() {
  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: getExpenses,
  })

  if (isLoading) return <div>Loading expenses...</div>
  if (error) return <div>Error loading expenses</div>
  if (!expenses?.length) return <div>No recent expenses</div>

  // Sort expenses by date (most recent first) and take the last 5
  const recentExpenses = [...expenses]
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .slice(0, 5)

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Recent Expenses</h3>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recentExpenses.map((expense) => (
              <TableRow key={expense.id}>
                <TableCell>{format(expense.date, 'MMM d')}</TableCell>
                <TableCell>{expense.description}</TableCell>
                <TableCell className="text-right">
                  ${expense.amount.toFixed(2)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}