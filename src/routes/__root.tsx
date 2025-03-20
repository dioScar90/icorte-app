import { createRootRouteWithContext, Outlet, redirect, useLocation, useNavigate, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import indexCss from '@/index.css?url'
import { seo } from '@/utils/seo'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { NavbarHeader } from '@/components/sidebar/navbar-header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { ComponentProps, PropsWithChildren, useLayoutEffect } from 'react'
import Swal from 'sweetalert2'
import type { HandleError } from '@/hooks/use-error'
import type { QueryClient } from '@tanstack/react-query'
import { ProxyContext } from '@/hooks/use-proxy'
import { ThemeProvider } from '@/components/theme-provider'
import { cn } from '@/lib/utils'
import { AuthContext } from '@/hooks/use-auth'

export type RouterAppContext = {
  httpClient: ProxyContext,
  handleError: HandleError,
  queryClient: QueryClient,
  auth: AuthContext,
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

function MainProviders({ children }: PropsWithChildren) {
  const theme = {
    defaultTheme: 'dark',
    storageKey: 'vite-ui-theme',
  } satisfies Omit<ComponentProps<typeof ThemeProvider>, 'children'>

  return (
    <ThemeProvider { ...theme }>
      {children}
    </ThemeProvider>
  )
}

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

function RootComponent() {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  
  useLayoutEffect(() => {
    if (state?.message) {
      Swal.fire({
        icon: "success",
        title: state?.message,
      })
      
      navigate({
        to: pathname,
        replace: true,
      })
    }
  }, [state?.message])
  
  return (
    <MainProviders>

      <MainBody />

      <TanStackRouterDevtools />

    </MainProviders>
  )
}
