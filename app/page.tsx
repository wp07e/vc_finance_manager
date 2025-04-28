import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import Link from 'next/link'

export default function Home() {
  return (
    <main className="min-h-screen p-6 lg:p-24">
      <div className="max-w-5xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold tracking-tight sm:text-6xl">
            Modern Personal Finance
          </h1>
          <p className="mt-6 text-lg leading-8 text-muted-foreground">
            Take control of your finances with our powerful and easy-to-use
            platform. Track expenses, manage budgets, and achieve your financial
            goals.
          </p>
          <div className="mt-10 flex items-center justify-center gap-x-6">
            <Button asChild size="lg">
              <Link href="/register">Get started</Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link href="/login">Sign in</Link>
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          <Feature
            title="Expense Tracking"
            description="Keep track of every penny with our intuitive expense tracking system."
          />
          <Feature
            title="Budget Management"
            description="Create and manage budgets to help you stay on top of your spending."
          />
          <Feature
            title="Financial Insights"
            description="Get valuable insights into your spending habits and financial health."
          />
        </div>
      </div>
    </main>
  )
}

function Feature({ title, description }: { title: string; description: string }) {
  return (
    <Card className="p-6">
      <h3 className="text-lg font-semibold">{title}</h3>
      <p className="mt-2 text-muted-foreground">{description}</p>
    </Card>
  )
}