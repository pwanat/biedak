import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { and, eq } from 'drizzle-orm'
import { db } from '~/server/db'
import { incomeTable } from '~/server/db/schema'
import { getClerkUserId } from '~/utils/clerk'

export const ServerRoute = createServerFileRoute('/api/income').methods({
  GET: async ({ request, params }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      console.log('📝 Fetching income for user:', userId)

      // Fetch income from the database
      const income = await db
        .select()
        .from(incomeTable)
        .where(eq(incomeTable.userId, userId))
        .orderBy(incomeTable.occurredOn)

      return json(income)
    } catch (error) {
      console.error('❌ Error fetching income:', error)
      return json({ error: 'Failed to fetch income' }, { status: 500 })
    }
  },
  POST: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { name, description, amount, occurredOn } = await request.json()
      console.log('📝 Creating income for user:', userId)

      // Insert into database
      const [newIncome] = await db
        .insert(incomeTable)
        .values({
          userId,
          name,
          description,
          amount,
          occurredOn: new Date(occurredOn),
          currency: 'PLN',
          status: 'done',
        })
        .returning()

      console.log('✅ Created income:', newIncome)

      return json({
        success: true,
        data: newIncome,
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
      console.log('🗑️ Deleting income:', id, 'for user:', userId)

      // Delete from database with owner check
      const [deletedIncome] = await db
        .delete(incomeTable)
        .where(and(eq(incomeTable.id, id), eq(incomeTable.userId, userId)))
        .returning()

      if (!deletedIncome) {
        return json({ error: 'Income not found' }, { status: 404 })
      }

      console.log('✅ Deleted income:', deletedIncome)

      return json({
        success: true,
        data: deletedIncome,
      })
    } catch (error) {
      console.error('❌ Error deleting income:', error)
      return json({ error: 'Failed to delete income' }, { status: 500 })
    }
  },
  PUT: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { id, name, description, amount, occurredOn } = await request.json()
      console.log('📝 Updating income:', id, 'for user:', userId)

      // Update in database with owner check
      const [updatedIncome] = await db
        .update(incomeTable)
        .set({
          name,
          description,
          amount,
          occurredOn: new Date(occurredOn),
          updatedAt: new Date(),
        })
        .where(and(eq(incomeTable.id, id), eq(incomeTable.userId, userId)))
        .returning()

      if (!updatedIncome) {
        return json({ error: 'Income not found' }, { status: 404 })
      }

      console.log('✅ Updated income:', updatedIncome)

      return json({
        success: true,
        data: updatedIncome,
      })
    } catch (error) {
      console.error('❌ Error updating income:', error)
      return json({ error: 'Failed to update income' }, { status: 500 })
    }
  },
})
