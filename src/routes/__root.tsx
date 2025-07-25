import { QueryClient } from '@tanstack/react-query'
import {
  createRootRouteWithContext,
  Link,
  Outlet,
  useRouterState,
} from '@tanstack/react-router'
import { AppRouter } from '@/server/trpc'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { TRPCOptionsProxy } from '@trpc/tanstack-react-query'
import { Toaster } from '@/components/ui/sonner'
import { NavigationProgress } from '@/components/navigation-progress'
import GeneralError from '@/features/errors/general-error'
import NotFoundError from '@/features/errors/not-found-error'

// export interface RouterAppContext {
//   trpc: TRPCOptionsProxy<AppRouter>
//   queryClient: QueryClient
// }

// export const Route = createRootRouteWithContext<RouterAppContext>()({
//   component: RootComponent,
// })

// function RootComponent() {
//   const isFetching = useRouterState({ select: (s) => s.isLoading })

//   return (
//     <>
//       <div className={`flex min-h-screen flex-col`}>
//         <div className={`flex items-center gap-2 border-b`}>
//           <h1 className={`p-2 text-3xl`}>With tRPC + TanStack Query</h1>
//           {/* Show a global spinner when the router is transitioning */}
//           <div
//             className={`text-3xl opacity-0 delay-0 duration-300 ${
//               isFetching ? `opacity-40 duration-1000` : ''
//             }`}
//           >
//             {/* <Spinner /> */}
//             Loading...
//           </div>
//         </div>
//         <div className={`flex flex-1`}>
//           <div className={`w-56 divide-y`}>
//             {/* {(
//               [
//                 ['/', 'Home'],
//                 ['/dashboard', 'Dashboard'],
//               ] as const
//             ).map(([to, label]) => {
//               return (
//                 <div key={to}>
//                   <Link
//                     to={to}
//                     activeOptions={
//                       {
//                         // If the route points to the root of it's parent,
//                         // make sure it's only active if it's exact
//                         // exact: to === '.',
//                       }
//                     }
//                     preload='intent'
//                     className={`block px-3 py-2 text-blue-700`}
//                     // Make "active" links bold
//                     activeProps={{ className: `font-bold` }}
//                   >
//                     {label}
//                   </Link>
//                 </div>
//               )
//             })} */}
//           </div>
//           <div className={`flex-1 border-l border-gray-200`}>
//             {/* Render our first route match */}
//             <Outlet />
//           </div>
//         </div>
//       </div>
//       <TanStackRouterDevtools position='bottom-left' />
//       <ReactQueryDevtools position='bottom' buttonPosition='bottom-right' />
//     </>
//   )
// }

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  component: () => {
    return (
      <>
        <NavigationProgress />
        <Outlet />
        <Toaster duration={50000} />
        {import.meta.env.MODE === 'development' && (
          <>
            <ReactQueryDevtools buttonPosition='bottom-left' />
            <TanStackRouterDevtools position='bottom-right' />
          </>
        )}
      </>
    )
  },
  notFoundComponent: NotFoundError,
  errorComponent: GeneralError,
})
