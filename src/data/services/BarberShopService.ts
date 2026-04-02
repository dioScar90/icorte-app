import type { ProxyContext } from "@/hooks/use-proxy";
import { type Pagination, type PaginationResult, Result } from "@/data/result";
import type { BarberShopZod } from "@/schemas/barberShop";
import type { BarberShop } from "@/types/models/barberShop";
import type { AppointmentByBarberShop } from "@/types/custom-models/appointment-by-barber-shop";
import { BaseService } from "./_baseService";

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

export class BarberShopService extends BaseService<BarberShop, BarberShopZod> {
  constructor(httpClient: ProxyContext) {
    super(httpClient, getUrl, getQueryParams)
  }
  
  async createBarberShop(data: BarberShopZod) {
    return await super.create(data)
  }
  
  async getBarberShop(id: number) {
    return await super.get(id)
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
    return await super.update(data, id)
  }
  
  async deleteBarberShop(id: number) {
    return await super.delete(id)
  }
}
