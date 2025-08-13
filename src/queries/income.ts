import axios from 'axios'
import { queryOptions, mutationOptions } from '@tanstack/react-query'
import { toast } from 'sonner'
import { IncomeSelect } from '~/server/db/schema'
import { queryClient } from '~/utils/query-client'
import { Income } from '~/models/income'
import { mapAmountToCents } from '~/utils/mappers/common'


export const GET_INCOME_PATH = `/api/income`

const mapIncomeResponse = (income: IncomeSelect): Income => ({
  ...income,
  occurredOn: new Date(income?.occurredOn),
  createdAt: new Date(income?.createdAt),
  updatedAt: new Date(income?.updatedAt),
})

const fetchIncome = async (): Promise<Income[]> => {
  console.info('Fetching income...')
  const response = await axios.get<Array<IncomeSelect>>(GET_INCOME_PATH)
  return response.data.map(mapIncomeResponse)
}

export const incomeQueryOptions = () =>
  queryOptions({
    queryKey: [GET_INCOME_PATH],
    queryFn: fetchIncome,
  })

export const postIncomeMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({ amount, ...data }: Income) =>
      (
        await axios.post<IncomeSelect>(GET_INCOME_PATH, {
          amount: mapAmountToCents(amount),
          ...data,
        })
      ).data,
    onSuccess: (_data) => {
      toast.success('Income created successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_INCOME_PATH] })
    },
    onError: (error) => {
      console.error('Error creating income:', error)
      toast.error('Failed to create income')
      throw new Error('Failed to create income')
    },
  })

export const deleteIncomeMutationOptions = () =>
  mutationOptions({
    mutationFn: async (id: number) =>
      (await axios.delete<IncomeSelect>(GET_INCOME_PATH, { data: { id } })).data,
    onSuccess: (_data) => {
      toast.success('Income deleted successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_INCOME_PATH] })
    },
    onError: (error) => {
      console.error('Error deleting income:', error)
      toast.error('Failed to delete income')
      throw new Error('Failed to delete income')
    },
  })

export const putIncomeMutationOptions = () =>
  mutationOptions({
    mutationFn: async ({ id, amount, ...data }: Income & { id: number }) =>
      (
        await axios.put<IncomeSelect>(GET_INCOME_PATH, {
          id,
          amount: mapAmountToCents(amount),
          ...data,
        })
      ).data,
    onSuccess: (_data) => {
      toast.success('Income updated successfully!')
      queryClient.invalidateQueries({ queryKey: [GET_INCOME_PATH] })
    },
    onError: (error) => {
      console.error('Error updating income:', error)
      toast.error('Failed to update income')
      throw new Error('Failed to update income')
    },
  })
