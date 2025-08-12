import { useMutation } from '@tanstack/react-query'
import { deleteExpenseMutationOptions } from '~/queries/expenses'
import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useExpensesStore } from '../../expenses-store'
import { ExpenseMutateDrawer } from './expense-mutate-drawer'
import { TasksImportDialog } from './tasks-import-dialog'

export function ExpenseDialogs() {
  const dialogOpen = useExpensesStore((state) => state.dialogOpen)
  const currentExpense = useExpensesStore((state) => state.currentExpense)
  const setCurrentExpense = useExpensesStore((state) => state.setCurrentExpense)
  const setDialogOpen = useExpensesStore((state) => state.setDialogOpen)

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
