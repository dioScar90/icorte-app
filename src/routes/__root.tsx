import { Outlet, createRootRouteWithContext, redirect, useLocation, useRouter, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/react-router-devtools'

import TanstackQueryLayout from '@/providers/tanstack-query/layout'

import indexCss from '@/styles.css?url'
import { seo } from '@/utils/seo'
import { useCallback, useEffect, useLayoutEffect, type PropsWithChildren } from 'react'
import { cn } from '@/lib/utils'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { NavbarHeader } from '@/components/sidebar/navbar-header'
import { Footer } from '@/components/footer'
import { Toaster } from 'sonner'
import Swal from 'sweetalert2'

import type { QueryClient } from '@tanstack/react-query'
import type { ProxyContext } from '@/hooks/use-proxy'
import { useErrorHandler, type HandleError } from '@/providers/errors/error-handler-provider'
import type { AuthContext } from '@/hooks/use-auth'

interface RouterAppContext {
  queryClient: QueryClient
  httpClient: ProxyContext
  handleError: HandleError
  auth: AuthContext
}

export const Route = createRootRouteWithContext<RouterAppContext>()({
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
        title: 'iCorte™',
        description: `TanStack Start is a type-safe, client-first, full-stack React framework. `,
      }),
    ],
    links: [
      { rel: 'stylesheet', href: indexCss },
      {
        rel: 'icon',
        type: 'image/svg+xml',
        href: '/barber.png',
      },
      {
        rel: 'icon',
        type: 'image/x-icon',
        href: '/favicon.ico',
      },
    ],
  }),
  beforeLoad: async ({ context, location }) => {
    function goHome() {
      throw redirect({
        to: '/',
        replace: true,
      })
    }
    
    const unauthenticatedOnly = location.pathname === '/login' || location.pathname === '/register'
    
    if (context.auth.isAuthenticated && unauthenticatedOnly) {
      goHome()
    }
    
    return {
      goHome,
    }
  },
  component: RootComponent,
})

function MainBody() {
  const isLoading = useRouterState({ select: ({ isLoading }) => isLoading })

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset> {/* Here is the <main> tag */}
        <NavbarHeader />

        <section
          role="main"
          className={cn(
            'main-container',
            isLoading && 'loading-new-page'
          )}
        >
          <div className="before-outlet">
            <Outlet />
          </div>
        </section>
        
        <Footer />
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}

function HistoryAlertChecker({ children }: PropsWithChildren) {
  const { navigate } = useRouter()
  const { state } = useLocation()
  
  const checkForMessage = useCallback((alert: typeof state['alert']) => {
    if (alert?.message) {
      const messageKey = alert?.isHtml === true ? 'html' : 'text'
      
      Swal.fire({
        icon: alert?.icon ?? 'success',
        title: alert?.title ?? undefined,
        [messageKey]: alert.message,
      })
      
      navigate({
        // to: pathname,
        replace: true,
      })
    }
  }, [])
  
  useLayoutEffect(() => {
    checkForMessage(state?.alert)
  }, [state?.alert?.message])

  return (
    <>
      {children}
    </>
  )
}

function ErrorMessageChecker({ children }: PropsWithChildren) {
  const { alert, clearErrors } = useErrorHandler()
  
  const { navigate } = useRouter()
  
  useEffect(() => {
    if (!alert || !alert?.message) {
      return
    }
    
    navigate({
      // to: location,
      // search: (prev) => prev,
      // params: (prev) => prev,
      state: (prev) => ({
        ...prev,
        alert,
      }),
    })

    clearErrors()
  }, [alert])
  
  return (
    <>
      {children}
    </>
  )
}

function RootComponent() {
  return (
    <HistoryAlertChecker>

      <ErrorMessageChecker>

        <MainBody />

        <TanStackRouterDevtools />

        <TanstackQueryLayout />
        
      </ErrorMessageChecker>

    </HistoryAlertChecker>
  )
}
