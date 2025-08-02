import { createFileRoute } from '@tanstack/react-router'
import Expenses from '@/features/expenses'

export const Route = createFileRoute('/_authenticated/expenses/')({
  loader: async ({ context: { trpc, queryClient } }) => {
    await queryClient.ensureQueryData(trpc.posts.queryOptions())
    return
  },
  component: Expenses,
})
