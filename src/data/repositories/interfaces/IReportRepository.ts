import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { ReportZod } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportRepository {
  createReport(barberShpoId: number, data: ReportZod): CreatedResult<Report>;
  getReport(barberShpoId: number, id: number): BaseResult<Report>;
  getAllReports(barberShpoId: number): PaginationResult<Report>;
  updateReport(barberShpoId: number, id: number, data: ReportZod): BaseResult<void>;
  deleteReport(barberShpoId: number, id: number): BaseResult<void>;
}
