'use client'

import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
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
import { Card } from '@/components/ui/card'
import { getAuth, sendPasswordResetEmail } from 'firebase/auth'
import { useState } from 'react'
import { toast } from 'sonner'
import Link from 'next/link'

const resetSchema = z.object({
  email: z.string().email('Please enter a valid email address'),
})

type ResetFormValues = z.infer<typeof resetSchema>

export default function ForgotPasswordPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [isEmailSent, setIsEmailSent] = useState(false)

  const form = useForm<ResetFormValues>({
    resolver: zodResolver(resetSchema),
    defaultValues: {
      email: '',
    },
  })

  async function onSubmit(data: ResetFormValues) {
    setIsLoading(true)
    try {
      const auth = getAuth()
      await sendPasswordResetEmail(auth, data.email)
      setIsEmailSent(true)
      toast.success('Password reset email sent')
    } catch (error: any) {
      toast.error('Failed to send reset email: ' + error.message)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <Card className="w-full max-w-lg p-6 space-y-6">
        <div className="space-y-2 text-center">
          <h1 className="text-2xl font-bold">Reset Password</h1>
          <p className="text-muted-foreground">
            Enter your email address and we'll send you a link to reset your
            password
          </p>
        </div>

        {isEmailSent ? (
          <div className="space-y-4">
            <p className="text-center text-green-600">
              Check your email for a link to reset your password.
            </p>
            <div className="flex justify-center">
              <Button asChild variant="outline">
                <Link href="/login">Return to Login</Link>
              </Button>
            </div>
          </div>
        ) : (
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Enter your email"
                        {...field}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full" disabled={isLoading}>
                {isLoading ? 'Sending...' : 'Send Reset Link'}
              </Button>

              <div className="text-center">
                <Link
                  href="/login"
                  className="text-sm text-primary hover:underline"
                >
                  Back to Login
                </Link>
              </div>
            </form>
          </Form>
        )}
      </Card>
    </div>
  )
}