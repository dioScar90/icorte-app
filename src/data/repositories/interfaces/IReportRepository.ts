import { BaseResult, CreatedResult } from "@/data/result";
import { ReportType } from "@/schemas/report";
import { Report } from "@/types/models/report";

export interface IReportRepository {
  createReport(barberShpoId: number, data: ReportType): CreatedResult<Report>;
  getReport(barberShpoId: number, id: number): BaseResult<Report>;
  getAllReports(barberShpoId: number): BaseResult<Report[]>;
  updateReport(barberShpoId: number, id: number, data: ReportType): BaseResult<boolean>;
  deleteReport(barberShpoId: number, id: number): BaseResult<boolean>;
}
