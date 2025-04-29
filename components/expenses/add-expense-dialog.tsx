'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddExpenseForm } from './add-expense-form'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

export function AddExpenseDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Expense
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Expense</DialogTitle>
        </DialogHeader>
        <AddExpenseForm />
      </DialogContent>
    </Dialog>
  )
}