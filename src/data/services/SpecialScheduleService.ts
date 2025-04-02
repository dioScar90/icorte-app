import type { ISpecialScheduleService as Interface } from "./interfaces/ISpecialScheduleService";
import type { DateString } from "@/utils/types/datetime/date-string";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";

function getUrl(barberShopId: number, date?: DateString) {
  const baseEndpoint = `/barber-shop/${barberShopId}/special-schedule`
  return date === undefined ? baseEndpoint : `${baseEndpoint}/${date}`
}

export class SpecialScheduleService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }

  createSpecialSchedule: Interface['createSpecialSchedule'] = async (barberShopId, data) => {
    const url = getUrl(barberShopId)

    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getSpecialSchedule: Interface['getSpecialSchedule'] = async (barberShopId, date) => {
    const url = getUrl(barberShopId, date)

    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getAllSpecialSchedules: Interface['getAllSpecialSchedules'] = async (barberShopId) => {
    const url = getUrl(barberShopId)

    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateSpecialSchedule: Interface['updateSpecialSchedule'] = async (barberShopId, date, data) => {
    const url = getUrl(barberShopId, date)

    try {
      await this.httpClient.put(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  deleteSpecialSchedule: Interface['deleteSpecialSchedule'] = async (barberShopId, date) => {
    const url = getUrl(barberShopId, date)

    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
