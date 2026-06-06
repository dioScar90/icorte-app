import { getBrlMoneyIntoFloatString } from "@/schemas/sharedValidators/brlMoney";
import { BaseService } from "./_baseService";
import type { ServiceZod } from "@/schemas/service";
import type { Service } from "@/types/models/service";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/service`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

function getDataWithPriceIntoFloat(data: ServiceZod) {
  return {
    ...data,
    price: getBrlMoneyIntoFloatString(data.price),
  }
}

export class ServiceService extends BaseService<Service, ServiceZod> {
  constructor() {
    super(getUrl)
  }
  
  async createService(barberShopId: number, data: ServiceZod) {
    data = getDataWithPriceIntoFloat(data)
    return await this.create(data, barberShopId)
  }

  async getService(barberShopId: number, serviceId: number) {
    return await this.get(barberShopId, serviceId)
  }

  async getAllServices(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.getAll(url)
  }

  async updateService(barberShopId: number, serviceId: number, data: ServiceZod) {
    return await this.update(data, barberShopId, serviceId)
  }

  async deleteService(barberShopId: number, serviceId: number) {
    return await this.delete(barberShopId, serviceId)
  }
}
