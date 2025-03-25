import type { AppointmentZod } from "@/schemas/appointment";
import type { Appointment } from "@/types/models/appointment";
import type { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";

export interface IAppointmentService {
  createAppointment(data: AppointmentZod): CreatedResult<Appointment>;
  getAppointment(id: number, services?: boolean): BaseResult<Appointment>;
  getAllAppointments(pag?: Pagination): PaginationResult<Appointment>;
  updateAppointment(id: number, data: AppointmentZod): BaseResult<void>;
  updatePaymentType(id: number, paymentType: AppointmentZod['paymentType']): BaseResult<void>;
  deleteAppointment(id: number): BaseResult<void>;
}
