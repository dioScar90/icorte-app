import type { DateString } from "@/types/datetime/date-string";
import type { TimeString } from "@/types/datetime/time-string";
import type { TopBarberShop } from "@/types/models/barberShop";
import type { ServiceByName } from "@/types/custom-models/service-by-name";
import { BaseCustomService } from "./_baseCustomService";

const BASE_ENDPOINT = `/barber-schedule`
const PARAM_BARBER_SHOP_ID = ':barberShopId'
const PARAM_DATE = ':date'

const ROUTES_DETAILS = {
  DATES: {
    route: `${BASE_ENDPOINT}/${PARAM_BARBER_SHOP_ID}/dates/${PARAM_DATE}`,
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
  SLOTS: {
    route: `${BASE_ENDPOINT}/${PARAM_BARBER_SHOP_ID}/slots/${PARAM_DATE}`,
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
  TOP_BARBERS: {
    route: `${BASE_ENDPOINT}/top-barbers/${PARAM_DATE}`,
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
  SERVICES: {
    route: `${BASE_ENDPOINT}/services`,
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
} as const satisfies ConstructorParameters<typeof BaseCustomService>[1]

function _getUrl(routeKey: keyof typeof ROUTES_DETAILS, { date, barberShopId }: Partial<{ date: DateString, barberShopId: number }> = {}) {
  const url = ROUTES_DETAILS[routeKey].route
  
  switch (routeKey) {
    case 'DATES':
    case 'SLOTS':
      return url
        .replace(PARAM_BARBER_SHOP_ID, `${barberShopId!}`)
        .replace(PARAM_DATE, date!)
    case 'TOP_BARBERS':
      return url
        .replace(PARAM_DATE, date!)
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

export class BarberScheduleService extends BaseCustomService<typeof ROUTES_DETAILS> {
  constructor(httpClient: ConstructorParameters<typeof BaseCustomService>[0]) {
    super(httpClient, ROUTES_DETAILS)
  }
  
  async getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateString) {
    const routeKey = 'DATES'
    const url = getUrl(routeKey, { date: dateOfWeek, barberShopId })
    
    return await this._fetch<DateString>(routeKey, url)
  }
  
  async getAvailableSlots(barberShopId: number, date: DateString, serviceIds: number[]) {
    const routeKey = 'SLOTS'
    const url = getUrl(routeKey, { date, barberShopId }, { serviceIds })
    
    return await this._fetch<TimeString>(routeKey, url)
  }
  
  async getTopBarbersWithAvailability(dateOfWeek: DateString, _pag?: Awaited<ReturnType<typeof this._fetch>>['data']['pagination']) {
    const routeKey = 'TOP_BARBERS'
    const url = getUrl(routeKey, { date: dateOfWeek })
    
    return await this._fetch<TopBarberShop>(routeKey, url)
  }
  
  async searchServicesByNameAsync(q: string, _pag?: Awaited<ReturnType<typeof this._fetch>>['data']['pagination']) {
    const routeKey = 'SERVICES'
    const url = getUrl(routeKey, undefined, { q })
    
    return await this._fetch<ServiceByName>(routeKey, url)
  }
}
