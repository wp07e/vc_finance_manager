import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from 'sonner'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog'
import { AddSavingsGoalForm } from './add-savings-goal-form'
import { addSavingsGoal } from '@/services/savings-goals'
import { SavingsGoalInput, savingsGoalSchema } from '@/lib/validations/schema'

function AddSavingsGoalDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddSavingsGoal = async (values: SavingsGoalInput) => {
    try {
      // TODO: Get the actual userId
      const userId = 'placeholder-user-id'
      await addSavingsGoal({ ...values, userId, currentAmount: 0 })
      toast.success('Savings goal added successfully!')
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding savings goal:', error)
      toast.error('Failed to add savings goal. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Savings Goal</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Savings Goal</DialogTitle>
        </DialogHeader>
        <AddSavingsGoalForm onSubmit={handleAddSavingsGoal} />
      </DialogContent>
    </Dialog>
  )
}

export { AddSavingsGoalDialog }

// Interfaces
interface AddSavingsGoalDialogProps {}
