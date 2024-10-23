import { Navigate, Outlet, useLocation } from "react-router-dom";
// import { Footer } from "../Footer";
import { Toaster } from "../ui/toaster";
import { useAuth } from "@/providers/authProvider";
import { SidebarProvider, SidebarTrigger } from "../ui/sidebar";
import { ROUTE_ENUM } from "@/types/route";
import { AppSidebar } from "../app-sidebar";
import Page from "@/app/dashboard/page";

export function BaseLayout() {
  const { pathname } = useLocation()
  const { isAuthenticated } = useAuth()

  if (!isAuthenticated && !pathname.startsWith(ROUTE_ENUM.LOGIN)) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  return <Page />
  
  // return (
  //   <SidebarProvider>
  //     <AppSidebar />

  //     <main>
  //       <SidebarTrigger />
  //       <Outlet />
  //     </main>
      
  //     <Toaster />
  //   </SidebarProvider>
  // )
}
