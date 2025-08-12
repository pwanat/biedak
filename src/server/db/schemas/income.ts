import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgEnum,
  pgTable,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema, createUpdateSchema } from 'drizzle-zod'
import { z } from 'zod'
import { currencyEnum } from '../enums'

export const incomeStatusEnum = pgEnum('status', ['pending', 'done'])
export type IncomeStatus = typeof incomeStatusEnum.enumValues[number]

export const incomeTable = pgTable(
  'biedak_income',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 1024 }),
    amount: integer('amount').notNull(),
    currency: currencyEnum().notNull(),
    status: incomeStatusEnum().notNull(),
    occurredOn: timestamp('occurred_on', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
  },
  (table) => [
    { nameIndex: index('name_idx').on(table.name) },
    { userIndex: index('user_idx').on(table.userId) },
  ]
)

// export const expenseSelectSchema = createSelectSchema(expensesTable)
// export type ExpenseSelect = z.infer<typeof expenseSelectSchema>

export type IncomeSelect = {
  id: number
  userId: string
  name: string
  description?: string
  amount: number
  currency: string
  status: IncomeStatus
  occurredOn: string
  createdAt: string
  updatedAt: string
}

export const incomeInsertSchema = createInsertSchema(incomeTable, {
  id: false,
  createdAt: false,
  updatedAt: false,
})
export type IncomeInsert = z.infer<typeof incomeInsertSchema>

export const incomeUpdateSchema = createUpdateSchema(incomeTable, {
  id: false,
  createdAt: false,
  updatedAt: true,
})
export type IncomeUpdate = z.infer<typeof incomeUpdateSchema>