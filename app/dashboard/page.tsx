export default function DashboardPage() {
  return (
    <div className="container py-8">
      <h1 className="text-3xl font-bold">Dashboard</h1>
      <div className="mt-8 grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Total Balance</h2>
          <p className="mt-2 text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Monthly Expenses</h2>
          <p className="mt-2 text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Monthly Income</h2>
          <p className="mt-2 text-2xl font-bold">$0.00</p>
        </div>
        <div className="rounded-lg border p-4">
          <h2 className="font-semibold">Savings</h2>
          <p className="mt-2 text-2xl font-bold">$0.00</p>
        </div>
      </div>
      
      <div className="mt-8">
        <h2 className="text-xl font-semibold">Recent Transactions</h2>
        <div className="mt-4 rounded-lg border">
          <div className="p-4 text-center text-sm text-muted-foreground">
            No transactions yet
          </div>
        </div>
      </div>
    </div>
  )
}