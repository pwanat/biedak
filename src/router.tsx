import { AxiosError } from 'axios'
import {
  QueryCache,
  QueryClient,
  QueryClientProvider,
} from '@tanstack/react-query'
import { createRouter as createTanStackRouter } from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/clerk-react'
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

const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY

if (!PUBLISHABLE_KEY) {
  throw new Error('Missing Clerk Publishable Key in environment variables')
}

export const queryClient = new QueryClient({
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

export const trpc = createTRPCOptionsProxy<AppRouter>({
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
      <ClerkProvider
        publishableKey={PUBLISHABLE_KEY}
        afterSignOutUrl='/clerk/sign-in'
        signInUrl='/clerk/sign-in'
        signUpUrl='/clerk/sign-up'
        signInFallbackRedirectUrl='/clerk/user-management'
        signUpFallbackRedirectUrl='/clerk/user-management'
      >
        <QueryClientProvider client={queryClient}>
          <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
            <FontProvider>{children}</FontProvider>
          </ThemeProvider>
        </QueryClientProvider>
      </ClerkProvider>
    )
  },
})

export function createRouter() {
  return router
}

// Register the router instance for type safety
declare module '@tanstack/react-router' {
  interface Register {
    router: ReturnType<typeof createRouter>
  }
}
