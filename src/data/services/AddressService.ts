import type { AddressZod } from "@/schemas/address";
import type { Address } from "@/types/models/address";
import { BaseService } from "./_baseService";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/address`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class AddressService extends BaseService<Address, AddressZod> {
  constructor() {
    super(getUrl)
  }
  
  async createAddress(barberShopId: number, data: AddressZod) {
    return await this.create(data, barberShopId)
  }
  
  async getAddress(barberShopId: number, id: number) {
    return await this.get(barberShopId, id)
  }
  
  async updateAddress(barberShopId: number, id: number, data: AddressZod) {
    return await this.update(data, barberShopId, id)
  }

  async deleteAddress(barberShopId: number, id: number) {
    return await this.delete(barberShopId, id)
  }
}
