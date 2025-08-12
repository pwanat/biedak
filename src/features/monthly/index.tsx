import { Main } from '@/components/layout/main'
import { ExpenseDialogs } from './expenses/components/expense-dialogs'
import { IncomeCard } from './expenses/components/income-card'
import { TasksPrimaryButtons } from './expenses/components/tasks-primary-buttons'
import Expenses from './expenses/expenses'

export default function Monthly() {
  return (
    <>
      <Main>
        <div className='mb-2 flex flex-wrap items-center justify-between space-y-2 gap-x-4'>
          <div>
            <h2 className='text-2xl font-bold tracking-tight'>
              Monthly Overview
            </h2>
            <p className='text-muted-foreground'>
              Here&apos;s your monthly overview.
            </p>
          </div>
          <TasksPrimaryButtons />
        </div>
        <div className='flex flex-col-reverse gap-6 lg:flex-row'>
          <Expenses />
          <div className='w-160'>
            <IncomeCard />
          </div>
        </div>
      </Main>

      <ExpenseDialogs />
    </>
  )
}
