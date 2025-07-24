import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { createTRPCClient, httpBatchLink } from '@trpc/client'
import { createTRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { toast } from 'sonner'
import { FontProvider } from './context/font-context'
import { ThemeProvider } from './context/theme-context'
// Import the generated route tree
import { routeTree } from './routeTree.gen'
import { AppRouter } from './server/trpc'
import { useAuthStore } from './stores/authStore'
import { handleServerError } from './utils/handle-server-error'

export function createRouter() {
  const queryClient = new QueryClient({
    defaultOptions: {
      queries: {
        retry: (failureCount, error) => {
          // eslint-disable-next-line no-console
          if (import.meta.env.DEV) console.log({ failureCount, error })

          if (failureCount >= 0 && import.meta.env.DEV) return false
          if (failureCount > 3 && import.meta.env.PROD) return false

          return !(
            error instanceof AxiosError &&
            [401, 403].includes(error.response?.status ?? 0)
          )
        },
        refetchOnWindowFocus: import.meta.env.PROD,
        staleTime: 10 * 1000, // 10s
      },
      mutations: {
        onError: (error) => {
          handleServerError(error)

          if (error instanceof AxiosError) {
            if (error.response?.status === 304) {
              toast.error('Content not modified!')
            }
          }
        },
      },
    },
    queryCache: new QueryCache({
      onError: (error) => {
        if (error instanceof AxiosError) {
          if (error.response?.status === 401) {
            toast.error('Session expired!')
            useAuthStore.getState().auth.reset()
            const redirect = `${router.history.location.href}`
            router.navigate({ to: '/sign-in', search: { redirect } })
          }
          if (error.response?.status === 500) {
            toast.error('Internal Server Error!')
            router.navigate({ to: '/500' })
          }
          if (error.response?.status === 403) {
            // router.navigate("/forbidden", { replace: true });
          }
        }
      },
    }),
  })

  const trpc = createTRPCOptionsProxy<AppRouter>({
    client: createTRPCClient({
      links: [
        httpBatchLink({
          // since we are using Vite, the server is running on the same port,
          // this means in dev the url is `http://localhost:3000/trpc`
          // and since its from the same origin, we don't need to explicitly set the full URL
          url: '/trpc',
        }),
      ],
    }),
    queryClient,
  })

  const router = createTanStackRouter({
    routeTree,
    scrollRestoration: true,
    defaultPreload: 'intent',
    context: {
      trpc,
      queryClient,
    },
    defaultPendingComponent: () => (
      <div className={`p-2 text-2xl`}>
        {/* <Spinner /> */}
        Loading
      </div>
    ),
    Wrap: function WrapComponent({ children }) {
      return (
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
            <FontProvider>{children}</FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      )
    },
  })

  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
