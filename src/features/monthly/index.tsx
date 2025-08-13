import { Main } from '@/components/layout/main'
import { MonthlyDialogs } from './components/monthly-dialogs'
import Expenses from './expenses/expenses'
import { Income } from './income/income'

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
        </div>
        <div className='flex flex-col-reverse gap-6 lg:flex-row'>
          <Expenses />
          <Income />
        </div>
      </Main>

      <MonthlyDialogs />
    </>
  )
}
