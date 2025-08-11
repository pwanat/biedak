import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { ExpenseForm } from '~/features/expenses/components/expense-mutate-drawer'
import { ExpenseSelect } from '~/server/db/schema'
import { queryClient } from '~/utils/query-client'
import { Expense } from '~/models/expense'

export type User = {
  id: number
  name: string
  email: string
}


export const DEPLOY_URL = 'http://localhost:3000'
export const GET_EXPENSES_PATH = `/api/expenses`

const mapAmountToCents = (amount: number) => Math.round(amount * 100)

const mapExpenseResponse = (expense: ExpenseSelect): Expense => ({
  ...expense,
  occurredOn: new Date(expense?.occurredOn),
  createdAt: new Date(expense?.createdAt),
  updatedAt: new Date(expense?.updatedAt),
})

const fetchExpenses = async (): Promise<Expense[]> => {
  console.info('Fetching expenses...')
  const response = await axios.get<Array<ExpenseSelect>>(GET_EXPENSES_PATH)
  return response.data.map(mapExpenseResponse)
}

export const expensesQueryOptions = () =>
  queryOptions({
    queryKey: [GET_EXPENSES_PATH],
    queryFn: fetchExpenses,
  })

export const postExpenseMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({ amount, categoryId, ...data }: ExpenseForm) =>
      (
        await axios.post<ExpenseForm>(GET_EXPENSES_PATH, {
          amount: mapAmountToCents(amount),
          categoryId,
          ...data,
        })
      ).data,
    onSuccess: (_data) => {
      toast.success('Expense created successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_EXPENSES_PATH] })
    },
    onError: (error) => {
      console.error('Error creating expense:', error)
      toast.error('Failed to create expense')
      throw new Error('Failed to create expense')
    },
  })

export const deleteExpenseMutationOptions = () =>
  mutationOptions({
    mutationFn: async (id: number) =>
      (await axios.delete<ExpenseSelect>(GET_EXPENSES_PATH, { data: { id } })).data,
    onSuccess: (_data) => {
      toast.success('Expense deleted successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_EXPENSES_PATH] })
    },
    onError: (error) => {
      console.error('Error deleting expense:', error)
      toast.error('Failed to delete expense')
      throw new Error('Failed to delete expense')
    },
  })
