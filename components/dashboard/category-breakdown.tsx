"use client";

import { useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useQuery } from "@tanstack/react-query";
import { getCurrentExpenses } from "@/services/expenses";
import { startOfMonth } from "date-fns";
import { DonutChart } from "@tremor/react";

export function CategoryBreakdown() {
  const {
    data: expenses,
    isLoading,
    error,
  } = useQuery({
    queryKey: ["expenses", "current-month"],
    queryFn: getCurrentExpenses,
  });

  const chartData = useMemo(() => {
    if (!expenses) return [];

    const categoryTotals = expenses.reduce(
      (acc, expense) => {
        acc[expense.category] = (acc[expense.category] || 0) + expense.amount;
        return acc;
      },
      {} as Record<string, number>,
    );

    return Object.entries(categoryTotals).map(([category, amount]) => ({
      category,
      amount,
    }));
  }, [expenses]);

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <Skeleton className="h-[300px] w-full" />
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Error</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground">
            Failed to load category breakdown
          </p>
        </CardContent>
      </Card>
    );
  }

  if (chartData.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Category Breakdown</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-muted-foreground text-center py-10">
            No expenses found for this month
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Category Breakdown</CardTitle>
      </CardHeader>
      <CardContent>
        <DonutChart
          className="mt-4 h-[300px]"
          data={chartData}
          category="amount"
          index="category"
          valueFormatter={(value) => `$${value.toLocaleString()}`}
          colors={[
            "blue",
            "cyan",
            "indigo",
            "violet",
            "fuchsia",
            "rose",
            "orange",
            "amber",
          ]}
          showAnimation={true}
        />
      </CardContent>
    </Card>
  );
}
