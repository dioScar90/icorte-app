import { PropsWithChildren } from "react"
import { Navigate } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { BarberShopProvider } from "@/providers/barberShopProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedBarberShopRoute({ children }: PropsWithChildren) {
  const { isBarberShop } = useAuth()

  if (!isBarberShop) {
    return <Navigate to={ROUTE_ENUM.CLIENT} />
  }

  return (
    <BarberShopProvider>
      {children}
    </BarberShopProvider>
  )
}
