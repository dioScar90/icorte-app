import { ReportZod } from "@/schemas/report";
import { IReportService } from "./interfaces/IReportService";
import { AxiosInstance } from "axios";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/report`

  if (!id) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${id}`
}

export class ReportService implements IReportService {
  constructor(private readonly httpClient: AxiosInstance) {}
  
  async createReport(barberShopId: number, data: ReportZod) {
    const url = getUrl(barberShopId)
    return await this.httpClient.post(url, { ...data })
  }

  async getReport(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.get(url)
  }

  async getAllReports(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.httpClient.get(url)
  }

  async updateReport(barberShopId: number, id: number, data: ReportZod) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteReport(barberShopId: number, id: number) {
    const url = getUrl(barberShopId, id)
    return await this.httpClient.delete(url)
  }
}
