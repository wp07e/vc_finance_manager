'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { format } from 'date-fns'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { toast } from 'sonner'
import { createBudget } from '@/services/budgets'
import { useMutation, useQueryClient, useQuery } from '@tanstack/react-query'
import { getCategories } from '@/services/categories'
import { Skeleton } from '@/components/ui/skeleton'

const budgetFormSchema = z.object({
  category: z.string().min(1, 'Please select a category'),
  amount: z.string().refine((val) => !isNaN(Number(val)) && Number(val) > 0, {
    message: 'Amount must be a positive number',
  }),
  period: z.enum(['weekly', 'monthly']),
})

type BudgetFormValues = z.infer<typeof budgetFormSchema>

export function AddBudgetForm() {
  const queryClient = useQueryClient()

  const form = useForm<BudgetFormValues>({
    resolver: zodResolver(budgetFormSchema),
    defaultValues: {
      category: '',
      amount: '',
      period: 'monthly',
    },
  })

  const { data: categories, isLoading: isLoadingCategories, error: categoriesError } = useQuery({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const { mutate: addBudget, isPending } = useMutation({
    mutationFn: async (values: BudgetFormValues) => {
      return createBudget({
        category: values.category,
        amount: Number(values.amount),
        period: values.period,
        startDate: new Date(),
      })
    },
    onSuccess: () => {
      toast.success('Budget created successfully')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
    onError: (error) => {
      toast.error('Failed to create budget: ' + error.message)
    },
  })

  function onSubmit(values: BudgetFormValues) {
    addBudget(values)
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
          name="period"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Period</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a period" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="weekly">Weekly</SelectItem>
                  <SelectItem value="monthly">Monthly</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full" disabled={isPending}>
          {isPending ? 'Creating budget...' : 'Create Budget'}
        </Button>
      </form>
    </Form>
  )
}
