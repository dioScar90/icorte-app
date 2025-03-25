import type { IReportService as Interface } from "./interfaces/IReportService";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/report`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class ReportService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}
  
  createReport: Interface['createReport'] = async (barberShopId, data) => {
    const url = getUrl(barberShopId)

    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getReport: Interface['getReport'] = async (barberShopId, id) => {
    const url = getUrl(barberShopId, id)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAllReports: Interface['getAllReports'] = async (barberShopId) => {
    const url = getUrl(barberShopId)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateReport: Interface['updateReport'] = async (barberShopId, id, data) => {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteReport: Interface['deleteReport'] = async (barberShopId, id) => {
    const url = getUrl(barberShopId, id)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
