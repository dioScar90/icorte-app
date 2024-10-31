import { useAuth } from "@/providers/authProvider";
import { Navigate } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";

export function Logout() {
  useAuth().logout()
  return <Navigate to={ROUTE_ENUM.LOGIN} replace />
}
