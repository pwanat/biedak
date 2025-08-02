import { QueryClient } from '@tanstack/react-query'
import { createRootRouteWithContext, Outlet } from '@tanstack/react-router'
import { AppRouter } from '@/server/trpc'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

export interface RouterAppContext {
  trpc: TRPCOptionsProxy<AppRouter>
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
  component: RootComponent,
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})

function RootComponent() {
  return (
    <>
      <NavigationProgress />
      <Outlet />
      <Toaster duration={50000} />
      <TanStackRouterDevtools position='bottom-left' />
      <ReactQueryDevtools position='bottom' buttonPosition='bottom-right' />
    </>
  )
}
