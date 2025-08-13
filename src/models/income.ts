import { IncomeStatus } from '~/server/db/schema'

export type Income = {
  id: number
  userId: string
  name: string
  description?: string
  amount: number
  currency: string
  status: IncomeStatus
  occurredOn: Date
  createdAt: Date
  updatedAt: Date
}
