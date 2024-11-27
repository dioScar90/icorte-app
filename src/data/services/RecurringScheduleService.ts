import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { IRecurringScheduleService } from "./interfaces/IRecurringScheduleService";
import { DayOfWeek } from "@/utils/types/date";
import { AxiosInstance } from "axios";

function getUrl(barberShopId: number, dayOfWeek?: DayOfWeek) {
  const baseEndpoint = `/barber-shop/${barberShopId}/recurring-schedule`

  if (dayOfWeek === undefined) {
    return baseEndpoint
  }

  return `${baseEndpoint}/${dayOfWeek}`
}

export class RecurringScheduleService implements IRecurringScheduleService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod) {
    const url = getUrl(barberShopId)
    return await this.httpClient.post(url, { ...data })
  }

  async getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    const url = getUrl(barberShopId, dayOfWeek)
    return await this.httpClient.get(url)
  }

  async getAllRecurringSchedules(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.httpClient.get(url)
  }

  async updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod) {
    const url = getUrl(barberShopId, dayOfWeek)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek) {
    const url = getUrl(barberShopId, dayOfWeek)
    return await this.httpClient.delete(url)
  }
}
