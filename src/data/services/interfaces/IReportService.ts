import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { ReportType } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportService {
  createReport(barberShpoId: number, data: ReportType): CreatedAxiosResult<Report>;
  getReport(barberShpoId: number, id: number): BaseAxiosResult<Report>;
  getAllReports(barberShpoId: number): PaginationAxiosResult<Report>;
  updateReport(barberShpoId: number, id: number, data: ReportType): BaseAxiosResult<boolean>;
  deleteReport(barberShpoId: number, id: number): BaseAxiosResult<boolean>;
}
