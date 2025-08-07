// import Cookies from 'js-cookie'
import { Outlet } from '@tanstack/react-router'
import {
  RedirectToSignIn,
  SignedIn,
  SignedOut,
} from '@clerk/tanstack-react-start'
import { SearchProvider } from '~/context/search-context'
import { cn } from '~/utils/cn'
import { SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from './app-sidebar/app-sidebar'
// import { SearchProvider } from '@/context/search-context'
// import SkipToMain from '@/components/skip-to-main'
import TopBar from './top-bar'

interface Props {
  children?: React.ReactNode
}

export function AuthenticatedLayout({ children }: Props) {
  // const defaultOpen = Cookies.get('sidebar_state') !== 'false'
  return (
    <>
      <SignedIn>
        <SearchProvider>
          <SidebarProvider defaultOpen>
            {/* <SidebarProvider defaultOpen={defaultOpen}> */}
            {/* <SkipToMain /> */}
            <AppSidebar />
            <div
              id='content'
              className={cn(
                'ml-auto w-full max-w-full',
                'peer-data-[state=collapsed]:w-[calc(100%-var(--sidebar-width-icon)-1rem)]',
                'peer-data-[state=expanded]:w-[calc(100%-var(--sidebar-width))]',
                'sm:transition-[width] sm:duration-200 sm:ease-linear',
                'flex h-svh flex-col',
                'group-data-[scroll-locked=1]/body:h-full',
                'has-[main.fixed-main]:group-data-[scroll-locked=1]/body:h-svh'
              )}
            >
              <TopBar />
              {children ? children : <Outlet />}
            </div>
          </SidebarProvider>
        </SearchProvider>
      </SignedIn>
      <SignedOut>
        <RedirectToSignIn />
      </SignedOut>
    </>
  )
}
