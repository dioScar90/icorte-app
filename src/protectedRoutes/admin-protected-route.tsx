import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"
import { AdminProvider } from "@/providers/adminProvider"

export function ProtectedAdminRoute() {
  const { isAdmin } = useAuth()
  
  if (!isAdmin) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  return (
    <AdminProvider>
      <Outlet />
    </AdminProvider>
  )
}
