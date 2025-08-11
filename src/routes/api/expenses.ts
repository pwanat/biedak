import axios from 'axios'
import { clerkClient, getAuth } from '@clerk/tanstack-react-start/server'
import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { expensesTable } from '~/server/db/schema'
import { getClerkUserId } from '~/utils/clerk'

export const ServerRoute = createServerFileRoute('/api/expenses').methods({
  GET: async ({ request, params }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      console.log('📝 Fetching expenses for user:', userId)

      // Fetch expenses from the database
      const expenses = await db
        .select()
        .from(expensesTable)
        .where(eq(expensesTable.userId, userId))
        .orderBy(expensesTable.occurredOn)

      return json(expenses)
    } catch (error) {
      console.error('❌ Error fetching expenses:', error)
      return json({ error: 'Failed to fetch expenses' }, { status: 500 })
    }
  },
  POST: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { name, description, amount, occurredOn, categoryId } = await request.json()
      console.log('📝 Creating expense for user:', userId)

      // Insert into database
      const [newExpense] = await db
        .insert(expensesTable)
        .values({
          userId,
          name,
          categoryId,
          description,
          amount,
          occurredOn: new Date(occurredOn),
          currency: 'PLN',
          status: 'done',
        })
        .returning()

      console.log('✅ Created expense:', newExpense)

      return json({
        success: true,
        data: newExpense,
      })
    } catch (error) {
      console.error('❌ Error processing request:', error)
      return json({ error: 'Failed to process request' }, { status: 500 })
    }
  },
  DELETE: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id } = await request.json()
      console.log('🗑️ Deleting expense:', id, 'for user:', userId)

      // Delete from database with owner check
      const [deletedExpense] = await db
        .delete(expensesTable)
        .where(
          and(
            eq(expensesTable.id, id),
            eq(expensesTable.userId, userId)
          )
        )
        .returning()

      if (!deletedExpense) {
        return json({ error: 'Expense not found' }, { status: 404 })
      }

      console.log('✅ Deleted expense:', deletedExpense)

      return json({
        success: true,
        data: deletedExpense,
      })
    } catch (error) {
      console.error('❌ Error deleting expense:', error)
      return json({ error: 'Failed to delete expense' }, { status: 500 })
    }
  },
})
