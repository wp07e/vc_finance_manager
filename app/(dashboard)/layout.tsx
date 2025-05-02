'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/lib/auth/auth-provider'
import { NavigationHeader } from '@/components/navigation-header'
import { NotificationsList } from '@/components/notifications/notifications-list'
import { Skeleton } from '@/components/ui/skeleton'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const { user, isLoading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!isLoading && !user) {
      // Redirect to login if not authenticated after loading
      router.push('/login')
    }
  }, [user, isLoading, router])

  if (isLoading) {
    // Optionally show a loading skeleton or spinner while checking auth state
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Skeleton className="h-12 w-12 rounded-full" />
      </div>
    )
  }

  if (!user) {
    // Return null or a minimal loading state if redirecting
    return null
  }

  return (
    <div className="min-h-screen">
      <NavigationHeader />
      {/* Add NotificationsList component */}
      <div className="flex justify-end p-4">
        <NotificationsList />
      </div>
      <div className="container mx-auto sm:p-6 p-4">{children}</div>
    </div>
  )
}
