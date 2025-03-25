import type { IAddressService as Interface } from "./interfaces/IAddressService";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/address`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class AddressService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}
  
  createAddress: Interface['createAddress'] = async (barberShopId, data) => {
    const url = getUrl(barberShopId)
    
    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAddress: Interface['getAddress'] = async (barberShopId, id) => {
    const url = getUrl(barberShopId, id)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateAddress: Interface['updateAddress'] = async (barberShopId, id, data) => {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteAddress: Interface['deleteAddress'] = async (barberShopId, id) => {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
