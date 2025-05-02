import * as z from "zod"

export const expenseSchema = z.object({
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  category: z.string().min(1, "Category is required"),
  description: z.string().min(1, "Description is required"),
  date: z.date(),
  tags: z.array(z.string()).optional(),
})

export const budgetSchema = z.object({
  category: z.string().min(1, "Category is required"),
  amount: z.number().min(0.01, "Amount must be greater than 0"),
  period: z.enum(["weekly", "monthly"], {
    required_error: "Period is required",
  }),
  startDate: z.date(),
})

export const userSettingsSchema = z.object({
  theme: z.enum(["light", "dark", "system"]),
  currency: z.string().min(1, "Currency is required"),
  notifications: z.object({
    email: z.boolean(),
    push: z.boolean(),
  }),
  displayName: z.string().optional(),
  photoURL: z.string().optional(),
})

export type ExpenseInput = z.infer<typeof expenseSchema>
export type BudgetInput = z.infer<typeof budgetSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>

export const savingsGoalSchema = z.object({
  name: z.string().min(2, "Goal name must be at least 2 characters."),
  targetAmount: z.number().positive("Target amount must be a positive number."),
  deadline: z.string(), // TODO: Refine date validation
})

export type SavingsGoalInput = z.infer<typeof savingsGoalSchema>

export const investmentSchema = z.object({
  name: z.string().min(2, "Investment name must be at least 2 characters."),
  type: z.enum(["stock", "crypto", "mutual fund"], {
    required_error: "Investment type is required.",
  }),
  quantity: z.number().positive("Quantity must be a positive number."),
  purchasePrice: z.number().positive("Purchase price must be a positive number."),
})

export type InvestmentInput = z.infer<typeof investmentSchema>
