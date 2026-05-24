import { BaseService } from "./_baseService";
import type { ReportZod } from "@/schemas/report";
import type { Report } from "@/types/models/report";

function getUrl(barberShopId: number, id?: number) {
  const baseEndpoint = `/barber-shop/${barberShopId}/report`
  return !id ? baseEndpoint : `${baseEndpoint}/${id}`
}

export class ReportService extends BaseService<Report, ReportZod> {
  constructor(httpClient: ConstructorParameters<typeof BaseService>[0]) {
    super(httpClient, getUrl)
  }
  
  async createReport(barberShopId: number, data: ReportZod) {
    return await this.create(data, barberShopId)
  }

  async getReport(barberShopId: number, id: number) {
    return await this.get(barberShopId, id)
  }

  async getAllReports(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.getAll(url)
  }

  async updateReport(barberShopId: number, id: number, data: ReportZod) {
    return await this.update(data, barberShopId, id)
  }

  async deleteReport(barberShopId: number, id: number) {
    return await this.delete(barberShopId, id)
  }
}
