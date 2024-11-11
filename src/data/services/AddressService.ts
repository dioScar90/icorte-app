import { AddressZod } from "@/schemas/address";
import { IAddressService } from "./interfaces/IAddressService";
import { AxiosInstance } from "axios";

function getUrl(barberShpoId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShpoId}/address`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

export class AddressService implements IAddressService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createAddress(barberShpoId: number, data: AddressZod) {
    const url = getUrl(barberShpoId)
    return await this.httpClient.post(url, { ...data })
  }

  async getAddress(barberShpoId: number, id: number) {
    const url = getUrl(barberShpoId, id)
    return await this.httpClient.get(url)
  }

  async updateAddress(barberShpoId: number, id: number, data: AddressZod) {
    const url = getUrl(barberShpoId, id)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteAddress(barberShpoId: number, id: number) {
    const url = getUrl(barberShpoId, id)
    return await this.httpClient.delete(url)
  }
}
