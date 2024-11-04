import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "@/providers/authProvider";
import { ROUTE_ENUM } from "@/types/route";

export function BarberScheduleLayout() {
  const { user } = useAuth()

  if (!user?.barberShop) {
    return <Navigate to={ROUTE_ENUM.CLIENT} replace />
  }

  return <Outlet />
}
