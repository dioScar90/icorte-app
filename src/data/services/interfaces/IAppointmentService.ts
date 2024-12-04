import { BaseAxiosResult, CreatedAxiosResult, Pagination, PaginationAxiosResult } from "@/data/result";
import { AppointmentZod } from "@/schemas/appointment";
import { Appointment } from "@/types/models/appointment";

export interface IAppointmentService {
  createAppointment(data: AppointmentZod): CreatedAxiosResult<Appointment>;
  getAppointment(id: number): BaseAxiosResult<Appointment>;
  getAllAppointments(pag?: Pagination): PaginationAxiosResult<Appointment>;
  updateAppointment(id: number, data: AppointmentZod): BaseAxiosResult<void>;
  deleteAppointment(id: number): BaseAxiosResult<void>;
}
