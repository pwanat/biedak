import { PlusIcon } from '@radix-ui/react-icons'
import { useSuspenseQuery } from '@tanstack/react-query'
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '~/components/ui/accordion'
import { incomeQueryOptions } from '~/queries/income'
import { formatCurrency } from '~/utils/currency'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { useMonthlyStore } from '../monthly-store'
import IncomeDetails from './components/income-details'

export function Income() {
  const setDialogOpen = useMonthlyStore((state) => state.setDialogOpen)
  const { data, isLoading } = useSuspenseQuery(incomeQueryOptions())
  console.log('🚀 ~ Income ~ data:', data)
  const monthlyIncome =
    data?.reduce((acc, income) => acc + income.amount, 0) || 0

  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <Card className='w-160'>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-xl font-bold'>Monthly Income</CardTitle>
        <Button
          variant='ghost'
          size='icon'
          onClick={() => setDialogOpen('income-create')}
        >
          <PlusIcon className='h-4 w-4' />
        </Button>
      </CardHeader>
      <CardContent>
        <div className='text-2xl font-bold'>
          {formatCurrency(monthlyIncome, 'PLN')}
        </div>
        <p className='text-muted-foreground text-xs'>
          Available to spend this month
        </p>

        <Accordion type='single' collapsible>
          <AccordionItem value='item-1'>
            <AccordionTrigger>View income details?</AccordionTrigger>
            <AccordionContent>
              <IncomeDetails data={data} />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
