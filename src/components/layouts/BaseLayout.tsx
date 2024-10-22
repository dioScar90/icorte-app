import { Navigate, Outlet, useLocation } from "react-router-dom";
import { Footer } from "../Footer";
import { Toaster } from "../ui/toaster";
import { Navbar } from "../Navbar";
import { useAuth } from "@/providers/authProvider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { AppSidebar } from "../AppSidebar";
import { ROUTE_ENUM } from "@/types/route";

export function BaseLayout() {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated && !pathname.startsWith(ROUTE_ENUM.LOGIN)) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  // return (
  //   <>
  //     <Navbar />
      
  //     <main className="flex grainy-light flex-col min-h-[calc(100vh-3.5rem-1px)]">
  //       <div className="flex-1 flex flex-col h-full">
  //         <Outlet />
  //       </div>

  //       <Footer />
  //     </main>

  //     <Toaster />
  //   </>
  // )

  return (
    <SidebarProvider>
      <AppSidebar />

      <main>
        <SidebarTrigger />
        <Outlet />
      </main>
      
      <Toaster />
    </SidebarProvider>
  )
}
