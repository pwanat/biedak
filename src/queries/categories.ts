import axios from 'axios'
import { queryOptions } from '@tanstack/react-query'
import { CategorySelect, ExpenseSelect } from '~/server/db/schema'

export type User = {
  id: number
  name: string
  email: string
}

export const DEPLOY_URL = 'http://localhost:3000'

export const categoriesQueryOptions = () =>
  queryOptions({
    queryKey: ['categories'],
    queryFn: () => {
      console.info('Fetching categories...')
      return axios
        .get<Array<CategorySelect>>('/api/categories')
        .then((r) => r.data)
        .catch(() => {
          throw new Error('Failed to fetch categories')
        })
    },
  })