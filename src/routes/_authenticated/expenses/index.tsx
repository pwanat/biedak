import { createFileRoute } from '@tanstack/react-router'
import Expenses from '~/features/expenses'
import { categoriesQueryOptions } from '~/queries/categories';
import { expensesQueryOptions } from '~/queries/expenses';

export const Route = createFileRoute('/_authenticated/expenses/')({
    loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(expensesQueryOptions());
      await context.queryClient.ensureQueryData(categoriesQueryOptions());
    },
  component: Expenses,
})

