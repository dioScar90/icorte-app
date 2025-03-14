import { DateOnly } from "@/utils/types/date";
import { IBarberScheduleService as Interface } from "./interfaces/IBarberScheduleService";
import { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "../result";

type StrBeforeDateEnum = [
  'dates',
  'slots',
  'services',
][number]

type GetUrlProps = {
  date?: DateOnly
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

export class BarberScheduleService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }
  
  getAvailableDatesForBarber: Interface['getAvailableDatesForBarber'] = async (barberShopId, dateOfWeek) => {
    const url = getUrl({ date: dateOfWeek, beforeDate: 'dates', barberShopId })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  getAvailableSlots: Interface['getAvailableSlots'] = async (barberShopId, date, serviceIds) => {
    const url = getUrl({ date, beforeDate: 'slots', barberShopId }) + getQueryParams({ serviceIds })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  getTopBarbersWithAvailability: Interface['getTopBarbersWithAvailability'] = async (dateOfWeek) => {
    const url = getUrl({ date: dateOfWeek })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  searchServicesByNameAsync: Interface['searchServicesByNameAsync'] = async (q) => {
    const url = getUrl({ beforeDate: 'services' }) + getQueryParams({ q })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
