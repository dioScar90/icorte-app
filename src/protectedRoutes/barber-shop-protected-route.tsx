import { Navigate, Outlet, useLoaderData, useLocation } from "react-router-dom"
import { ROUTE_ENUM } from "@/types/route"
import { BarberShopProvider } from "@/providers/barberShopProvider"
import { useAuth } from "@/providers/authProvider"

export function ProtectedBarberShopRoute() {
  const { pathname } = useLocation()
  const { barberShopId } = useLoaderData() as { barberShopId?: string }
  const { user, isAuthenticated, isBarberShop } = useAuth()

  console.log('vai', { user, isAuthenticated, isBarberShop, pathname, compare: `${ROUTE_ENUM.BARBER_SHOP}/register` })
  
  if (!isAuthenticated) {
    return <Navigate to={ROUTE_ENUM.LOGIN} replace />
  }

  const isRegisterBarberShopPage = pathname === `${ROUTE_ENUM.BARBER_SHOP}/register`
  
  if (!isBarberShop && !isRegisterBarberShopPage) {
    return <Navigate to={ROUTE_ENUM.HOME} replace />
  }
  
  if (!isRegisterBarberShopPage && user?.barberShop?.id !== +barberShopId!) {
    return <Navigate to={ROUTE_ENUM.HOME} replace />
  }

  return (
    <BarberShopProvider>
      <Outlet />
    </BarberShopProvider>
  )
}
