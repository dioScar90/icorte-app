import { DateOnly } from "@/utils/types/date";
import { IBarberScheduleService } from "./interfaces/IBarberScheduleService";
import { AxiosInstance } from "axios";

enum STR_BEFORE_DATE {
  DATES = 'dates',
  SLOTS = 'slots',
}

function getUrl(date: DateOnly, beforeDate?: STR_BEFORE_DATE, barberShopId?: number) {
  const baseEndpoint = `/barber-schedule`

  if (!beforeDate) {
    return `${baseEndpoint}/top-barbers/${date}`
  }

  return `${baseEndpoint}/${barberShopId!}/${beforeDate}/${date}`
}

export class BarberScheduleService implements IBarberScheduleService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly) {
    const url = getUrl(dateOfWeek, STR_BEFORE_DATE.DATES, barberShopId)
    return await this.httpClient.get(url)
  }

  async getAvailableSlots(barberShopId: number, date: DateOnly) {
    const url = getUrl(date, STR_BEFORE_DATE.SLOTS, barberShopId)
    return await this.httpClient.get(url)
  }

  async getTopBarbersWithAvailability(dateOfWeek: DateOnly) {
    const url = getUrl(dateOfWeek)
    return await this.httpClient.get(url)
  }
}
