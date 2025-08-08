// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgEnum,
  pgTable,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'
import { createInsertSchema, createUpdateSchema } from 'drizzle-zod';
import z from 'zod';

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `biedak_${name}`)

export const currencyEnum = pgEnum('currency', ['PLN']);
export const statusEnum = pgEnum('status', ['pending', 'done', 'rejected']);

export const expensesTable = createTable(
  'expense',
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
  },
  (table) => [{ nameIndex: index('name_idx').on(table.name) }, { userIndex: index('user_idx').on(table.userId) }]
)

export const expenseSelectSchema = createInsertSchema(expensesTable, {});
export type ExpenseSelect = z.infer<typeof expenseSelectSchema>;

export const expenseInsertSchema = createInsertSchema(expensesTable, {
  id: false, // id is auto-generated
  createdAt: false, // createdAt is auto-generated
  updatedAt: false, // updatedAt is auto-generated
});

export const expenseUpdateSchema = createUpdateSchema(expensesTable, {
  id: false, // id is not updated
  createdAt: false, // createdAt is not updated
  updatedAt: true, // updatedAt is updated on every update
});