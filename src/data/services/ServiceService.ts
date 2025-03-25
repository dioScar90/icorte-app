import type { IServiceService as Interface } from "./interfaces/IServiceService";
import { getBrlMoneyIntoFloat } from "@/schemas/sharedValidators/brlMoney";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/service`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

function getDataWithPriceIntoFloat(data: Parameters<Interface['createService']>[1]) {
  return {
    ...data,
    price: getBrlMoneyIntoFloat(data.price),
  }
}

export class ServiceService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}
  
  createService: Interface['createService'] = async (barberShopId, data) => {
    const url = getUrl(barberShopId)
    
    try {
      const res = await this.httpClient.post(url, { ...getDataWithPriceIntoFloat(data) })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getService: Interface['getService'] = async (barberShopId, serviceId) => {
    const url = getUrl(barberShopId, serviceId)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAllServices: Interface['getAllServices'] = async (barberShopId) => {
    const url = getUrl(barberShopId)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateService: Interface['updateService'] = async (barberShopId, serviceId, data) => {
    const url = getUrl(barberShopId, serviceId)
    
    try {
      await this.httpClient.put(url, { ...getDataWithPriceIntoFloat(data) })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteService: Interface['deleteService'] = async (barberShopId, serviceId) => {
    const url = getUrl(barberShopId, serviceId)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
