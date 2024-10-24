import { Navigate, Outlet } from "react-router-dom"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"

export function ProtectedAdminRoute() {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to={ROUTE_ENUM.BARBER_SHOP} />
  }

  return <Outlet />
}
