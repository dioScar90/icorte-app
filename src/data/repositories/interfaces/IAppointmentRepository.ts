import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { AppointmentZod } from "@/schemas/appointment";
import { Appointment } from "@/types/models/appointment";

export interface IAppointmentRepository {
  createAppointment(data: AppointmentZod): CreatedResult<Appointment>;
  getAppointment(id: number, services?: boolean): BaseResult<Appointment>;
  getAllAppointments(pag?: Pagination): PaginationResult<Appointment>;
  updateAppointment(id: number, data: AppointmentZod): BaseResult<void>;
  updatePaymentType(id: number, paymentType: AppointmentZod['paymentType']): BaseResult<void>;
  deleteAppointment(id: number): BaseResult<void>;
}
