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
import { createCategory, getCategories } from '@/services/categories'
import { toast } from 'sonner'

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

  const { data: categories, isLoading } = useQuery({
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

  const { mutate: addCategory, isPending } = useMutation({
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

  function onSubmit(values: CategoryFormValues) {
    addCategory({
      name: values.name,
      color: values.color,
      icon: selectedIcon,
    })
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
          ) : categories?.length ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div
                  key={category.id}
                  className="p-4 rounded-lg border"
                  style={{ borderColor: category.color }}
                >
                  <div className="text-2xl mb-2">{category.icon}</div>
                  <div className="font-medium">{category.name}</div>
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

              <Button type="submit" className="w-full" disabled={isPending}>
                {isPending ? 'Creating category...' : 'Create Category'}
              </Button>
            </form>
          </Form>
        </TabsContent>
      </Tabs>
    </Card>
  )
}