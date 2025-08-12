import { createFileRoute } from '@tanstack/react-router'
import Monthly from '~/features/monthly'
import { categoriesQueryOptions } from '~/queries/categories';
import { expensesQueryOptions } from '~/queries/expenses';

export const Route = createFileRoute('/_authenticated/monthly/')({
    loader: async ({ context }) => {
      await context.queryClient.ensureQueryData(expensesQueryOptions());
      await context.queryClient.ensureQueryData(categoriesQueryOptions());
    },
  component: Monthly,
})

