import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";

export function BarberShopLayout() {
  const { authUser } = useAuth()

  if (!authUser?.barberShop) {
    return <Navigate to={ROUTE_ENUM.CLIENT} replace />
  }

  return <Outlet />
}
