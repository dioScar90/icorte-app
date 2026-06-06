import type { DateString } from "@/types/datetime/date-string";
import type { TimeString } from "@/types/datetime/time-string";
import type { TopBarberShop } from "@/types/models/barberShop";
import type { ServiceByName } from "@/types/custom-models/service-by-name";
import { BaseFetch } from "./_baseFetch";

const BASE_ENDPOINT = '/barber-schedule'

const PARAMS = {
  BARBER_SHOP_ID: ':barberShopId',
  DATE: ':date',
} as const

const ROUTE_PATHS = {
  DATES: `${BASE_ENDPOINT}/${PARAMS.BARBER_SHOP_ID}/dates/${PARAMS.DATE}`,
  SLOTS: `${BASE_ENDPOINT}/${PARAMS.BARBER_SHOP_ID}/slots/${PARAMS.DATE}`,
  TOP_BARBERS: `${BASE_ENDPOINT}/top-barbers/${PARAMS.DATE}`,
  SERVICES: `${BASE_ENDPOINT}/services`,
} as const

function _getUrl(routeKey: keyof typeof ROUTE_PATHS, { date, barberShopId }: Partial<{ date: DateString, barberShopId: number }> = {}) {
  const url = ROUTE_PATHS[routeKey]

  switch (routeKey) {
    case 'DATES':
    case 'SLOTS':
      return url
        .replace(PARAMS.BARBER_SHOP_ID, `${barberShopId!}`)
        .replace(PARAMS.DATE, date!)
    case 'TOP_BARBERS':
      return url
        .replace(PARAMS.DATE, date!)
    case 'SERVICES':
      return url
  }
}

function getQueryParams(queryParams?: Partial<{ serviceIds: number[], q: string }>) {
  if (!queryParams) {
    return ''
  }

  const searchParams = new URLSearchParams()

  for (const key in queryParams) {
    const value = queryParams[key as keyof typeof queryParams]

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

function getUrl(...[paramKey, params, queryParams]: [...Parameters<typeof _getUrl>, ...Parameters<typeof getQueryParams>]) {
  return _getUrl(paramKey, params) + getQueryParams(queryParams)
}

export class BarberScheduleService extends BaseFetch {
  constructor(httpClient: ConstructorParameters<typeof BaseFetch>[0]) {
    super(httpClient)
  }

  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateString) {
    const url = getUrl('DATES', { date: dateOfWeek, barberShopId })
    return await this._getAll<DateString>(url)
  }

  async getAvailableSlots(barberShopId: number, date: DateString, serviceIds: number[]) {
    const url = getUrl('SLOTS', { date, barberShopId }, { serviceIds })
    return await this._getAll<TimeString>(url)
  }

  async getTopBarbersWithAvailability(dateOfWeek: DateString) {
    const url = getUrl('TOP_BARBERS', { date: dateOfWeek })
    return await this._getAll<TopBarberShop>(url)
  }

  async searchServicesByNameAsync(q: string) {
    const url = getUrl('SERVICES', undefined, { q })
    return await this._getAll<ServiceByName>(url)
  }
}
