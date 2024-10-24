import { Navigate, Outlet } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { BarberShopProvider } from "@/providers/barberShopProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedBarberShopRoute() {
  const { isBarberShop } = useAuth()

  if (!isBarberShop) {
    return <Navigate to={ROUTE_ENUM.CLIENT} replace />
  }

  return (
    <BarberShopProvider>
      <Outlet />
    </BarberShopProvider>
  )
}
