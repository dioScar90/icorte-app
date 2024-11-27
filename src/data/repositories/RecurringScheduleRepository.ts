import { IRecurringScheduleRepository } from "./interfaces/IRecurringScheduleRepository";
import { IRecurringScheduleService } from "../services/interfaces/IRecurringScheduleService";
import { Result } from "@/data/result";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";

export class RecurringScheduleRepository implements IRecurringScheduleRepository {
  constructor(private readonly service: IRecurringScheduleService) { }

  async createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod) {
    try {
      const res = await this.service.createRecurringSchedule(barberShopId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    try {
      const res = await this.service.getRecurringSchedule(barberShopId, dayOfWeek);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllRecurringSchedules(barberShopId: number) {
    try {
      const res = await this.service.getAllRecurringSchedules(barberShopId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod) {
    try {
      await this.service.updateRecurringSchedule(barberShopId, dayOfWeek, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    try {
      await this.service.deleteRecurringSchedule(barberShopId, dayOfWeek);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
