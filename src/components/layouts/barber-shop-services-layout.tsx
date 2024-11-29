import { Outlet, useLoaderData, useOutletContext } from "react-router-dom";
import { servicesLoader } from "@/data/loaders/servicesLoader";
import { useMemo } from "react";
import { httpClient } from "@/providers/proxyProvider";
import { ServiceRepository } from "@/data/repositories/ServiceRepository";
import { ServiceService } from "@/data/services/ServiceService";
import { BarberShopLayoutContextType } from "./barber-shop-layout";

export type BarberShopServicesLayoutContextType = {
  barberShop: BarberShopLayoutContextType['barberShop']
  services: Awaited<ReturnType<typeof servicesLoader>>
  register: ServiceRepository['createService']
  update: ServiceRepository['updateService']
  remove: ServiceRepository['deleteService']
}

export function BarberShopServicesLayout() {
  const { barberShop } = useOutletContext<BarberShopLayoutContextType>()
  const services = useLoaderData() as Awaited<ReturnType<typeof servicesLoader>>
  const repository = useMemo(() => new ServiceRepository(new ServiceService(httpClient)), [])
  
  return (
    <Outlet
      context={{
        barberShop,
        services,
        register: repository.createService,
        update: repository.updateService,
        remove: repository.deleteService,
      }}
    />
  )
}

export function useServicesLayout() {
  return useOutletContext<BarberShopServicesLayoutContextType>()
}
