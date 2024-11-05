import { AppSidebar } from "@/components/app-sidebar"
import { NavbarHeader } from "@/components/navbar-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"
import { Navigate, Outlet, useLocation, useNavigate } from "react-router-dom"
import { Footer } from "../footer"
import { useEffect } from "react"
import Swal from "sweetalert2"

export function BaseLayout() {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  console.log('just to check', { pathname, state })
  const { isAuthenticated, getMe } = useAuth()

  // if (pathname === ROUTE_ENUM.ROOT) {
  //   return <Navigate to={ROUTE_ENUM.HOME} replace />
  // }

  const isLoginPageOrRegisterPage = pathname.startsWith(ROUTE_ENUM.LOGIN) || pathname.startsWith(ROUTE_ENUM.REGISTER)

  if (isAuthenticated && isLoginPageOrRegisterPage) {
    return <Navigate to={ROUTE_ENUM.HOME} replace />
  }

  function checkMessageInState() {
    if (state?.message) {
      Swal.fire({
        icon: "success",
        title: state?.message,
      });
      navigate(pathname, { replace: true });
    }
  }

  useEffect(() => {
    checkMessageInState()
    if (pathname !== ROUTE_ENUM.LOGOUT) {
      getMe()
    }
  }, [pathname])

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
