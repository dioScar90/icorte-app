import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { ReportType } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportService {
  createReport(barberShpoId: number, data: ReportType): CreatedAxiosResult<Report>;
  getReport(barberShpoId: number, id: number): BaseAxiosResult<Report>;
  getAllReports(barberShpoId: number): BaseAxiosResult<Report[]>;
  updateReport(barberShpoId: number, id: number, data: ReportType): BaseAxiosResult<boolean>;
  deleteReport(barberShpoId: number, id: number): BaseAxiosResult<boolean>;
}
