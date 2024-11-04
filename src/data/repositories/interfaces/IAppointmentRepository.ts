import { BaseResult, CreatedResult } from "@/data/result";
import { AppointmentType } from "@/schemas/appointment";
import { Appointment } from "@/types/models/appointment";

export interface IAppointmentRepository {
  createAppointment(data: AppointmentType): CreatedResult<Appointment>;
  getAppointment(id: number): BaseResult<Appointment>;
  getAllAppointments(): BaseResult<Appointment[]>;
  updateAppointment(id: number, data: AppointmentType): BaseResult<boolean>;
  deleteAppointment(id: number): BaseResult<boolean>;
}
