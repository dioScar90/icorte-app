import { IAppointmentRepository } from "./interfaces/IAppointmentRepository";
import { IAppointmentService } from "../services/interfaces/IAppointmentService";
import { Result } from "@/data/result";
import { AppointmentZod } from "@/schemas/appointment";

export class AppointmentRepository implements IAppointmentRepository {
  constructor(private readonly service: IAppointmentService) { }

  async createAppointment(data: AppointmentZod) {
    try {
      const res = await this.service.createAppointment(data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAppointment(id: number, services?: boolean) {
    try {
      const res = await this.service.getAppointment(id, services);
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

  async updateAppointment(id: number, data: AppointmentZod) {
    try {
      await this.service.updateAppointment(id, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updatePaymentType(id: number, paymentType: AppointmentZod['paymentType']) {
    try {
      await this.service.updatePaymentType(id, paymentType);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteAppointment(id: number) {
    try {
      await this.service.deleteAppointment(id);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
