import { Navigate, Outlet, useLoaderData, useLocation, useOutletContext } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { BarberShopRepository } from "@/data/repositories/BarberShopRepository";
import { barberShopLoader } from "@/data/loaders/barberShopLoader";
import { useCallback, useMemo } from "react";
import { BarberShopService } from "@/data/services/BarberShopService";
import { httpClient } from "@/providers/proxyProvider";

type BarberShopLayoutContextType = {
  register: BarberShopRepository['createBarberShop']
  update: BarberShopRepository['updateBarberShop']
  barberShop: NonNullable<Awaited<ReturnType<typeof barberShopLoader>>>
}

export function BarberShopLayout() {
  const barberShop = useLoaderData() as NonNullable<Awaited<ReturnType<typeof barberShopLoader>>>
  const { pathname } = useLocation()
  const repository = useMemo(() => new BarberShopRepository(new BarberShopService(httpClient)), [])
  
  if (barberShop && pathname === `${ROUTE_ENUM.BARBER_SHOP}/register`) {
    return <Navigate to={`${ROUTE_ENUM.BARBER_SHOP}/${barberShop?.id}`} replace />
  }
  
  const register = useCallback(async function(...args: Parameters<typeof repository.createBarberShop>) {
    return await repository.createBarberShop(...args)
  }, [])
  
  const update = useCallback(async function(...args: Parameters<typeof repository.updateBarberShop>) {
    return await repository.updateBarberShop(...args)
  }, [])

  const props: BarberShopLayoutContextType = {
    register,
    update,
    barberShop,
  }
  
  return <Outlet context={props} />
}

export function useBarberShopLayout() {
  return useOutletContext<BarberShopLayoutContextType>()
}
