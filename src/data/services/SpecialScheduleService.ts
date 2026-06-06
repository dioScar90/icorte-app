import type { DateString } from "@/types/datetime/date-string";
import { BaseService } from "./_baseService";
import type { SpecialSchedule } from "@/types/models/specialSchedule";
import type { SpecialScheduleZod } from "@/schemas/specialSchedule";

function getUrl(barberShopId: number, date?: DateString) {
  const baseEndpoint = `/barber-shop/${barberShopId}/special-schedule`
  return date === undefined ? baseEndpoint : `${baseEndpoint}/${date}`
}

export class SpecialScheduleService extends BaseService<SpecialSchedule, SpecialScheduleZod> {
  constructor() {
    super(getUrl)
  }

  async createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod) {
    return await this.create(data, barberShopId)
  }

  async getSpecialSchedule(barberShopId: number, date: DateString) {
    return await this.get(barberShopId, date)
  }

  async getAllSpecialSchedules(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.getAll(url)
  }

  async updateSpecialSchedule(barberShopId: number, date: DateString, data: SpecialScheduleZod) {
    return await this.update(data, barberShopId, date)
  }

  async deleteSpecialSchedule(barberShopId: number, date: DateString) {
    return await this.delete(barberShopId, date)
  }
}
