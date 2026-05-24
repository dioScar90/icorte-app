import type { DayOfWeek } from "@/types/datetime/day-of-week";
import { Result, type PaginationResult } from "../result";
import { BaseService } from "./_baseService";
import type { RecurringSchedule } from "@/types/models/recurringSchedule";
import type { RecurringScheduleZod } from "@/schemas/recurringSchedule";

function getUrl(barberShopId: number, dayOfWeek?: DayOfWeek) {
  const baseEndpoint = `/barber-shop/${barberShopId}/recurring-schedule`
  return dayOfWeek === undefined ? baseEndpoint : `${baseEndpoint}/${dayOfWeek}`
}

export class RecurringScheduleService extends BaseService<RecurringSchedule, RecurringScheduleZod> {
  constructor(httpClient: ConstructorParameters<typeof BaseService>[0]) {
    super(httpClient, getUrl)
  }

  async createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod) {
    return await this.create(data, barberShopId)
  }

  async getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    return await this.get(barberShopId, dayOfWeek)
  }

  async getAllRecurringSchedules(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.getAll(url)
  }

  async updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod) {
    return await this.update(data, barberShopId, dayOfWeek)
  }

  async deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    return await this.delete(barberShopId, dayOfWeek)
  }
}
