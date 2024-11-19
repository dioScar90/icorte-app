import { AppSidebar } from "@/components/sidebar/app-sidebar"
import { NavbarHeader } from "@/components/sidebar/navbar-header"
import {
  SidebarInset,
  SidebarProvider,
} from "@/components/ui/sidebar"
import { Toaster } from "@/components/ui/toaster"
import { Outlet, useLocation, useNavigate, useNavigation } from "react-router-dom"
import { Footer } from "../footer"
import { useLayoutEffect } from "react"
import Swal from "sweetalert2"
import { AuthProvider } from "@/providers/authProvider"

export function BaseLayout() {
  const navigation = useNavigation()
  const navigate = useNavigate()
  const { pathname, state } = useLocation()
  
  useLayoutEffect(() => {
    if (state?.message) {
      Swal.fire({
        icon: "success",
        title: state?.message,
      });
      navigate(pathname, { replace: true });
    }
  }, [state?.message])
  
  return (
    <AuthProvider>
      <SidebarProvider>
        <AppSidebar />

        <SidebarInset> {/* Here is the <main> tag */}
          <NavbarHeader />

          <section role="main" className={`main-container ${navigation.state !== 'idle' && 'loading-new-page'}`}>
            <div className="before-outlet">
              <Outlet />
            </div>
          </section>
          
          <Footer />
        </SidebarInset>

        <Toaster />
      </SidebarProvider>
    </AuthProvider>
  )
}
