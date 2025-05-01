'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { format } from 'date-fns'
import { CalendarIcon } from '@radix-ui/react-icons'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { updateExpense } from '@/services/expenses'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { getCategories } from '@/services/categories'
import { Skeleton } from '@/components/ui/skeleton'
import type { Expense } from '@/types'

const expenseFormSchema = z.object({
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  category: z.string().min(1, 'Please select a category'),
  description: z.string().min(3, 'Description must be at least 3 characters'),
  date: z.date(),
})

type ExpenseFormValues = z.infer<typeof expenseFormSchema>

interface EditExpenseDialogProps {
  expense: Expense
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function EditExpenseDialog({ expense, isOpen, onOpenChange }: EditExpenseDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<ExpenseFormValues>({
    resolver: zodResolver(expenseFormSchema),
    defaultValues: {
      amount: String(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date,
    },
  })

  // Reset form with new expense data when expense prop changes
  useEffect(() => {
    form.reset({
      amount: String(expense.amount),
      category: expense.category,
      description: expense.description,
      date: expense.date,
    })
  }, [expense, form])

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { mutate: updateExpenseMutation, isPending } = useMutation({
    mutationFn: async (values: ExpenseFormValues) => {
      return updateExpense({
        id: expense.id,
        amount: Number(values.amount),
        category: values.category,
        description: values.description,
        date: values.date,
      })
    },
    onSuccess: () => {
      toast.success('Expense updated successfully')
      onOpenChange(false) // Close dialog on success
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
    },
    onError: (error) => {
      toast.error('Failed to update expense: ' + error.message)
    },
  })

  function onSubmit(values: ExpenseFormValues) {
    updateExpenseMutation(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Expense</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="amount"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <Input
                      type="number"
                      step="0.01"
                      placeholder="Enter amount"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="category"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Category</FormLabel>
                  {isLoadingCategories && <Skeleton className="h-10 w-full" />}
                  {categoriesError && (
                    <p className="text-sm font-medium text-destructive">
                      Failed to load categories.
                    </p>
                  )}
                  {categories && (
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select a category" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {categories.map((category) => (
                          <SelectItem key={category.id} value={category.name}>
                            {category.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  )}
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter description" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="date"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Date</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            'w-full pl-3 text-left font-normal',
                            !field.value && 'text-muted-foreground'
                          )}
                        >
                          {field.value ? (
                            format(field.value, 'PPP')
                          ) : (
                            <span>Pick a date</span>
                          )}
                          <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        disabled={(date) =>
                          date > new Date() || date < new Date('1900-01-01')
                        }
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />

            <Button type="submit" className="w-full" disabled={isPending}>
              {isPending ? 'Saving changes...' : 'Save Changes'}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
