import type { ProxyContext } from "@/hooks/use-proxy";
import { type Pagination, type PaginationResult, Result } from "@/data/result";
import type { BarberShopZod } from "@/schemas/barberShop";
import type { BarberShop } from "@/types/models/barberShop";
import type { AppointmentByBarberShop } from "@/types/custom-models/appointment-by-barber-shop";

function getUrl(id?: number, appointments?: boolean) {
  const baseEndpoint = `/barber-shop`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}${appointments ? '/appointments' : ''}`
}

function getQueryParams(pag?: Pagination) {
  if (!pag) {
    return ''
  }
  
  const searchParams = new URLSearchParams()
  
  for (const key in pag) {
    const value = pag[key as keyof typeof pag]
    
    if (value === undefined) {
      continue
    }
    
    searchParams.append(key, String(value))
  }
  
  if (searchParams.size === 0) {
    return ''
  }
  
  return '?' + searchParams.toString()
}

export class BarberShopService {
  constructor(private readonly httpClient: ProxyContext) {}
  
  async createBarberShop(data: BarberShopZod) {
    const url = getUrl()
    
    try {
      const res = await this.httpClient.post<BarberShop>(url, data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async getBarberShop(id: number) {
    const url = getUrl(id)
    
    try {
      const res = await this.httpClient.get<BarberShop>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async getAppointmentsByBarberShop(barberShopId: number, pag?: Pagination) {
    const url = getUrl(barberShopId, true) + getQueryParams(pag)
    
    try {
      const res = await this.httpClient.get<PaginationResult<AppointmentByBarberShop>>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async updateBarberShop(id: number, data: BarberShopZod) {
    const url = getUrl(id)
    
    try {
      await this.httpClient.put(url, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async deleteBarberShop(id: number) {
    const url = getUrl(id)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
