import { Navigate, Outlet, useLoaderData, useLocation } from "react-router-dom";
import { ROUTE_ENUM } from "@/types/route";
import { BarberShopZod } from "@/schemas/barberShop";
import { BarberShopRepository } from "@/data/repositories/BarberShopRepository";
import { barberShopLoader } from "@/data/loaders/barberShopLoader";
import { useCallback } from "react";
import { BarberShopService } from "@/data/services/BarberShopService";
import { httpClient } from "@/providers/proxyProvider";

export type BarberShopLayoutContextType = {
  register: (data: BarberShopZod) => Promise<ReturnType<BarberShopRepository['createBarberShop']>>
  update: (id: number, data: BarberShopZod) => Promise<ReturnType<BarberShopRepository['updateBarberShop']>>
  barberShop: NonNullable<Awaited<ReturnType<typeof barberShopLoader>>>
}

export function BarberShopLayout() {
  const barberShop = useLoaderData() as Awaited<ReturnType<typeof barberShopLoader>>
  const { pathname } = useLocation()
  
  if (barberShop && pathname === `${ROUTE_ENUM.BARBER_SHOP}/register`) {
    return <Navigate to={`${ROUTE_ENUM.BARBER_SHOP}/${barberShop?.id}`} replace />
  }
  
  const repository = new BarberShopRepository(new BarberShopService(httpClient))
  
  const register = useCallback(async (data: BarberShopZod) => {
    return await repository.createBarberShop(data)
  }, [])
  
  const update = useCallback(async (id: number, data: BarberShopZod) => {
    return await repository.updateBarberShop(id, data)
  }, [])
  
  return <Outlet context={{ register, update, barberShop }} />
}
