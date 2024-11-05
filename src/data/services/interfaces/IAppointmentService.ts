import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { AppointmentType } from "@/schemas/appointment";
import { Appointment } from "@/types/models/appointment";

export interface IAppointmentService {
  createAppointment(data: AppointmentType): CreatedAxiosResult<Appointment>;
  getAppointment(id: number): BaseAxiosResult<Appointment>;
  getAllAppointments(): PaginationAxiosResult<Appointment>;
  updateAppointment(id: number, data: AppointmentType): BaseAxiosResult<boolean>;
  deleteAppointment(id: number): BaseAxiosResult<boolean>;
}
