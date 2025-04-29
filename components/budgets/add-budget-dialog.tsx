'use client'

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddBudgetForm } from './add-budget-form'
import { Button } from '@/components/ui/button'
import { PlusIcon } from '@radix-ui/react-icons'

export function AddBudgetDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <PlusIcon className="mr-2 h-4 w-4" />
          Add Budget
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Create New Budget</DialogTitle>
        </DialogHeader>
        <AddBudgetForm />
      </DialogContent>
    </Dialog>
  )
}