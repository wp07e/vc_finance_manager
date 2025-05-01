'use client'

import { useState, useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
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
import { toast } from 'sonner'
import { updateCategory } from '@/services/categories'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import type { Category } from '@/types'

const categoryFormSchema = z.object({
  name: z.string().min(2, 'Category name must be at least 2 characters'),
  color: z.string().regex(/^#[0-9A-F]{6}$/i, 'Must be a valid hex color'),
  icon: z.string().min(1, 'Please select an icon'),
})

type CategoryFormValues = z.infer<typeof categoryFormSchema>

const iconOptions = [
  '🍕', '🚗', '🛍️', '🎮', '🏥', '🏠', '💡', '✈️', '📚', '📝'
] as const

interface EditCategoryDialogProps {
  category: Category
  isOpen: boolean
  onOpenChange: (isOpen: boolean) => void
}

export function EditCategoryDialog({ category, isOpen, onOpenChange }: EditCategoryDialogProps) {
  const queryClient = useQueryClient()

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: category.name,
      color: category.color,
      icon: category.icon,
    },
  })

  // Reset form with new category data when category prop changes
  useEffect(() => {
    form.reset({
      name: category.name,
      color: category.color,
      icon: category.icon,
    })
  }, [category, form])

  const { mutate: updateCategoryMutation, isPending } = useMutation({
    mutationFn: async (values: CategoryFormValues) => {
      return updateCategory({
        id: category.id,
        name: values.name,
        color: values.color,
        icon: values.icon,
      })
    },
    onSuccess: () => {
      toast.success('Category updated successfully')
      onOpenChange(false) // Close dialog on success
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Also invalidate expenses and budgets queries as category names might be displayed there
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
    onError: (error) => {
      toast.error('Failed to update category: ' + error.message)
    },
  })

  function onSubmit(values: CategoryFormValues) {
    updateCategoryMutation(values)
  }

  return (
    <Dialog open={isOpen} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Edit Category</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter category name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="color"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Color</FormLabel>
                  <FormControl>
                    <div className="flex gap-2">
                      <Input type="color" {...field} />
                      <Input
                        type="text"
                        placeholder="#000000"
                        value={field.value}
                        onChange={(e) => field.onChange(e.target.value)}
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="icon"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Icon</FormLabel>
                  <div className="grid grid-cols-5 gap-2">
                    {iconOptions.map((icon) => (
                      <Button
                        key={icon}
                        type="button"
                        variant={field.value === icon ? 'default' : 'outline'}
                        className="text-2xl p-2 h-12"
                        onClick={() => field.onChange(icon)}
                      >
                        {icon}
                      </Button>
                    ))}
                  </div>
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
