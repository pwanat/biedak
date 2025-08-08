import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgTable,
  timestamp,
  varchar,
  pgEnum,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createSelectSchema } from 'drizzle-zod'
import { z } from 'zod'

export const categoryTypeEnum = pgEnum('category_type', ['default', 'custom'])

export const defaultCategories = [
  { name: 'food', label: 'Food & Drinks', type: 'default' },
  { name: 'transport', label: 'Transport', type: 'default' },
  { name: 'entertainment', label: 'Entertainment', type: 'default' },
  { name: 'shopping', label: 'Shopping', type: 'default' },
  { name: 'bills', label: 'Bills & Utilities', type: 'default' },
  { name: 'health', label: 'Healthcare', type: 'default' },
  { name: 'home', label: 'Home & Living', type: 'default' },
  { name: 'education', label: 'Education', type: 'default' },
] as const

export const categoriesTable = pgTable(
  'biedak_category',
  {
    id: integer().primaryKey().generatedAlwaysAsIdentity(),
    name: varchar('name', { length: 256 }).notNull(),
    label: varchar('label', { length: 256 }).notNull(),
    userId: varchar('user_id', { length: 256 }),
    type: categoryTypeEnum('type').notNull().default('custom'),
    createdAt: timestamp('created_at', { withTimezone: true })
      .default(sql`CURRENT_TIMESTAMP`)
      .notNull(),
    updatedAt: timestamp('updated_at', { withTimezone: true })
      .$onUpdate(() => new Date()),
  },
  (table) => [
    { nameIndex: index('category_name_idx').on(table.name) },
    { userIndex: index('category_user_idx').on(table.userId) },
    { typeIndex: index('category_type_idx').on(table.type) },
  ]
)

// Schema for selecting categories
export const categorySelectSchema = createSelectSchema(categoriesTable)
export type CategorySelect = z.infer<typeof categorySelectSchema>

// Schema for inserting new categories
export const categoryInsertSchema = createInsertSchema(categoriesTable, {
  id: false,
  createdAt: false,
  updatedAt: false,
  type: false, // type will be set automatically
})
export type CategoryInsert = z.infer<typeof categoryInsertSchema>