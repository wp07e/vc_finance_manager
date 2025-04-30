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
})

export type ExpenseInput = z.infer<typeof expenseSchema>
export type BudgetInput = z.infer<typeof budgetSchema>
export type UserSettingsInput = z.infer<typeof userSettingsSchema>