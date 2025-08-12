import { useSuspenseQuery } from '@tanstack/react-query'
import { expensesQueryOptions } from '~/queries/expenses'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { ExpenseDialogs } from './components/expense-dialogs'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'

// import { expensesQueryOptions } from '@/api/expenses'

export default function Expenses() {
  const { data: expenses } = useSuspenseQuery(expensesQueryOptions())
  console.log('🚀 ~ Monthly ~ expensesQuery:', expenses)
  // const expensesQuery = useQuery(expensesQueryOptions())

  // const expenses = expensesQuery.data || []
  // console.log('🚀 ~ Monthly ~ expensesQuery:', expenses)

  return (
    <>
      <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
        <TasksPrimaryButtons />
        <DataTable data={expenses} columns={columns} />
      </div>

      <ExpenseDialogs />
    </>
  )
}
