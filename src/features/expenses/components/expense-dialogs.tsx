import { showSubmittedData } from '@/utils/show-submitted-data'
import { ConfirmDialog } from '@/components/confirm-dialog'
import { useExpensesStore } from '../expenses-store'
import { ExpenseMutateDrawer } from './expense-mutate-drawer'
import { TasksImportDialog } from './tasks-import-dialog'

export function ExpenseDialogs() {
  const dialogOpen = useExpensesStore((state) => state.dialogOpen)
  console.log("🚀 ~ ExpenseDialogs ~ dialogOpen:", dialogOpen)
  const currentExpense = useExpensesStore((state) => state.currentExpense)
  const setCurrentExpense = useExpensesStore((state) => state.setCurrentExpense)
  const setDialogOpen = useExpensesStore((state) => state.setDialogOpen)

  return (
    <>
      <ExpenseMutateDrawer
        key='task-create'
        open={dialogOpen === 'create'}
        onOpenChange={() => setDialogOpen('create')}
      />

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
            onOpenChange={() => {
              setDialogOpen('update')
              setTimeout(() => {
                setCurrentExpense(null)
              }, 500)
            }}
            currentRow={currentExpense}
          />

          <ConfirmDialog
            key='task-delete'
            destructive
            open={open === 'delete'}
            onOpenChange={() => {
              setOpen('delete')
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
            }}
            handleConfirm={() => {
              setOpen(null)
              setTimeout(() => {
                setCurrentRow(null)
              }, 500)
              showSubmittedData(
                currentRow,
                'The following task has been deleted:'
              )
            }}
            className='max-w-md'
            title={`Delete this task: ${currentRow.id} ?`}
            desc={
              <>
                You are about to delete a task with the ID{' '}
                <strong>{currentRow.id}</strong>. <br />
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
