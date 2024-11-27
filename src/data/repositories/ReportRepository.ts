import { IReportRepository } from "./interfaces/IReportRepository";
import { IReportService } from "../services/interfaces/IReportService";
import { Result } from "@/data/result";
import { ReportZod } from "@/schemas/report";

export class ReportRepository implements IReportRepository {
  constructor(private readonly service: IReportService) { }

  async createReport(barberShopId: number, data: ReportZod) {
    try {
      const res = await this.service.createReport(barberShopId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getReport(barberShopId: number, id: number) {
    try {
      const res = await this.service.getReport(barberShopId, id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllReports(barberShopId: number) {
    try {
      const res = await this.service.getAllReports(barberShopId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateReport(barberShopId: number, id: number, data: ReportZod) {
    try {
      await this.service.updateReport(barberShopId, id, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteReport(barberShopId: number, id: number) {
    try {
      await this.service.deleteReport(barberShopId, id);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
