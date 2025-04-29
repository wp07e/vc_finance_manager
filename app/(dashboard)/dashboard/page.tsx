"use client";

import { useAuth } from "@/lib/auth/auth-provider";
import { Card } from "@/components/ui/card";
import { RecentExpenses } from "@/components/dashboard/recent-expenses";
import { BudgetOverview } from "@/components/dashboard/budget-overview";
import { ExpenseSummary } from "@/components/dashboard/expense-summary";
import { AddExpenseDialog } from "@/components/expenses/add-expense-dialog";
import { Suspense } from "react";
import { redirect } from "next/navigation";

function LoadingCard() {
  return (
    <Card className="p-6">
      <div className="h-20 animate-pulse rounded-md bg-muted" />
    </Card>
  );
}

export default function DashboardPage() {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <LoadingCard />
        <LoadingCard />
        <LoadingCard />
      </div>
    );
  }

  if (!user) {
    redirect("/login");
  }

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Dashboard</h1>
        <AddExpenseDialog />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <ExpenseSummary />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <BudgetOverview />
          </Card>
        </Suspense>

        <Suspense fallback={<LoadingCard />}>
          <Card className="p-6">
            <RecentExpenses />
          </Card>
        </Suspense>
      </div>
    </div>
  );
}
