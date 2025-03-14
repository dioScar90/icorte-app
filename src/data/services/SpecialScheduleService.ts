import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { ISpecialScheduleService as Interface } from "./interfaces/ISpecialScheduleService";
import { DateOnly } from "@/utils/types/date";
import { ProxyContext } from "@/hooks/use-proxy";

function getUrl(barberShopId: number, date?: DateOnly) {
  const baseEndpoint = `/barber-shop/${barberShopId}/special-schedule`

  if (date === undefined) {
    return baseEndpoint
  }

  return `${baseEndpoint}/${date}`
}

export class SpecialScheduleService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }

  async createSpecialSchedule(barberShopId: number, data: SpecialScheduleZod) {
    const url = getUrl(barberShopId)
    return await this.httpClient.post(url, { ...data })
  }

  async getSpecialSchedule(barberShopId: number, date: DateOnly) {
    const url = getUrl(barberShopId, date)
    return await this.httpClient.get(url)
  }

  async getAllSpecialSchedules(barberShopId: number) {
    const url = getUrl(barberShopId)
    return await this.httpClient.get(url)
  }

  async updateSpecialSchedule(barberShopId: number, date: DateOnly, data: SpecialScheduleZod) {
    const url = getUrl(barberShopId, date)
    return await this.httpClient.put(url, { ...data })
  }

  async deleteSpecialSchedule(barberShopId: number, date: DateOnly) {
    const url = getUrl(barberShopId, date)
    return await this.httpClient.delete(url)
  }
}
