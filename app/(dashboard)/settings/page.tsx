'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { Switch } from '@/components/ui/switch'
import { Input } from '@/components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { useTheme } from 'next-themes'
import { toast } from 'sonner'
import { getAuth, updateProfile, updateEmail } from 'firebase/auth'
import { useState } from 'react'
import { DataExport } from '@/components/data-export/data-export'

const currencies = [
  { value: 'USD', label: 'US Dollar ($)' },
  { value: 'EUR', label: 'Euro (€)' },
  { value: 'GBP', label: 'British Pound (£)' },
  // Add more currencies as needed
]

const profileFormSchema = z.object({
  displayName: z.string().min(2, 'Display name must be at least 2 characters'),
  email: z.string().email('Please enter a valid email address'),
})

const preferencesFormSchema = z.object({
  currency: z.string().min(1, 'Please select a currency'),
  theme: z.enum(['light', 'dark', 'system']),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
    budgetAlerts: z.boolean(),
    weeklyReport: z.boolean(),
  }),
})

type ProfileFormValues = z.infer<typeof profileFormSchema>
type PreferencesFormValues = z.infer<typeof preferencesFormSchema>

export default function SettingsPage() {
  const { theme, setTheme } = useTheme()
  const [isLoading, setIsLoading] = useState(false)
  const auth = getAuth()
  const user = auth.currentUser

  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      displayName: user?.displayName || '',
      email: user?.email || '',
    },
  })

  const preferencesForm = useForm<PreferencesFormValues>({
    resolver: zodResolver(preferencesFormSchema),
    defaultValues: {
      currency: 'USD',
      theme: (theme as 'light' | 'dark' | 'system') || 'system',
      notifications: {
        email: true,
        push: true,
        budgetAlerts: true,
        weeklyReport: true,
      },
    },
  })

  async function onProfileSubmit(data: ProfileFormValues) {
    if (!user) return

    setIsLoading(true)
    try {
      // Update display name
      if (data.displayName !== user.displayName) {
        await updateProfile(user, {
          displayName: data.displayName,
        })
      }

      // Update email
      if (data.email !== user.email) {
        await updateEmail(user, data.email)
      }

      toast.success('Profile updated successfully')
    } catch (error: any) {
      toast.error('Failed to update profile: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  async function onPreferencesSubmit(data: PreferencesFormValues) {
    setIsLoading(true)
    try {
      // Update theme
      setTheme(data.theme)

      // Save other preferences to user's document in Firestore
      // This would be implemented in a separate service

      toast.success('Preferences updated successfully')
    } catch (error: any) {
      toast.error('Failed to update preferences: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="container max-w-4xl py-8">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Settings</h1>
        <DataExport />
      </div>

      <Tabs defaultValue="profile" className="space-y-8">
        <TabsList>
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="preferences">Preferences</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card className="p-6">
            <Form {...profileForm}>
              <form
                onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={profileForm.control}
                  name="displayName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Display Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={profileForm.control}
                  name="email"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Email</FormLabel>
                      <FormControl>
                        <Input type="email" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Changes'}
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>

        <TabsContent value="preferences">
          <Card className="p-6">
            <Form {...preferencesForm}>
              <form
                onSubmit={preferencesForm.handleSubmit(onPreferencesSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={preferencesForm.control}
                  name="currency"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Currency</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a currency" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {currencies.map((currency) => (
                            <SelectItem
                              key={currency.value}
                              value={currency.value}
                            >
                              {currency.label}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <FormField
                  control={preferencesForm.control}
                  name="theme"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Theme</FormLabel>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a theme" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="light">Light</SelectItem>
                          <SelectItem value="dark">Dark</SelectItem>
                          <SelectItem value="system">System</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />

                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Notifications</h3>
                  <div className="space-y-4">
                    <FormField
                      control={preferencesForm.control}
                      name="notifications.email"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Email Notifications</FormLabel>
                            <FormDescription>
                              Receive notifications via email
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="notifications.budgetAlerts"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Budget Alerts</FormLabel>
                            <FormDescription>
                              Get notified when approaching budget limits
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={preferencesForm.control}
                      name="notifications.weeklyReport"
                      render={({ field }) => (
                        <FormItem className="flex items-center justify-between">
                          <div>
                            <FormLabel>Weekly Report</FormLabel>
                            <FormDescription>
                              Receive weekly spending reports
                            </FormDescription>
                          </div>
                          <FormControl>
                            <Switch
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                </div>

                <Button type="submit" disabled={isLoading}>
                  {isLoading ? 'Saving...' : 'Save Preferences'}
                </Button>
              </form>
            </Form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}