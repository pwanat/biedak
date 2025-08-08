import { z } from 'zod'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation } from '@tanstack/react-query'
import { DatePicker } from '~/components/date-picker'
import { NumericInput } from '~/components/numeric-input'
import { Textarea } from '~/components/ui/textarea'
import { postExpenseMutationOptions, postExpenseQueryOptions } from '~/queries/expenses'
import { ExpenseSelect } from '~/server/db/schema'
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
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group'
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet'

interface Props {
  open: boolean
  onOpenChange: (open: boolean) => void
  currentRow?: ExpenseSelect
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

export type ExpenseForm = z.infer<typeof formSchema>

export function TasksMutateDrawer({ open, onOpenChange, currentRow }: Props) {
  const isUpdate = !!currentRow

  const { mutate: postExpense } = useMutation(postExpenseMutationOptions())

  const form = useForm<ExpenseForm>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: currentRow?.name || '',
      description: currentRow?.description || '',
      amount: currentRow?.amount || 0,
      occurredOn: currentRow?.occurredOn || new Date(),
    },
  })

  const onSubmit = (data: ExpenseForm) => {
    postExpense(data)
    onOpenChange(false)
    form.reset()
    showSubmittedData(data)
  }

  return (
    <Sheet
      open={open}
      onOpenChange={(v) => {
        onOpenChange(v)
        form.reset()
      }}
    >
      <SheetContent className='flex flex-col'>
        <SheetHeader className='text-left'>
          <SheetTitle>{isUpdate ? 'Update' : 'Create'} Task</SheetTitle>
          <SheetDescription>
            {isUpdate
              ? 'Update the task by providing necessary info.'
              : 'Add a new task by providing necessary info.'}
            Click save when you&apos;re done.
          </SheetDescription>
        </SheetHeader>
        <Form {...form}>
          <form
            id='tasks-form'
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
                    <Input {...field} placeholder='Enter an expense name' />
                  </FormControl>
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
                      placeholder='Optional expenses description'
                      maxLength={1024}
                      className='resize-none'
                      {...field}
                    />
                  </FormControl>
                  {/* <FormDescription>
                    You can <span>@mention</span> other users and organizations
                    to link to them.
                  </FormDescription> */}
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
                      placeholder='Enter an expense amount'
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
                    Your date of birth is used to calculate your age.
                  </FormDescription>
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
          <Button form='tasks-form' type='submit'>
            Save changes
          </Button>
        </SheetFooter>
      </SheetContent>
    </Sheet>
  )
}
