import { httpClient } from "@/providers/proxyProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { ServiceRepository } from "../repositories/ServiceRepository";
import { ServiceService } from "../services/ServiceService";

export async function servicesLoader({ params }: LoaderFunctionArgs) {
  if (!params.barberShopId) {
    return null
  }
  
  const barberShopId = +params.barberShopId
  
  try {
    const repository = new ServiceRepository(new ServiceService(httpClient))
    const res = await repository.getAllServices(barberShopId)
    
    if (!res.isSuccess) {
      return null
    }

    return res.value
  } catch (err) {
    return null
  }
}
