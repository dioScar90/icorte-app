import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { ClientProvider } from "@/providers/clientProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedClientRoute({ children }: PropsWithChildren) {
  const { isClient } = useAuth()

  if (!isClient) {
    return <Navigate to={ROUTE_ENUM.LOGIN} />
  }

  return (
    <ClientProvider>
      {children}
    </ClientProvider>
  )
}
