import {
  Link,
  rootRouteId,
  useMatch,
  useRouter,
} from '@tanstack/react-router'
import type { ErrorComponentProps } from '@tanstack/react-router'
import { Button } from '~/components/ui/button'
import { cn } from '~/utils/cn'

export function DefaultCatchBoundary({ error }: ErrorComponentProps) {
  const router = useRouter()
  const isRoot = useMatch({
    strict: false,
    select: (state) => state.id === rootRouteId,
  })

  const isDev = import.meta.env.DEV

  return (
    <>
      <div className={cn('h-svh w-full')}>
        <div className='m-auto flex h-full w-full flex-col items-center justify-center gap-2'>
          <h1 className='text-[7rem] leading-tight font-bold'>Error</h1>
          <span className='font-medium'>
            Oops! Something went wrong {`:')`}
          </span>
          <p className='text-muted-foreground text-center'>
            We apologize for the inconvenience. <br /> Please try again later.
          </p>

          {/* Error message */}
          <div className='w-full px-4 flex flex-col items-center justify-center'>
            <pre
              className='mt-4 rounded-lg bg-destructive/10 p-4 text-destructive max-w-2xl'
              role='alert'
            >
              <code className='wrap-break-word'>{error.message}</code>
            </pre>

            {/* Stack trace - only in development */}
            {isDev && (
              <pre
                className='m-2 max-w-7xl max-h-[400px] overflow-auto rounded-lg bg-muted p-4 text-muted-foreground font-mono text-sm w-full'
                role='log'
              >
                <code>{error.stack}</code>
              </pre>
            )}
          </div>

          <div className='mt-6 flex gap-4'>
            <Button
              variant='outline'
              onClick={() => {
                router.invalidate()
              }}
            >
              Try Again
            </Button>
            {isRoot ? (
              <Link
                to='/'
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3`}
              >
                Home
              </Link>
            ) : (
              <Link
                to='/'
                className={`inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50 h-9 px-4 py-2 has-[>svg]:px-3`}
                onClick={(e) => {
                  e.preventDefault()
                  window.history.back()
                }}
              >
                Go Back
              </Link>
            )}
          </div>
        </div>
      </div>
    </>
  )
}
