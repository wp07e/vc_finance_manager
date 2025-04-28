'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Button } from './ui/button'
import { ThemeToggle } from './theme-toggle'
import { useAuth } from '@/lib/auth/auth-provider'
import { getAuth, signOut } from 'firebase/auth'
import { toast } from 'sonner'

export function NavigationHeader() {
  const pathname = usePathname()
  const { user } = useAuth()

  const handleSignOut = async () => {
    try {
      const auth = getAuth()
      await signOut(auth)
      toast.success('Signed out successfully')
    } catch (error) {
      toast.error('Failed to sign out')
    }
  }

  const navItems = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/expenses', label: 'Expenses' },
    { href: '/budgets', label: 'Budgets' },
  ]

  return (
    <header className="border-b">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <nav className="flex items-center space-x-4">
          {navItems.map((item) => (
            <Button
              key={item.href}
              variant={pathname === item.href ? 'default' : 'ghost'}
              asChild
            >
              <Link href={item.href}>{item.label}</Link>
            </Button>
          ))}
        </nav>

        <div className="flex items-center space-x-4">
          <ThemeToggle />
          {user ? (
            <Button variant="outline" onClick={handleSignOut}>
              Sign out
            </Button>
          ) : (
            <Button asChild>
              <Link href="/login">Sign in</Link>
            </Button>
          )}
        </div>
      </div>
    </header>
  )
}