import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { servicesLoader } from "@/data/loaders/servicesLoader";
import { useCallback, useMemo } from "react";
import { httpClient } from "@/providers/proxyProvider";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { ServiceService } from "@/data/services/ServiceService";
import { ServiceZod } from "@/schemas/service";
import { BarberShopLayoutContextType } from "./barber-shop-layout";

export type BarberShopServicesLayoutContextType = {
  barberShop: BarberShopLayoutContextType['barberShop']
  services: Awaited<ReturnType<typeof servicesLoader>>
  register: (barberShopId: number, data: ServiceZod) => Promise<ReturnType<ServiceRepository['createService']>>
  update: (barberShopId: number, serviceId: number, data: ServiceZod) => Promise<ReturnType<ServiceRepository['updateService']>>
  remove: (barberShopId: number, serviceId: number) => Promise<ReturnType<ServiceRepository['deleteService']>>
}

export function BarberShopServicesLayout() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const services = useLoaderData() as Awaited<ReturnType<typeof servicesLoader>>
  const repository = useMemo(() => new ServiceRepository(new ServiceService(httpClient)), [])
  
  const register = useCallback(async (barberShopId: number, data: ServiceZod) => {
    return await repository.createService(barberShopId, data)
  }, [])
  
  const update = useCallback(async (barberShopId: number, serviceId: number, data: ServiceZod) => {
    return await repository.updateService(barberShopId, serviceId, data)
  }, [])
  
  const remove = useCallback(async (barberShopId: number, serviceId: number) => {
    return await repository.deleteService(barberShopId, serviceId)
  }, [])
  
  return <Outlet context={{ barberShop, services, register, update, remove }} />
}
