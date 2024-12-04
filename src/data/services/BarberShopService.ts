import { BarberShopZod } from "@/schemas/barberShop";
import { IBarberShopService } from "./interfaces/IBarberShopService";
import { AxiosInstance } from "axios";

function getUrl(id?: number, appointments?: boolean) {
  const baseEndpoint = `/barber-shop`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}` + (appointments ? '/appointments' : '')
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

  async getAppointmentsByBarberShop(barberShopId: number) {
    const url = getUrl(barberShopId, true)
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
