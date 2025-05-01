"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getCurrentExpenses } from "@/services/expenses";
import { getBudgets } from "@/services/budgets";
import { startOfMonth } from "date-fns";
import { TrendingUpIcon, TrendingDownIcon } from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function NetWorthSummary() {
  const { data: expenses } = useQuery({
    queryKey: ["expenses", "current-month"],
    queryFn: getCurrentExpenses,
  });

  const stats = useMemo(() => {
    if (!expenses) return null;

    const currentMonth = startOfMonth(new Date());

    const totalMonthlyExpenses = expenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    // In a real app, we would also fetch income and assets
    // For now, we'll use placeholder data
    const monthlyIncome = 5000; // Placeholder
    const assets = 25000; // Placeholder
    const liabilities = totalMonthlyExpenses; // Using monthly expenses as a proxy for monthly liabilities

    const netWorth = assets - liabilities; // This calculation is still simplified
    const monthlyNetIncome = monthlyIncome - totalMonthlyExpenses;

    return {
      netWorth,
      monthlyNetIncome,
      assets,
      liabilities,
    };
  }, [expenses]);

  if (!stats) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Net Worth
            </p>
            <h3 className="text-2xl font-bold">
              ${stats.netWorth.toLocaleString()}
            </h3>
          </div>
          <div
            className={cn(
              "p-2 rounded-full",
              stats.netWorth > 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600",
            )}
          >
            {stats.netWorth > 0 ? (
              <TrendingUpIcon className="w-4 h-4" />
            ) : (
              <TrendingDownIcon className="w-4 h-4" />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              Monthly Net Income
            </p>
            <h3 className="text-2xl font-bold">
              ${stats.monthlyNetIncome.toLocaleString()}
            </h3>
          </div>
          <div
            className={cn(
              "p-2 rounded-full",
              stats.monthlyNetIncome > 0
                ? "bg-green-100 text-green-600"
                : "bg-red-100 text-red-600",
            )}
          >
            {stats.monthlyNetIncome > 0 ? (
              <TrendingUpIcon className="w-4 h-4" />
            ) : (
              <TrendingDownIcon className="w-4 h-4" />
            )}
          </div>
        </div>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Total Assets
        </p>
        <h3 className="text-2xl font-bold">${stats.assets.toLocaleString()}</h3>
      </Card>

      <Card className="p-4">
        <p className="text-sm font-medium text-muted-foreground">
          Total Liabilities
        </p>
        <h3 className="text-2xl font-bold">
          ${stats.liabilities.toLocaleString()}
        </h3>
      </Card>
    </div>
  );
}
