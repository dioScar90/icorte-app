import { IRecurringScheduleRepository } from "./interfaces/IRecurringScheduleRepository";
import { IRecurringScheduleService } from "../services/interfaces/IRecurringScheduleService";
import { Result } from "@/data/result";
import { RecurringScheduleType } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";

export class RecurringScheduleRepository implements IRecurringScheduleRepository {
  constructor(private readonly service: IRecurringScheduleService) { }

  async createRecurringSchedule(barberShpoId: number, data: RecurringScheduleType) {
    try {
      const res = await this.service.createRecurringSchedule(barberShpoId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek) {
    try {
      const res = await this.service.getRecurringSchedule(barberShpoId, dayOfWeek);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllRecurringSchedules(barberShpoId: number) {
    try {
      const res = await this.service.getAllRecurringSchedules(barberShpoId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleType) {
    try {
      const res = await this.service.updateRecurringSchedule(barberShpoId, dayOfWeek, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek) {
    try {
      const res = await this.service.deleteRecurringSchedule(barberShpoId, dayOfWeek);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
