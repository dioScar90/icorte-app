import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";
import type { UserByName } from "@/types/custom-models/user-by-name";
import { BaseCustomService } from "./_baseCustomService";

const ROUTE_DETAILS = {
  REMOVE_ALL: {
    key: 'REMOVE_ALL',
    route: 'remove-all',
    method: 'delete',
    mustReturn: false,
    isPagination: false,
  },
  POPULATE_ALL: {
    key: 'POPULATE_ALL',
    route: 'populate-all',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  POPULATE_APPOINTMENTS: {
    key: 'POPULATE_APPOINTMENTS',
    route: 'populate-appointments',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  RESET_PASSWORD: {
    key: 'RESET_PASSWORD',
    route: 'reset-password',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  SEARCH_USERS: {
    key: 'SEARCH_USERS',
    route: 'search-users',
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
  LAST_USERS: {
    key: 'LAST_USERS',
    route: 'last-users',
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
} as const

function getUrl(routeKey: keyof typeof ROUTE_DETAILS) {
  const urlType = ROUTE_DETAILS[routeKey].route
  const baseEndpoint = `/admin`

  return `${baseEndpoint}/${urlType}`
}

type QueryParamsType = Partial<{
  evenMasterAdmin: boolean
  firstDate: string
  limitDate: string
  q: string
  take: number
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

function getCustomHeader(passphrase: string) {
  const CUSTOMIZED_HEADER_PASSPHRASE_NAME = 'X-Admin-Passphrase'
  
  return {
    headers: {
      [CUSTOMIZED_HEADER_PASSPHRASE_NAME]: passphrase
    },
  }
}

export class AdminService extends BaseCustomService {
  constructor(httpClient: ConstructorParameters<typeof BaseCustomService>[0]) {
    super(httpClient, ROUTE_DETAILS)
  }
  
  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const url = getUrl(ROUTE_DETAILS.REMOVE_ALL.key) + getQueryParams({ evenMasterAdmin })
    return await this._fetch(ROUTE_DETAILS.REMOVE_ALL.key, url, getCustomHeader(passphrase))
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const url = getUrl(ROUTE_DETAILS.POPULATE_ALL.key)
    return await this._fetch(ROUTE_DETAILS.POPULATE_ALL.key, url, null, getCustomHeader(passphrase))
  }
  
  async populateWithAppointments({ passphrase, ...rest }: AppointmentsAdminZod) {
    const url = getUrl(ROUTE_DETAILS.POPULATE_APPOINTMENTS.key) + getQueryParams(rest)
    return await this._fetch(ROUTE_DETAILS.POPULATE_APPOINTMENTS.key, url, null, getCustomHeader(passphrase))
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const url = getUrl(ROUTE_DETAILS.RESET_PASSWORD.key)
    return await this._fetch(ROUTE_DETAILS.RESET_PASSWORD.key, url, { email }, getCustomHeader(passphrase))
  }
  
  async searchUserByName(q: string) {
    const url = getUrl(ROUTE_DETAILS.SEARCH_USERS.key) + getQueryParams({ q })
    return await this._fetch<UserByName>(ROUTE_DETAILS.SEARCH_USERS.key, url)
  }
  
  async getLastUsers(take?: number) {
    const url = getUrl(ROUTE_DETAILS.LAST_USERS.key) + getQueryParams({ take })
    return await this._fetch<UserByName>(ROUTE_DETAILS.LAST_USERS.key, url)
  }
}
