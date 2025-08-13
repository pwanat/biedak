import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { mutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'

// TODO: refactor to ExpensePayload
import { ExpenseForm } from '~/features/expenses/components/expense-mutate-drawer'
import { Expense } from '~/models/expense'
import { ExpenseSelect } from '~/server/db/schema'
import { mapAmountToCents } from '~/utils/mappers/common'
import { queryClient } from '~/utils/query-client'

export type User = {
  id: number
  name: string
  email: string
}

export const DEPLOY_URL = 'http://localhost:3000'
export const GET_EXPENSES_PATH = `/api/expenses`

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
      (await axios.delete<ExpenseSelect>(GET_EXPENSES_PATH, { data: { id } }))
        .data,
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

export const putExpenseMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({
      id,
      amount,
      categoryId,
      ...data
    }: ExpenseForm & { id: number }) =>
      (
        await axios.put<ExpenseSelect>(GET_EXPENSES_PATH, {
          id,
          amount: mapAmountToCents(amount),
          categoryId,
          ...data,
        })
      ).data,
    onSuccess: (_data) => {
      toast.success('Expense updated successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_EXPENSES_PATH] })
    },
    onError: (error) => {
      console.error('Error updating expense:', error)
      toast.error('Failed to update expense')
      throw new Error('Failed to update expense')
    },
  })
