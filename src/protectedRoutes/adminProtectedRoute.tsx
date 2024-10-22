import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"

export function ProtectedAdminRoute({ children }: PropsWithChildren) {
  const { isAdmin } = useAuth()

  if (!isAdmin) {
    return <Navigate to={ROUTE_ENUM.BARBER_SHOP} />
  }

  return children
}
