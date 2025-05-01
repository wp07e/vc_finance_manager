'use client'

import { useState, useMemo } from 'react'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { getBudgets, deleteBudget } from '@/services/budgets'
import { getCurrentExpenses } from '@/services/expenses'
import { Progress } from '@/components/ui/progress'
import { type Budget, type Expense } from '@/types'
import { format, isWithinInterval, startOfMonth, endOfMonth } from 'date-fns'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { Button } from '@/components/ui/button'
import { MoreHorizontal } from 'lucide-react'
import { toast } from 'sonner'
import { EditBudgetDialog } from '@/components/budgets/edit-budget-dialog'

export function BudgetOverview() {
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedBudget, setSelectedBudget] = useState<Budget | null>(null)

  const { data: allBudgets, isLoading: isLoadingBudgets, error: budgetsError } = useQuery<Budget[]>({
    queryKey: ['budgets'],
    queryFn: getBudgets
  })

  const budgets = useMemo(() => {
    if (!allBudgets) return []
    const currentMonth = startOfMonth(new Date())
    const monthEnd = endOfMonth(new Date())
    return allBudgets.filter(budget =>
      isWithinInterval(budget.startDate, { start: currentMonth, end: monthEnd })
    )
  }, [allBudgets])

  const { data: expenses, isLoading: isLoadingExpenses, error: expensesError } = useQuery({
    queryKey: ['expenses', 'current-month'],
    queryFn: getCurrentExpenses
  })

  const { mutate: removeBudget } = useMutation({
    mutationFn: deleteBudget,
    onSuccess: () => {
      toast.success('Budget deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
    onError: (error) => {
      toast.error('Failed to delete budget: ' + error.message)
    },
  })

  const isLoading = isLoadingBudgets || isLoadingExpenses
  const error = budgetsError || expensesError

  if (isLoading) return <div>Loading budgets and expenses...</div>
  if (error) return <div>Error loading data</div>
  if (!budgets?.length) return <div>No budgets set for this month</div>

  // Calculate total spent per category for the current month
  const spentByCategory: { [key: string]: number } = {}
  if (expenses) {
    expenses.forEach(expense => {
      spentByCategory[expense.category] = (spentByCategory[expense.category] || 0) + expense.amount
    })
  }

  function handleDelete(budgetId: string) {
    removeBudget(budgetId)
  }

  function handleEdit(budget: Budget) {
    setSelectedBudget(budget)
    setIsEditDialogOpen(true)
  }

  return (
    <div className="space-y-4">
      <h3 className="font-medium">Budget Overview</h3>
      <div className="space-y-4">
        {budgets.map((budget) => {
          const spentAmount = spentByCategory[budget.category] || 0
          return <BudgetItem key={budget.id} budget={budget} spentAmount={spentAmount} onEdit={handleEdit} onDelete={handleDelete} />
        })}
      </div>
      {selectedBudget && (
        <EditBudgetDialog
          budget={selectedBudget}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </div>
  )
}

interface BudgetItemProps {
  budget: Budget
  spentAmount: number
  onEdit: (budget: Budget) => void
  onDelete: (budgetId: string) => void
}

function BudgetItem({ budget, spentAmount, onEdit, onDelete }: BudgetItemProps) {
  const progress = budget.amount === 0 ? 0 : (spentAmount / budget.amount) * 100 > 100 ? 100 : (spentAmount / budget.amount) * 100

  return (
    <div className="space-y-2">
      <div className="flex justify-between items-center">
        <span className="font-medium">{budget.category}</span>
        <span className="text-sm text-muted-foreground">
          ${spentAmount.toFixed(2)} / ${budget.amount.toFixed(2)}
        </span>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={() => onEdit(budget)}>Edit</DropdownMenuItem>
            <DropdownMenuItem onClick={() => onDelete(budget.id)}>Delete</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <Progress value={progress} className="h-2" />
    </div>
  )
}
