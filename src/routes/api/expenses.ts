import axios from 'axios'
import { clerkClient, getAuth } from '@clerk/tanstack-react-start/server'
import { json } from '@tanstack/react-start'
import { createServerFileRoute } from '@tanstack/react-start/server'
import { db } from '~/server/db'
import { expensesTable } from '~/server/db/schema'
import { getClerkUserId } from '~/utils/clerk'
import type { User } from '../../utils/users'

export const ServerRoute = createServerFileRoute('/api/expenses').methods({
  GET: async ({ request, params }) => {
    const userId = await getClerkUserId(request)
    console.log(userId, 'user')

    const res = await axios.get<Array<User>>(
      'https://jsonplaceholder.typicode.com/users'
    )

    const list = res.data.slice(0, 10)
    return json(list.map((u) => ({ id: u.id, name: u.name, email: u.email })))
  },
  POST: async ({ request }) => {
    try {
      const userId = await getClerkUserId(request)
      if (!userId) {
        return json({ error: 'Unauthorized' }, { status: 401 })
      }

      const { name, description, amount, occurredOn } = await request.json()
      console.log('📝 Creating expense for user:', userId)

      // Insert into database
      const [newExpense] = await db
        .insert(expensesTable)
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
})
