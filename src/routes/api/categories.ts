import axios from 'axios'
import { clerkClient, getAuth } from '@clerk/tanstack-react-start/server'
import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { eq, or } from 'drizzle-orm'
import { db } from '~/server/db'
import { categoriesTable } from '~/server/db/schema'
import { getClerkUserId } from '~/utils/clerk'

export const ServerRoute = createServerFileRoute('/api/categories').methods({
  GET: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      console.log('📝 Fetching categories for user:', userId)

      // Fetch categories from the database
      const categories = await db
        .select()
        .from(categoriesTable)
        .where(
          or(
            eq(categoriesTable.userId, userId),
            eq(categoriesTable.type, 'default')
          )
        )
        .orderBy(categoriesTable.name)

      return json(categories)
    } catch (error) {
      console.error('❌ Error fetching categories:', error)
      return json({ error: 'Failed to fetch categories' }, { status: 500 })
    }
  },
})
