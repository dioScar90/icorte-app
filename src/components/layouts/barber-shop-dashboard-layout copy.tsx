import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { useBarberShopLayout } from "./barber-shop-layout";
import { barberShopDashboardLoader } from "@/data/loaders/barberShopDashboardLoader";

type BarberShopDashboardLayoutContextType = {
  barberShop: ReturnType<typeof useBarberShopLayout>['barberShop']
  getAppointments: ReturnType<typeof useBarberShopLayout>['getAppointments']
  appointments: Awaited<ReturnType<typeof barberShopDashboardLoader>>
}

export function BarberShopDashboardLayout() {
  const { barberShop, getAppointments } = useBarberShopLayout() as ReturnType<typeof useBarberShopLayout>
  const appointments = useLoaderData() as BarberShopDashboardLayoutContextType['appointments']
  
  const props: BarberShopDashboardLayoutContextType = {
    appointments,
    barberShop,
    getAppointments,
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useBarberShopDashboardLayout() {
  return useOutletContext<BarberShopDashboardLayoutContextType>()
}
