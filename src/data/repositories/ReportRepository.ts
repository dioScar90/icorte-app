import { IReportRepository } from "./interfaces/IReportRepository";
import { IReportService } from "../services/interfaces/IReportService";
import { Result } from "@/data/result";
import { ReportZod } from "@/schemas/report";

export class ReportRepository implements IReportRepository {
  constructor(private readonly service: IReportService) { }

  async createReport(barberShpoId: number, data: ReportZod) {
    try {
      const res = await this.service.createReport(barberShpoId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getReport(barberShpoId: number, id: number) {
    try {
      const res = await this.service.getReport(barberShpoId, id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllReports(barberShpoId: number) {
    try {
      const res = await this.service.getAllReports(barberShpoId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateReport(barberShpoId: number, id: number, data: ReportZod) {
    try {
      await this.service.updateReport(barberShpoId, id, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteReport(barberShpoId: number, id: number) {
    try {
      await this.service.deleteReport(barberShpoId, id);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
