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
import { categoriesTable } from './categories'

export const currencyEnum = pgEnum('currency', ['PLN'])
export const statusEnum = pgEnum('status', ['pending', 'done', 'rejected'])

export const expensesTable = pgTable(
  'biedak_expense',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    name: varchar('name', { length: 256 }).notNull(),
    description: varchar('description', { length: 1024 }),
    amount: integer('amount').notNull(),
    currency: currencyEnum().notNull(),
    status: statusEnum().notNull(),
    occurredOn: timestamp('occurred_on', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true }).$onUpdate(
      () => new Date()
    ),
    categoryId: integer('category_id')
      .references(() => categoriesTable.id)
      .notNull(),
  },
  (table) => [
    { nameIndex: index('name_idx').on(table.name) },
    { userIndex: index('user_idx').on(table.userId) },
    { categoryIndex: index('category_idx').on(table.categoryId) },
  ]
)

export const expenseSelectSchema = createSelectSchema(expensesTable, {})
export type ExpenseSelect = z.infer<typeof expenseSelectSchema>

export const expenseInsertSchema = createInsertSchema(expensesTable, {
  id: false,
  createdAt: false,
  updatedAt: false,
})
export type ExpenseInsert = z.infer<typeof expenseInsertSchema>

export const expenseUpdateSchema = createUpdateSchema(expensesTable, {
  id: false,
  createdAt: false,
  updatedAt: true,
})
export type ExpenseUpdate = z.infer<typeof expenseUpdateSchema>