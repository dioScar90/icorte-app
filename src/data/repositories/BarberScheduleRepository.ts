import { Result } from "@/data/result";
import { IBarberScheduleRepository } from "./interfaces/IBarberScheduleRepository";
import { IBarberScheduleService } from "../services/interfaces/IBarberScheduleService";
import { DateOnly } from "@/utils/types/date";

export class BarberScheduleRepository implements IBarberScheduleRepository {
  constructor(private readonly service: IBarberScheduleService) { }

  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly) {
    try {
      const res = await this.service.getAvailableDatesForBarber(barberShopId, dateOfWeek);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]) {
    try {
      const res = await this.service.getAvailableSlots(barberShopId, date, serviceIds);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getTopBarbersWithAvailability(dateOfWeek: DateOnly) {
    try {
      const res = await this.service.getTopBarbersWithAvailability(dateOfWeek);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async searchServicesByNameAsync(q: string) {
    try {
      const res = await this.service.searchServicesByNameAsync(q);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
