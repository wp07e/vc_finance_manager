'use client'

import { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Card } from '@/components/ui/card'
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { createCategory, getCategories, deleteCategory } from '@/services/categories'
import { toast } from 'sonner'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { MoreHorizontal } from 'lucide-react'
import { EditCategoryDialog } from './edit-category-dialog'
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

export function CategoryManagement() {
  const [selectedIcon, setSelectedIcon] = useState<string>(iconOptions[0])
  const queryClient = useQueryClient()
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

  const { data: categories, isLoading } = useQuery<Category[]>({
    queryKey: ['categories'],
    queryFn: getCategories,
  })

  const form = useForm<CategoryFormValues>({
    resolver: zodResolver(categoryFormSchema),
    defaultValues: {
      name: '',
      color: '#000000',
      icon: iconOptions[0],
    },
  })

  const { mutate: addCategory, isPending: isCreating } = useMutation({
    mutationFn: createCategory,
    onSuccess: () => {
      toast.success('Category created successfully')
      form.reset()
      queryClient.invalidateQueries({ queryKey: ['categories'] })
    },
    onError: (error) => {
      toast.error('Failed to create category: ' + error.message)
    },
  })

  const { mutate: removeCategory, isPending: isDeleting } = useMutation({
    mutationFn: deleteCategory,
    onSuccess: () => {
      toast.success('Category deleted successfully')
      queryClient.invalidateQueries({ queryKey: ['categories'] })
      // Also invalidate expenses and budgets queries as category names might be displayed there
      queryClient.invalidateQueries({ queryKey: ['expenses'] })
      queryClient.invalidateQueries({ queryKey: ['budgets'] })
    },
    onError: (error) => {
      toast.error('Failed to delete category: ' + error.message)
    },
  })

  function onSubmit(values: CategoryFormValues) {
    addCategory({
      name: values.name,
      color: values.color,
      icon: selectedIcon,
    })
  }

  function handleDelete(categoryId: string) {
    removeCategory(categoryId)
  }

  function handleEdit(category: Category) {
    setSelectedCategory(category)
    setIsEditDialogOpen(true)
  }

  return (
    <Card className="p-6">
      <Tabs defaultValue="list" className="space-y-4">
        <TabsList>
          <TabsTrigger value="list">Categories</TabsTrigger>
          <TabsTrigger value="add">Add New</TabsTrigger>
        </TabsList>

        <TabsContent value="list" className="space-y-4">
          {isLoading ? (
            <div>Loading categories...</div>
          ) : categories && categories.length > 0 ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-lg border flex flex-col items-center"
                  style={{ borderColor: category.color }}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium text-center">{category.name}</div>
                  {!category.id.startsWith('default-') && (
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" className="h-8 w-8 p-0 mt-2">
                          <span className="sr-only">Open menu</span>
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => handleEdit(category)}>Edit</DropdownMenuItem>
                        <DropdownMenuItem onClick={() => handleDelete(category.id)}>Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div>No categories found</div>
          )}
        </TabsContent>

        <TabsContent value="add">
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
                          variant={selectedIcon === icon ? 'default' : 'outline'}
                          className="text-2xl p-2 h-12"
                          onClick={() => {
                            setSelectedIcon(icon)
                            field.onChange(icon)
                          }}
                        >
                          {icon}
                        </Button>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isCreating}>
                {isCreating ? 'Creating category...' : 'Create Category'}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
      {selectedCategory && (
        <EditCategoryDialog
          category={selectedCategory}
          isOpen={isEditDialogOpen}
          onOpenChange={setIsEditDialogOpen}
        />
      )}
    </Card>
  )
}
