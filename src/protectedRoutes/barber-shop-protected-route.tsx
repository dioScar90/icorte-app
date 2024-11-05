import { Navigate, Outlet, useLocation } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { BarberShopProvider } from "@/providers/barberShopProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedBarberShopRoute() {
  const { pathname } = useLocation()
  const { isBarberShop } = useAuth()
  
  if (!isBarberShop && pathname !== `${ROUTE_ENUM.BARBER_SHOP}/register`) {
    return <Navigate to={ROUTE_ENUM.HOME} replace />
  }

  return (
    <BarberShopProvider>
      <Outlet />
    </BarberShopProvider>
  )
}
