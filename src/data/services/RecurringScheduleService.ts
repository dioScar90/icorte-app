import { RecurringScheduleType } from "@/schemas/recurringSchedule";
import { IRecurringScheduleService } from "./interfaces/IRecurringScheduleService";
import { DayOfWeek } from "@/types/models/date";
import { AxiosInstance } from "axios";

function getUrl(barberShpoId: number, dayOfWeek?: DayOfWeek) {
  const baseEndpoint = `/barber-shop/${barberShpoId}/recurring-schedule`

  if (dayOfWeek === undefined) {
    return baseEndpoint
  }

  return `${baseEndpoint}/${dayOfWeek}`
}

export class RecurringScheduleService implements IRecurringScheduleService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async createRecurringSchedule(barberShpoId: number, data: RecurringScheduleType) {
    const url = getUrl(barberShpoId)
    return await this.httpClient.post(url, { ...data })
  }

  async getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek) {
    const url = getUrl(barberShpoId, dayOfWeek)
    return await this.httpClient.get(url)
  }

  async getAllRecurringSchedules(barberShpoId: number) {
    const url = getUrl(barberShpoId)
    return await this.httpClient.get(url)
  }

  async updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleType) {
    const url = getUrl(barberShpoId, dayOfWeek)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek) {
    const url = getUrl(barberShpoId, dayOfWeek)
    return await this.httpClient.delete(url)
  }
}
