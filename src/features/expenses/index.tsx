import { useQuery, useSuspenseQuery } from '@tanstack/react-query'
import { expensesQueryOptions } from '~/queries/expenses'
import { Main } from '@/components/layout/main'
import { columns } from './components/columns'
import { DataTable } from './components/data-table'
import { ExpenseDialogs } from './components/expense-dialogs'
import { IncomeCard } from './components/income-card'
import { TasksPrimaryButtons } from './components/tasks-primary-buttons'
import { tasks } from './data/tasks'

// import { expensesQueryOptions } from '@/api/expenses'

export default function Expenses() {
  const { data: expenses } = useSuspenseQuery(expensesQueryOptions())
  console.log('🚀 ~ Expenses ~ expensesQuery:', expenses)
  // const expensesQuery = useQuery(expensesQueryOptions())

  // const expenses = expensesQuery.data || []
  // console.log('🚀 ~ Expenses ~ expensesQuery:', expenses)

  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>Expenses</h2>
            <p className='text-muted-foreground'>
              Here&apos;s a list of your expenses for this month!
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        {/* <div className='-mx-4 flex-1 overflow-auto px-4 py-1 lg:flex-row lg:space-y-0 lg:space-x-12'>
          <DataTable data={expenses} columns={columns} />
        </div> */}
        <div className='flex flex-col-reverse gap-6 lg:flex-row'>
          <div className='-mx-4 flex-1 overflow-auto px-4 py-1'>
            <DataTable data={expenses} columns={columns} />
          </div>
          <div className='w-160'>
            <IncomeCard />
          </div>
        </div>
      </Main>

      <ExpenseDialogs />
    </>
  )
}
