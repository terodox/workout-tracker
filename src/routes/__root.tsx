import {
  HeadContent,
  Outlet,
  Scripts,
  createRootRouteWithContext,
} from '@tanstack/react-router'
import { useEffect } from 'react'

import { AuthProvider } from '../contexts/AuthContext'
import appCss from '../styles.css?url'
import webawesomeCss from '@awesome.me/webawesome/dist/styles/webawesome.css?url'

import type { QueryClient } from '@tanstack/react-query'

interface MyRouterContext {
  queryClient: QueryClient
}

export const Route = createRootRouteWithContext<MyRouterContext>()({
  head: () => ({
    meta: [
      { charSet: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { title: 'Workout Tracker' },
    ],
    links: [
      { rel: 'stylesheet', href: webawesomeCss },
      { rel: 'stylesheet', href: appCss },
    ],
  }),
  component: RootComponent,
})

function RootComponent() {
  // Load Web Awesome components client-side only
  useEffect(() => {
    import('@awesome.me/webawesome/dist/components/button/button.js')
    import('@awesome.me/webawesome/dist/components/input/input.js')
    import('@awesome.me/webawesome/dist/components/card/card.js')
    import('@awesome.me/webawesome/dist/components/icon/icon.js')
    import('@awesome.me/webawesome/dist/components/dialog/dialog.js')
    import('@awesome.me/webawesome/dist/components/callout/callout.js')
    import('@awesome.me/webawesome/dist/components/spinner/spinner.js')
    import('@awesome.me/webawesome/dist/components/skeleton/skeleton.js')
  }, [])

  return (
    <html lang="en">
      <head>
        <HeadContent />
      </head>
      <body>
        <AuthProvider>
          <Outlet />
        </AuthProvider>
        <Scripts />
      </body>
    </html>
  )
}
