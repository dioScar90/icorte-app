import { httpClient } from "@/providers/proxyProvider";
import { LoaderFunctionArgs } from "react-router-dom";
import { BarberShopRepository } from "../repositories/BarberShopRepository";
import { BarberShopService } from "../services/BarberShopService";
import { getBarberShopImageUrl } from "@/providers/authProvider";

export async function barberShopLoader({ params }: LoaderFunctionArgs) {
  if (!params.barberShopId) {
    return null
  }
  
  const barberShopId = +params.barberShopId
  
  try {
    const repository = new BarberShopRepository(new BarberShopService(httpClient))
    const res = await repository.getBarberShop(barberShopId)
    
    if (!res.isSuccess) {
      return null
    }
    
    return {
      ...res.value,
      imageUrl: getBarberShopImageUrl(res.value)
    }
  } catch (err) {
    return null
  }
}
