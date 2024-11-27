import { AddressZod } from "@/schemas/address";
import { IAddressService } from "./interfaces/IAddressService";
import { AxiosInstance } from "axios";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/address`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

export class AddressService implements IAddressService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createAddress(barberShopId: number, data: AddressZod) {
    const url = getUrl(barberShopId)
    return await this.httpClient.post(url, { ...data })
  }

  async getAddress(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.get(url)
  }

  async updateAddress(barberShopId: number, id: number, data: AddressZod) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteAddress(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.delete(url)
  }
}
