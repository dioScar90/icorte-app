import type { ReportZod } from "@/schemas/report";
import type { Report } from "@/types/models/report";
import type { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";

export interface IReportService {
  createReport(barberShopId: number, data: ReportZod): CreatedResult<Report>;
  getReport(barberShopId: number, id: number): BaseResult<Report>;
  getAllReports(barberShopId: number, pag?: Pagination): PaginationResult<Report>;
  updateReport(barberShopId: number, id: number, data: ReportZod): BaseResult<void>;
  deleteReport(barberShopId: number, id: number): BaseResult<void>;
}
