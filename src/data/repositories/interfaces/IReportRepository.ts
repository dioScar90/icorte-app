import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { ReportZod } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportRepository {
  createReport(barberShopId: number, data: ReportZod): CreatedResult<Report>;
  getReport(barberShopId: number, id: number): BaseResult<Report>;
  getAllReports(barberShopId: number, pag?: Pagination): PaginationResult<Report>;
  updateReport(barberShopId: number, id: number, data: ReportZod): BaseResult<void>;
  deleteReport(barberShopId: number, id: number): BaseResult<void>;
}
