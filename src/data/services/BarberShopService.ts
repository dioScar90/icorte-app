import { BarberShopZod } from "@/schemas/barberShop";
import { IBarberShopService } from "./interfaces/IBarberShopService";
import { AxiosInstance } from "axios";
import { Pagination } from "../result";

function getUrl(id?: number, appointments?: boolean) {
  const baseEndpoint = `/barber-shop`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}` + (appointments ? '/appointments' : '')
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

export class BarberShopService implements IBarberShopService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async createBarberShop(data: BarberShopZod) {
    const url = getUrl()
    return await this.httpClient.post(url, { ...data })
  }

  async getBarberShop(id: number) {
    const url = getUrl(id)
    return await this.httpClient.get(url)
  }

  async getAppointmentsByBarberShop(barberShopId: number, pag?: Pagination) {
    const url = getUrl(barberShopId, true) + getQueryParams(pag)
    return await this.httpClient.get(url)
  }

  async updateBarberShop(id: number, data: BarberShopZod) {
    const url = getUrl(id)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteBarberShop(id: number) {
    const url = getUrl(id)
    return await this.httpClient.delete(url)
  }
}
