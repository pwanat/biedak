import { ExpenseStatus } from '~/server/db/schema'

export type Expense = {
  id: number
  userId: string
  name: string
  description?: string
  amount: number
  currency: string
  categoryId: number
  status: ExpenseStatus
  occurredOn: Date
  createdAt: Date
  updatedAt: Date
}
