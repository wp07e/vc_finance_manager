'use client'

import { useState } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getExpenses, deleteExpense } from '@/services/expenses'
import { format } from 'date-fns'
import { Card } from '@/components/ui/card'
import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
  TableCell,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { EditExpenseDialog } from '@/components/expenses/edit-expense-dialog'
import type { Expense } from '@/types'

export function RecentExpenses() {
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedExpense, setSelectedExpense] = useState<Expense | null>(null)

  const { data: expenses, isLoading, error } = useQuery({
    queryKey: ['expenses', 'recent'],
    queryFn: getExpenses,
  })

  const { mutate: removeExpense } = useMutation({
    mutationFn: deleteExpense,
    onSuccess: () => {
      toast.success('Expense deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
    onError: (error) => {
      toast.error('Failed to delete expense: ' + error.message)
    },
  })

  function handleDelete(expenseId: string) {
    removeExpense(expenseId)
  }

  function handleEdit(expense: Expense) {
    setSelectedExpense(expense)
    setIsEditDialogOpen(true)
  }

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
      <div className="rounded-md border overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Date</TableHead>
              <TableHead>Description</TableHead>
              <TableHead className="text-right">Amount</TableHead>
              <TableHead>Actions</TableHead>
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
                <TableCell>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" className="h-8 w-8 p-0">
                        <span className="sr-only">Open menu</span>
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => handleEdit(expense)}>Edit</DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleDelete(expense.id)}>Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
      {selectedExpense && (
        <EditExpenseDialog
          expense={selectedExpense}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  )
}
