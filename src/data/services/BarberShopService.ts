import { IBarberShopService as Interface } from "./interfaces/IBarberShopService";
import { Pagination, Result } from "../result";
import { ProxyContext } from "@/hooks/use-proxy";

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

export class BarberShopService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}

  createBarberShop: Interface['createBarberShop'] = async (data) => {
    const url = getUrl()
    
    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getBarberShop: Interface['getBarberShop'] = async (id) => {
    const url = getUrl(id)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAppointmentsByBarberShop: Interface['getAppointmentsByBarberShop'] = async (barberShopId, pag) => {
    const url = getUrl(barberShopId, true) + getQueryParams(pag)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateBarberShop: Interface['updateBarberShop'] = async (id, data) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteBarberShop: Interface['deleteBarberShop'] = async (id) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
