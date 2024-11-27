import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { ReportZod } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportService {
  createReport(barberShopId: number, data: ReportZod): CreatedAxiosResult<Report>;
  getReport(barberShopId: number, id: number): BaseAxiosResult<Report>;
  getAllReports(barberShopId: number): PaginationAxiosResult<Report>;
  updateReport(barberShopId: number, id: number, data: ReportZod): BaseAxiosResult<void>;
  deleteReport(barberShopId: number, id: number): BaseAxiosResult<void>;
}
