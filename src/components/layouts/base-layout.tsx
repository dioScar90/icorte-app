import { AppSidebar } from "@/components/app-sidebar"
import { NavbarHeader } from "@/components/navbar-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
// import { useAuth } from "@/providers/authProvider"
// import { ROUTE_ENUM } from "@/types/route"
import { Outlet, useLocation, useNavigate } from "react-router-dom"
import { Footer } from "../footer"
import { useCallback, useEffect } from "react"
import Swal from "sweetalert2"
import { AuthProvider } from "@/providers/authProvider"

export function BaseLayout() {
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  console.log('just to check', { pathname, state })
  // const { isAuthenticated } = useAuth()
  
  // const isLoginPageOrRegisterPage = pathname.startsWith(ROUTE_ENUM.LOGIN) || pathname.startsWith(ROUTE_ENUM.REGISTER)

  // if (isAuthenticated && isLoginPageOrRegisterPage) {
  //   return <Navigate to={ROUTE_ENUM.HOME} replace />
  // }

  // if (state?.message) {
  //   Swal.fire({
  //     icon: "success",
  //     title: state?.message,
  //   });
  //   navigate(pathname, { replace: true });
  //   return null
  // }

  const checkMessageInState = useCallback(() => {
    if (state?.message) {
      Swal.fire({
        icon: "success",
        title: state?.message,
      });
      navigate(pathname, { replace: true });
    }
  }, [])

  useEffect(() => {
    checkMessageInState()
  }, [pathname])

  return (
    <AuthProvider>
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
    </AuthProvider>
  )
}
