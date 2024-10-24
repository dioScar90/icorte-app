import { AppSidebar } from "@/components/app-sidebar"
import { NavbarHeader } from "@/components/navbar-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"
import { Navigate, Outlet, useLocation } from "react-router-dom"
import { Footer } from "../footer"

export function BaseLayout() {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  if (pathname === ROUTE_ENUM.ROOT) {
    return <Navigate to={ROUTE_ENUM.HOME} replace />
  }

  if (!isAuthenticated && !pathname.startsWith(ROUTE_ENUM.LOGIN)) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  return (
    <SidebarProvider>
      <AppSidebar />

      <SidebarInset> {/* Here is the <main> tag */}
        <NavbarHeader />

        <section role="main" className="main-container">
          <div>
            <Outlet />
            <div className="min-h-[100vh] flex-1 rounded-xl bg-muted/50 md:min-h-min" />
          </div>
        </section>

        <Footer />
      </SidebarInset>

      <Toaster />
    </SidebarProvider>
  )
}
