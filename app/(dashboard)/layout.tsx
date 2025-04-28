import { NavigationHeader } from '@/components/navigation-header'

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="min-h-screen">
      <NavigationHeader />
      <div className="container mx-auto p-6">{children}</div>
    </div>
  )
}