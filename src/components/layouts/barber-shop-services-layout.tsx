import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { servicesLoader } from "@/data/loaders/servicesLoader";
import { useCallback, useMemo } from "react";
import { httpClient } from "@/providers/proxyProvider";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { ServiceService } from "@/data/services/ServiceService";
import { useBarberShopLayout } from "./barber-shop-layout";

type BarberShopServicesLayoutContextType = {
  barberShop: ReturnType<typeof useBarberShopLayout>['barberShop']
  services: Awaited<ReturnType<typeof servicesLoader>>
  register: ServiceRepository['createService']
  update: ServiceRepository['updateService']
  remove: ServiceRepository['deleteService']
}

export function BarberShopServicesLayout() {
  const { barberShop } = useBarberShopLayout()
  const services = useLoaderData() as Awaited<ReturnType<typeof servicesLoader>>
  const repository = useMemo(() => new ServiceRepository(new ServiceService(httpClient)), [])
  
  const register = useCallback(async function(...args: Parameters<typeof repository.createService>) {
    return await repository.createService(...args)
  }, [])
  
  const update = useCallback(async function(...args: Parameters<typeof repository.updateService>) {
    return await repository.updateService(...args)
  }, [])
  
  const remove = useCallback(async function(...args: Parameters<typeof repository.deleteService>) {
    return await repository.deleteService(...args)
  }, [])
  
  const props: BarberShopServicesLayoutContextType = {
    barberShop,
    services,
    register,
    update,
    remove,
  }
  
  return (
    <Outlet context={props} />
  )
}

export function useServicesLayout() {
  return useOutletContext<BarberShopServicesLayoutContextType>()
}
