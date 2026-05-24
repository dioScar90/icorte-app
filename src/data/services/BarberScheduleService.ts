import type { DateString } from "@/types/datetime/date-string";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result, type BaseResult, type Pagination, type PaginationResult } from "@/data/result";
import type { TimeString } from "@/types/datetime/time-string";
import type { TopBarberShop } from "@/types/models/barberShop";
import type { ServiceByName } from "@/types/custom-models/service-by-name";

type StrBeforeDateEnum =
  | 'dates'
  | 'slots'
  | 'services'

type GetUrlProps = {
  date?: DateString
  beforeDate?: StrBeforeDateEnum
  barberShopId?: number
}

function getUrl({ date, beforeDate, barberShopId }: GetUrlProps) {
  const baseEndpoint = `/barber-schedule`

  if (beforeDate === 'services') {
    return `${baseEndpoint}/${beforeDate}`
  }

  if (!beforeDate) {
    return `${baseEndpoint}/top-barbers/${date}`
  }

  return `${baseEndpoint}/${barberShopId!}/${beforeDate}/${date}`
}

type QueryParamsType = Partial<{
  serviceIds: number[]
  q: string
}>

function getQueryParams(params?: QueryParamsType) {
  if (!params) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const key in params) {
    const value = params[key as keyof typeof params]

    if (value === undefined) {
      continue
    }


    if (Array.isArray(value)) {
      value.forEach(item => searchParams.append(key, String(item)))
    } else {
      searchParams.append(key, String(value))
    }
  }

  if (searchParams.size === 0) {
    return ''
  }

  return '?' + searchParams.toString()
}

export class BarberScheduleService {
  constructor(private readonly httpClient: ProxyContext) { }

  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateString) {
    const url = getUrl({ date: dateOfWeek, beforeDate: 'dates', barberShopId })

    try {
      const res = await this.httpClient.get<BaseResult<DateString[]>['data']>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async getAvailableSlots(barberShopId: number, date: DateString, serviceIds: number[]) {
    const url = getUrl({ date, beforeDate: 'slots', barberShopId }) + getQueryParams({ serviceIds })
    
    try {
      const res = await this.httpClient.get<BaseResult<TimeString[]>['data']>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async getTopBarbersWithAvailability(dateOfWeek: DateString, pag?: Pagination) {
    const url = getUrl({ date: dateOfWeek })
    
    try {
      const res = await this.httpClient.get<PaginationResult<TopBarberShop>['data']>(url)
      return Result.Pagination(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async searchServicesByNameAsync(q: string, pag?: Pagination) {
    const url = getUrl({ beforeDate: 'services' }) + getQueryParams({ q })
    
    try {
      const res = await this.httpClient.get<PaginationResult<ServiceByName>['data']>(url)
      return Result.Pagination(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
