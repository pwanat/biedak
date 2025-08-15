import { format } from 'date-fns'
import { ColumnDef } from '@tanstack/react-table'
import { Income } from '~/models/income'
import { formatCurrency } from '~/utils/currency'
import { Checkbox } from '@/components/ui/checkbox'
import { statuses } from '../../data/data'
import { DataTableColumnHeader } from './data-table-column-header'
import { DataTableRowActions } from './data-table-row-actions'

export const columns: ColumnDef<Income>[] = [
  {
    accessorKey: 'occurredOn',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Date' className='pl-4' />
    ),
    cell: ({ row }) => (
      <div className='w-[60px] pl-4'>
        {format(new Date(row.getValue('occurredOn')), 'dd MMM')}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'name',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Name' />
    ),
    cell: ({ row }) => <div className='w-[80px]'>{row.getValue('name')}</div>,
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'amount',

    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Amount' />
    ),
    cell: ({ row }) => (
      <div className='w-[100px] text-right tabular-nums'>
        {formatCurrency(row.getValue('amount'), row.original.currency)}
      </div>
    ),
    enableSorting: true,
    enableHiding: false,
  },
  {
    accessorKey: 'status',
    header: ({ column }) => (
      <DataTableColumnHeader column={column} title='Status' />
    ),
    cell: ({ row }) => {
      const status = statuses.find(
        (status) => status.value === row.getValue('status')
      )

      if (!status) {
        return null
      }

      return (
        <div className='flex w-[100px] items-center'>
          {status.icon && (
            <status.icon className='text-muted-foreground mr-2 h-4 w-4' />
          )}
          <span>{status.label}</span>
        </div>
      )
    },
    filterFn: (row, id, value) => {
      return value.includes(row.getValue(id))
    },
  },

  {
    id: 'actions',
    cell: ({ row }) => <DataTableRowActions row={row} />,
  },
]
