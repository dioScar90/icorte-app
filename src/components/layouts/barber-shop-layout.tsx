import { Navigate, Outlet, useLocation } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { useBarberShop } from "@/providers/barberShopProvider";

export function BarberShopLayout() {
  const { pathname } = useLocation()
  const { isBarberShop, barberShop } = useBarberShop()
  
  if (isBarberShop && pathname === `${ROUTE_ENUM.BARBER_SHOP}/register`) {
    return <Navigate to={`${ROUTE_ENUM.BARBER_SHOP}/${barberShop?.id}`} replace />
  }
  
  return <Outlet />
}
