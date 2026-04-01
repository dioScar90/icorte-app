import type { ProxyContext } from "@/hooks/use-proxy";
import { Result, type BaseResult, type CreatedResult } from "@/data/result";
import type { AddressZod } from "@/schemas/address";
import type { Address } from "@/types/models/address";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/address`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class AddressService {
  constructor(private readonly httpClient: ProxyContext) {}
  
  async createAddress(barberShopId: number, data: AddressZod) {
    const url = getUrl(barberShopId)
    
    try {
      const res = await this.httpClient.post<CreatedResult<Address>>(url, data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async getAddress(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    
    try {
      const res = await this.httpClient.get<BaseResult<Address>>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async updateAddress(barberShopId: number, id: number, data: AddressZod) {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.put<BaseResult<void>>(url, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async deleteAddress(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.delete<BaseResult<void>>(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
