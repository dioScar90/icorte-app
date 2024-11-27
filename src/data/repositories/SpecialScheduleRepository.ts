import { ISpecialScheduleRepository } from "./interfaces/ISpecialScheduleRepository";
import { ISpecialScheduleService } from "../services/interfaces/ISpecialScheduleService";
import { Result } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateOnly } from "@/utils/types/date";

export class SpecialScheduleRepository implements ISpecialScheduleRepository {
  constructor(private readonly service: ISpecialScheduleService) { }

  async createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod) {
    try {
      const res = await this.service.createSpecialSchedule(barberShopId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getSpecialSchedule(barberShopId: number, date: DateOnly) {
    try {
      const res = await this.service.getSpecialSchedule(barberShopId, date);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllSpecialSchedules(barberShopId: number) {
    try {
      const res = await this.service.getAllSpecialSchedules(barberShopId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateSpecialSchedule(barberShopId: number, date: DateOnly, data: SpecialScheduleZod) {
    try {
      await this.service.updateSpecialSchedule(barberShopId, date, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteSpecialSchedule(barberShopId: number, date: DateOnly) {
    try {
      await this.service.deleteSpecialSchedule(barberShopId, date);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
