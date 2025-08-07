/// <reference types="vite/client" />
import * as React from 'react'
import type { QueryClient } from '@tanstack/react-query'
import {
  HeadContent,
  Link,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { ClerkProvider } from '@clerk/tanstack-react-start'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'
import { FontProvider } from '~/context/font-context'
import { ThemeProvider } from '~/context/theme-context'
import appCss from '~/styles/app.css?url'
import { seo } from '~/utils/seo'

export const Route = createRootRouteWithContext<{
  queryClient: QueryClient
}>()({
  head: () => ({
    meta: [
      {
        charSet: 'utf-8',
      },
      {
        name: 'viewport',
        content: 'width=device-width, initial-scale=1',
      },
      ...seo({
        title: 'Biedak | Od zera do klasy średniej niższej',
        description: `Biedak to portal dla biedaków`,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: appCss },
      // TODO: zrobić favicony
      {
        rel: 'apple-touch-icon',
        sizes: '180x180',
        href: '/apple-touch-icon.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '32x32',
        href: '/favicon-32x32.png',
      },
      {
        rel: 'icon',
        type: 'image/png',
        sizes: '16x16',
        href: '/favicon-16x16.png',
      },
      { rel: 'manifest', href: '/site.webmanifest', color: '#fffff' },
      { rel: 'icon', href: '/favicon.ico' },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  return (
    <ClerkProvider>
      <ThemeProvider defaultTheme='light' storageKey='vite-ui-theme'>
        <FontProvider>
          <RootDocument>
            <Outlet />
          </RootDocument>
        </FontProvider>
      </ThemeProvider>
      <TanStackRouterDevtools position='bottom-right' />
      <ReactQueryDevtools buttonPosition='bottom-left' />
    </ClerkProvider>
  )
}

function RootDocument({ children }: { children: React.ReactNode }) {
  return (
    <html>
      <head>
        <HeadContent />
      </head>
      <body>
        {children}
        <Scripts />
      </body>
    </html>
  )
}
