import { ServiceZod } from "@/schemas/service";
import { IServiceService } from "./interfaces/IServiceService";
import { AxiosInstance } from "axios";
import { getBrlMoneyIntoFloat } from "@/schemas/sharedValidators/brlMoney";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/service`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

function getDataWithPriceIntoFloat(data: ServiceZod) {
  return {
    ...data,
    price: getBrlMoneyIntoFloat(data.price),
  }
}

export class ServiceService implements IServiceService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createService(barberShopId: number, data: ServiceZod) {
    const url = getUrl(barberShopId)
    return await this.httpClient.post(url, getDataWithPriceIntoFloat(data))
  }

  async getService(barberShopId: number, serviceId: number) {
    const url = getUrl(barberShopId, serviceId)
    return await this.httpClient.get(url)
  }

  async getAllServices(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.httpClient.get(url)
  }

  async updateService(barberShopId: number, serviceId: number, data: ServiceZod) {
    const url = getUrl(barberShopId, serviceId)
    const datanessapoarr = getDataWithPriceIntoFloat(data)
    console.log('service-final', datanessapoarr)
    return await this.httpClient.put(url, datanessapoarr)
  }

  async deleteService(barberShopId: number, serviceId: number) {
    const url = getUrl(barberShopId, serviceId)
    return await this.httpClient.delete(url)
  }
}
