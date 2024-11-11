import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { AppointmentZod } from "@/schemas/appointment";
import { Appointment } from "@/types/models/appointment";

export interface IAppointmentRepository {
  createAppointment(data: AppointmentZod): CreatedResult<Appointment>;
  getAppointment(id: number): BaseResult<Appointment>;
  getAllAppointments(): PaginationResult<Appointment>;
  updateAppointment(id: number, data: AppointmentZod): BaseResult<void>;
  deleteAppointment(id: number): BaseResult<void>;
}
