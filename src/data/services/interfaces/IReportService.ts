import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { ReportZod } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportService {
  createReport(barberShpoId: number, data: ReportZod): CreatedAxiosResult<Report>;
  getReport(barberShpoId: number, id: number): BaseAxiosResult<Report>;
  getAllReports(barberShpoId: number): PaginationAxiosResult<Report>;
  updateReport(barberShpoId: number, id: number, data: ReportZod): BaseAxiosResult<void>;
  deleteReport(barberShpoId: number, id: number): BaseAxiosResult<void>;
}
