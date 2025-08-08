import { AxiosError } from 'axios'
import { toast } from 'sonner'

export function handleServerError(error: AxiosError) {
  // eslint-disable-next-line no-console
  console.log('in handleServerError', error)

  if (
    error &&
    typeof error === 'object' &&
    'status' in error &&
    Number(error.status) === 204
  ) {
    toast.error('Content not found.')
    return
  }

  toast.error(
    error?.message || 'An error occurred while processing your request.'
  )
}
