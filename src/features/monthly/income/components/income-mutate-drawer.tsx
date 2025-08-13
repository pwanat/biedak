import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '~/components/date-picker'
import { NumericInput } from '~/components/numeric-input'
import { Textarea } from '~/components/ui/textarea'
import { Income } from '~/models/income'
import {
  postIncomeMutationOptions,
  putIncomeMutationOptions,
} from '~/queries/income'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { Button } from '@/components/ui/button'
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'
import { useMonthlyStore } from '../../monthly-store'

interface Props {
  open: boolean
  currentRow?: Income
}

const formSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required.')
    .max(256, 'Name cant be longer than 256 characters.'),
  description: z
    .string()
    .max(1024, 'Description cant be longer than 1024 characters.'),
  amount: z.number().min(0.00000001, 'Amount must be greater than 0.'),
  occurredOn: z.date('Please select a valid date.'),
})

export type IncomeForm = z.infer<typeof formSchema>

export function IncomeMutateDrawer({ open, currentRow }: Props) {
  const setDialogOpen = useMonthlyStore((state) => state.setDialogOpen)
  const isUpdate = !!currentRow

  const { mutate: postIncome } = useMutation(postIncomeMutationOptions())
  const { mutate: putIncome } = useMutation(putIncomeMutationOptions())

  const form = useForm<IncomeForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name || '',
      description: currentRow?.description || '',
      amount: currentRow?.amount || 0,
      occurredOn: currentRow?.occurredOn || new Date(),
    },
  })

  const onSubmit = (data: IncomeForm) => {
    if (isUpdate) {
      putIncome({ ...data, id: currentRow?.id })
    } else {
      postIncome(data)
    }
    setDialogOpen(null)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={() => {
        setDialogOpen(null)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Income</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the income by providing necessary info. '
              : 'Add a new income by providing necessary info. '}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='income-form'
            onSubmit={form.handleSubmit(onSubmit)}
            className='flex-1 space-y-5 px-4'
          >
            <FormField
              control={form.control}
              name='name'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder='Enter an income name' />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='amount'
              render={({ field }) => (
                <FormItem className='space-y-1'>
                  <FormLabel>Amount</FormLabel>
                  <FormControl>
                    <NumericInput
                      placeholder='Enter an income amount'
                      value={field.value}
                      onValueChange={(values) => {
                        field.onChange(values.floatValue)
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='occurredOn'
              render={({ field }) => (
                <FormItem className='flex flex-col'>
                  <FormLabel>Date of occurrence</FormLabel>
                  <DatePicker
                    selected={field.value}
                    onSelect={field.onChange}
                  />
                  <FormDescription>
                    The date when this income was received.
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name='description'
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder='Optional income description'
                      maxLength={1024}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </form>
        </Form>

        <SheetFooter className='gap-2'>
          <SheetClose asChild>
            <Button variant='outline'>Close</Button>
          </SheetClose>
          <Button form='income-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
