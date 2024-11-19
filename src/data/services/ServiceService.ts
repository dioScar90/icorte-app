import { ServiceZod } from "@/schemas/service";
import { IServiceService } from "./interfaces/IServiceService";
import { AxiosInstance } from "axios";

function getUrl(barberShpoId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShpoId}/service`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

export class ServiceService implements IServiceService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createService(barberShpoId: number, data: ServiceZod) {
    const url = getUrl(barberShpoId)
    return await this.httpClient.post(url, { ...data })
  }

  async getService(barberShpoId: number, serviceId: number) {
    const url = getUrl(barberShpoId, serviceId)
    return await this.httpClient.get(url)
  }

  async getAllServices(barberShpoId: number) {
    const url = getUrl(barberShpoId)
    return await this.httpClient.get(url)
  }

  async updateService(barberShpoId: number, serviceId: number, data: ServiceZod) {
    const url = getUrl(barberShpoId, serviceId)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteService(barberShpoId: number, serviceId: number) {
    const url = getUrl(barberShpoId, serviceId)
    return await this.httpClient.delete(url)
  }
}