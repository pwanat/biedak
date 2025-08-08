import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'
import { ExpenseForm } from '~/features/expenses/components/expense-mutate-drawer'
import { ExpenseSelect } from '~/server/db/schema'

export type User = {
  id: number
  name: string
  email: string
}

const mapAmountToCents = (amount: number) => Math.round(amount * 100)

export const DEPLOY_URL = 'http://localhost:3000'

export const expensesQueryOptions = () =>
  queryOptions({
    queryKey: ['expenses'],
    queryFn: () => {
      console.info('Fetching expenses...')
      return axios
        .get<Array<ExpenseSelect>>('/api/expenses')
        .then((r) => r.data)
        .catch(() => {
          throw new Error('Failed to fetch expenses')
        })
    },
  })

export const postExpenseMutationOptions = () =>
  mutationOptions({
    mutationFn: ({ amount, ...data }: ExpenseForm) =>
      axios
        .post<ExpenseForm>('/api/expenses', {
          amount: mapAmountToCents(amount),
          ...data,
        })
        .then((r) => r.data)
        .catch((error) => {
          console.error('Error creating expense:', error)
          throw new Error('Failed to create expense')
        }),
  })
