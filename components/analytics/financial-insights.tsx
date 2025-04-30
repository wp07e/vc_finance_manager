"use client";

import { useMemo } from "react";
import { Card } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { getExpenses } from "@/services/expenses";
import { getBudgets } from "@/services/budgets";
import { startOfMonth, isWithinInterval, subMonths } from "date-fns";
import {
  TrendingUpIcon,
  TrendingDownIcon,
  AlertCircleIcon,
} from "lucide-react";
import { cn, formatCurrency } from "@/lib/utils";

export function FinancialInsights() {
  const { data: expenses } = useQuery({
    queryKey: ["expenses"],
    queryFn: getExpenses,
  });

  const { data: budgets } = useQuery({
    queryKey: ["budgets"],
    queryFn: getBudgets,
  });

  const insights = useMemo(() => {
    if (!expenses || !budgets) return [];

    const currentMonth = startOfMonth(new Date());
    const lastMonth = startOfMonth(subMonths(new Date(), 1));

    const currentMonthExpenses = expenses.filter((expense) =>
      isWithinInterval(expense.date, {
        start: currentMonth,
        end: new Date(),
      }),
    );

    const lastMonthExpenses = expenses.filter((expense) =>
      isWithinInterval(expense.date, {
        start: lastMonth,
        end: currentMonth,
      }),
    );

    const currentTotal = currentMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );
    const lastTotal = lastMonthExpenses.reduce(
      (sum, expense) => sum + expense.amount,
      0,
    );

    const insights = [];

    // Spending trend insight
    const spendingChange = ((currentTotal - lastTotal) / lastTotal) * 100;
    insights.push({
      title: "Spending Trend",
      description: `Your spending is ${Math.abs(spendingChange).toFixed(
        1,
      )}% ${spendingChange > 0 ? "higher" : "lower"} than last month`,
      icon: spendingChange > 0 ? TrendingUpIcon : TrendingDownIcon,
      type: spendingChange > 0 ? "warning" : "success",
    });

    // Budget alerts
    const overBudgetCategories = budgets
      .map((budget) => {
        const categoryExpenses = currentMonthExpenses.filter(
          (expense) => expense.category === budget.category,
        );
        const totalSpent = categoryExpenses.reduce(
          (sum, expense) => sum + expense.amount,
          0,
        );
        return {
          category: budget.category,
          budget: budget.amount,
          spent: totalSpent,
          percentage: (totalSpent / budget.amount) * 100,
        };
      })
      .filter((category) => category.percentage > 80);

    if (overBudgetCategories.length > 0) {
      insights.push({
        title: "Budget Alert",
        description: `You're near or over budget in ${
          overBudgetCategories.length
        } categor${overBudgetCategories.length === 1 ? "y" : "ies"}`,
        icon: AlertCircleIcon,
        type: "warning",
      });
    }

    // Add more insights here...

    return insights;
  }, [expenses, budgets]);

  if (!insights.length) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {insights.map((insight, index) => (
        <Card
          key={index}
          className={cn("p-4 flex items-start gap-4", {
            "border-yellow-500 bg-yellow-50 dark:bg-yellow-950":
              insight.type === "warning",
            "border-green-500 bg-green-50 dark:bg-green-950":
              insight.type === "success",
          })}
        >
          <insight.icon
            className={cn("w-5 h-5", {
              "text-yellow-600": insight.type === "warning",
              "text-green-600": insight.type === "success",
            })}
          />
          <div>
            <h3 className="font-medium">{insight.title}</h3>
            <p className="text-sm text-muted-foreground mt-1">
              {insight.description}
            </p>
          </div>
        </Card>
      ))}
    </div>
  );
}
