import type { IRecurringScheduleService as Interface } from "./interfaces/IRecurringScheduleService";
import type { DayOfWeek } from "@/types/datetime/day-of-week";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "../result";

function getUrl(barberShopId: number, dayOfWeek?: DayOfWeek) {
  const baseEndpoint = `/barber-shop/${barberShopId}/recurring-schedule`
  return dayOfWeek === undefined ? baseEndpoint : `${baseEndpoint}/${dayOfWeek}`
}

export class RecurringScheduleService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }

  createRecurringSchedule: Interface['createRecurringSchedule'] = async (barberShopId, data) => {
    const url = getUrl(barberShopId)

    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getRecurringSchedule: Interface['getRecurringSchedule'] = async (barberShopId, dayOfWeek) => {
    const url = getUrl(barberShopId, dayOfWeek)

    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAllRecurringSchedules: Interface['getAllRecurringSchedules'] = async (barberShopId) => {
    const url = getUrl(barberShopId)

    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateRecurringSchedule: Interface['updateRecurringSchedule'] = async (barberShopId, dayOfWeek, data) => {
    const url = getUrl(barberShopId, dayOfWeek)

    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteRecurringSchedule: Interface['deleteRecurringSchedule'] = async (barberShopId, dayOfWeek) => {
    const url = getUrl(barberShopId, dayOfWeek)

    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
