import { QueryClient } from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { routerWithQueryClient } from '@tanstack/react-router-with-query'
import { routeTree } from './routeTree.gen'

import NotFoundError from './features/errors/not-found-error'
import GeneralError from './features/errors/general-error'

// NOTE: Most of the integration code found here is experimental and will
// definitely end up in a more streamlined API in the future. This is just
// to show what's possible with the current APIs.

export function createRouter() {
  const queryClient = new QueryClient()

  return routerWithQueryClient(
    createTanStackRouter({
      routeTree,
      context: { queryClient },
      defaultPreload: 'intent',
      defaultErrorComponent: GeneralError,
      defaultNotFoundComponent: NotFoundError,
    }),
    queryClient,
  )
}

declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
