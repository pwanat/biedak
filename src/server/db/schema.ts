import { pgTableCreator } from 'drizzle-orm/pg-core'

/**
 * This is an example of how to use the multi-project schema feature of Drizzle ORM. Use the same
 * database instance for multiple projects.
 *
 * @see https://orm.drizzle.team/docs/goodies#multi-project-schema
 */
export const createTable = pgTableCreator((name) => `biedak_${name}`)

export * from './enums'
export * from './schemas/expenses'
export * from './schemas/income'
export * from './schemas/categories'