import { Cross2Icon } from '@radix-ui/react-icons'
import { Table } from '@tanstack/react-table'
import { IconDownload, IconPlus } from '@tabler/icons-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { priorities, statuses } from '../../data/data'
import { useMonthlyStore } from '../../monthly-store'
import { DataTableFacetedFilter } from './data-table-faceted-filter'
import { DataTableViewOptions } from './data-table-view-options'
import { TasksPrimaryButtons } from './tasks-primary-buttons'

interface DataTableToolbarProps<TData> {
  table: Table<TData>
}

export function DataTableToolbar<TData>({
  table,
}: DataTableToolbarProps<TData>) {
  const isFiltered = table.getState().columnFilters.length > 0
  const setDialogOpen = useMonthlyStore((state) => state.setDialogOpen)

  return (
    <div className='flex items-center justify-between'>
      <div className='flex flex-1 flex-col-reverse items-start gap-y-2 sm:flex-row sm:items-center sm:space-x-2'>
        <Input
          placeholder='Filter expenses...'
          value={(table.getColumn('name')?.getFilterValue() as string) ?? ''}
          onChange={(event) =>
            table.getColumn('name')?.setFilterValue(event.target.value)
          }
          className='h-8 w-[150px] lg:w-[250px]'
        />
        <div className='flex gap-x-2'>
          {table.getColumn('status') && (
            <DataTableFacetedFilter
              column={table.getColumn('status')}
              title='Status'
              options={statuses}
            />
          )}
        </div>
        {isFiltered && (
          <Button
            variant='ghost'
            onClick={() => table.resetColumnFilters()}
            className='h-8 px-2 lg:px-3'
          >
            Reset
            <Cross2Icon className='ml-2 h-4 w-4' />
          </Button>
        )}
      </div>
      <div className='flex items-center space-x-2'>
        <DataTableViewOptions table={table} />
        <Button
          variant='outline'
          className='ml-auto hidden lg:flex'
          onClick={() => setDialogOpen('import')}
          size='sm'
          disabled
        >
          <span>Import</span> <IconDownload size={18} />
        </Button>
        <Button
          size='sm'
          className='ml-auto hidden lg:flex'
          onClick={() => setDialogOpen('create')}
        >
          <span>Create</span> <IconPlus size={18} />
        </Button>
      </div>
    </div>
  )
}
