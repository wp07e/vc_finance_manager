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
import { AddInvestmentForm } from './add-investment-form'
import { addInvestment } from '@/services/investments'
import { InvestmentInput, investmentSchema } from '@/lib/validations/schema'

function AddInvestmentDialog() {
  const [isOpen, setIsOpen] = useState(false)

  const handleAddInvestment = async (values: InvestmentInput) => {
    try {
      // TODO: Get the actual userId
      const userId = 'placeholder-user-id'
      await addInvestment({ ...values, userId })
      toast.success('Investment added successfully!')
      setIsOpen(false)
    } catch (error) {
      console.error('Error adding investment:', error)
      toast.error('Failed to add investment. Please try again.')
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button>Add Investment</Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Add New Investment</DialogTitle>
        </DialogHeader>
        <AddInvestmentForm onSubmit={handleAddInvestment} />
      </DialogContent>
    </Dialog>
  )
}

export { AddInvestmentDialog }

// Interfaces
interface AddInvestmentDialogProps {}
