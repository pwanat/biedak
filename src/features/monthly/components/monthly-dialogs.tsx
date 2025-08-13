import { useMutation } from '@tanstack/react-query'
import { deleteExpenseMutationOptions } from '~/queries/expenses'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useMonthlyStore } from '../monthly-store'
import { ExpenseMutateDrawer } from '../expenses/components/expense-mutate-drawer'
import { TasksImportDialog } from '../expenses/components/tasks-import-dialog'

export function MonthlyDialogs() {
  const dialogOpen = useMonthlyStore((state) => state.dialogOpen)
  const currentExpense = useMonthlyStore((state) => state.currentExpense)
  const setCurrentExpense = useMonthlyStore((state) => state.setCurrentExpense)
  const setDialogOpen = useMonthlyStore((state) => state.setDialogOpen)

  const { mutate: deleteExpense } = useMutation(deleteExpenseMutationOptions())

  return (
    <>
      <ExpenseMutateDrawer key='task-create' open={dialogOpen === 'create'} />

      <TasksImportDialog
        key='tasks-import'
        open={dialogOpen === 'import'}
        onOpenChange={() => setDialogOpen('import')}
      />

      {currentExpense && (
        <>
          <ExpenseMutateDrawer
            key={`task-update-${currentExpense.id}`}
            open={dialogOpen === 'update'}
            currentRow={currentExpense}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={dialogOpen === 'delete'}
            onOpenChange={() => {
              setDialogOpen(null)
            }}
            handleConfirm={() => {
              setDialogOpen(null)
              deleteExpense(currentExpense.id)
              setTimeout(() => {
                setCurrentExpense(null)
              }, 500)
              showSubmittedData(
                currentExpense,
                'The following expense has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this expense: ${currentExpense.id} ?`}
            desc={
              <>
                You are about to delete an expense with the ID{' '}
                <strong>{currentExpense.id}</strong>. <br />
                This action cannot be undone.
              </>
            }
            confirmText='Delete'
          />
        </>
      )}
    </>
  )
}
