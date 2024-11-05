import { IAppointmentRepository } from "./interfaces/IAppointmentRepository";
import { IAppointmentService } from "../services/interfaces/IAppointmentService";
import { Result } from "@/data/result";
import { AppointmentType } from "@/schemas/appointment";

export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly service: IAppointmentService) { }

  async createAppointment(data: AppointmentType) {
    try {
      const res = await this.service.createAppointment(data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAppointment(id: number) {
    try {
      const res = await this.service.getAppointment(id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllAppointments() {
    try {
      const res = await this.service.getAllAppointments();
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateAppointment(id: number, data: AppointmentType) {
    try {
      const res = await this.service.updateAppointment(id, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteAppointment(id: number) {
    try {
      const res = await this.service.deleteAppointment(id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
