import { createRootRouteWithContext, Outlet, useLocation, useNavigate, useRouterState } from '@tanstack/react-router'
import { TanStackRouterDevtools } from '@tanstack/router-devtools'
import indexCss from '@/index.css?url'
import { seo } from '@/utils/seo'
import { AuthProvider } from '@/providers/authProvider'
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar'
import { AppSidebar } from '@/components/sidebar/app-sidebar'
import { NavbarHeader } from '@/components/sidebar/navbar-header'
import { Footer } from '@/components/footer'
import { Toaster } from '@/components/ui/toaster'
import { useLayoutEffect } from 'react'
import Swal from 'sweetalert2'
import type { HandleError } from '@/providers/handleErrorProvider'
import type { QueryClient } from '@tanstack/react-query'

export type RouterAppContext = {
  handleError: HandleError,
  queryClient: QueryClient,
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
  component: RootComponent,
})

function RootComponent() {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  
  const isFetching = useRouterState({ select: (s) => s.isLoading })
  
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
    <>
      <AuthProvider>
        <SidebarProvider>
          <AppSidebar />

          <SidebarInset> {/* Here is the <main> tag */}
            <NavbarHeader />

            <section role="main" className={`main-container ${isFetching && 'loading-new-page'}`}>
              <div className="before-outlet">
                <Outlet />
              </div>
            </section>
            
            <Footer />
          </SidebarInset>

          <Toaster />
        </SidebarProvider>
      </AuthProvider>
      
      <TanStackRouterDevtools />
    </>
  )
}
