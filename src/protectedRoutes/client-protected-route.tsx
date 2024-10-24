import { Navigate, Outlet } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { ClientProvider } from "@/providers/clientProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedClientRoute() {
  const { isClient } = useAuth()

  if (!isClient) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  return (
    <ClientProvider>
      <Outlet />
    </ClientProvider>
  )
}
