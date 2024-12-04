import { httpClient } from "@/providers/proxyProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { BarberShopRepository } from "../repositories/BarberShopRepository";
import { BarberShopService } from "../services/BarberShopService";

export async function barberShopDashboardLoader({ params, request }: LoaderFunctionArgs) {
  if (!params.barberShopId) {
    return null
  }
  
  const barberShopId = +params.barberShopId
  const page = new URL(request.url).searchParams.get('page')
  
  try {
    const repository = new BarberShopRepository(new BarberShopService(httpClient))
    return await repository.getAppointmentsByBarberShop(barberShopId, { page: page ? +page : 1, pageSize: 5 })
    
  } catch (err) {
    return null
  }
}
