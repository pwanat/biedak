// Example model schema from the Drizzle docs
// https://orm.drizzle.team/docs/sql-schema-declaration
import { sql } from 'drizzle-orm'
import {
  index,
  integer,
  pgTableCreator,
  serial,
  timestamp,
  varchar,
} from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `biedak_${name}`)

export const expenses = createTable(
  'expense',
  {
    // id: integer('id').primaryKey().generatedByDefaultAsIdentity(),
    id: serial('id').primaryKey(),
    userId: varchar('user_id', { length: 256 }).notNull(),
    title: varchar('title', { length: 256 }).notNull(),
    description: varchar('description', { length: 1024 }),
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
  (table) => [{ titleIndex: index('title_idx').on(table.title) }]
)
