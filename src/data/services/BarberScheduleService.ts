import { DateOnly } from "@/utils/types/date";
import { IBarberScheduleService } from "./interfaces/IBarberScheduleService";
import { AxiosInstance } from "axios";

enum strBeforeDateEnum {
  DATES = 'dates',
  SLOTS = 'slots',
  SERVICES = 'services',
}

type GetUrlProps = {
  date?: DateOnly
  beforeDate?: strBeforeDateEnum
  barberShopId?: number
}

function getUrl({ date, beforeDate, barberShopId }: GetUrlProps) {
  const baseEndpoint = `/barber-schedule`

  if (beforeDate === strBeforeDateEnum.SERVICES) {
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

export class BarberScheduleService implements IBarberScheduleService {
  constructor(private readonly httpClient: AxiosInstance) { }
  
  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly) {
    const url = getUrl({ date: dateOfWeek, beforeDate: strBeforeDateEnum.DATES, barberShopId })
    return await this.httpClient.get(url)
  }
  
  async getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]) {
    const url = getUrl({ date, beforeDate: strBeforeDateEnum.SLOTS, barberShopId }) + getQueryParams({ serviceIds })
    return await this.httpClient.get(url)
  }
  
  async getTopBarbersWithAvailability(dateOfWeek: DateOnly) {
    const url = getUrl({ date: dateOfWeek })
    return await this.httpClient.get(url)
  }

  async searchServicesByNameAsync(q: string) {
    const url = getUrl({ beforeDate: strBeforeDateEnum.SERVICES }) + getQueryParams({ q })
    return await this.httpClient.get(url)
  }
}
