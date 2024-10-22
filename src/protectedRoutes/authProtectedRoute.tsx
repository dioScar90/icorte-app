import { PropsWithChildren } from "react"
import { Navigate, useLocation } from "react-router-dom"
import { useAuth } from "@/providers/authProvider"
import { ROUTE_ENUM } from "@/types/route"

export function ProtectedAuthenticatedRoute({ children }: PropsWithChildren) {
  const { isAuthenticated } = useAuth()
  const { pathname } = useLocation()

  const isLoginPage = pathname.startsWith(ROUTE_ENUM.LOGIN)
  const isRegisterPage = pathname.startsWith(ROUTE_ENUM.REGISTER)

  if (!isAuthenticated && !isLoginPage && !isRegisterPage) {
    return <Navigate to={ROUTE_ENUM.LOGIN} />
  }

  return children
}
