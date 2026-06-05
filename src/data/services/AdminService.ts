import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";
import type { UserByName } from "@/types/custom-models/user-by-name";
import { BaseCustomService } from "./_baseCustomService";

const ROUTES_DETAILS = {
  REMOVE_ALL: {
    route: 'remove-all',
    method: 'delete',
    mustReturn: false,
    isPagination: false,
  },
  POPULATE_ALL: {
    route: 'populate-all',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  POPULATE_APPOINTMENTS: {
    route: 'populate-appointments',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  RESET_PASSWORD: {
    route: 'reset-password',
    method: 'post',
    mustReturn: false,
    isPagination: false,
  },
  SEARCH_USERS: {
    route: 'search-users',
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
  LAST_USERS: {
    route: 'last-users',
    method: 'get',
    mustReturn: true,
    isPagination: true,
  },
} as const satisfies ConstructorParameters<typeof BaseCustomService>[1]

function getQueryParams(params?: Partial<{ evenMasterAdmin: boolean, firstDate: string, limitDate: string, q: string, take: number }>) {
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

function getUrl(routeKey: keyof typeof ROUTES_DETAILS, params?: Parameters<typeof getQueryParams>[0]) {
  const urlType = ROUTES_DETAILS[routeKey].route
  const baseEndpoint = `/admin`
  
  return `${baseEndpoint}/${urlType}` + getQueryParams(params)
}

function getXHeader(passphrase: string) {
  const CUSTOMIZED_HEADER_PASSPHRASE_NAME = 'X-Admin-Passphrase'
  
  return {
    headers: {
      [CUSTOMIZED_HEADER_PASSPHRASE_NAME]: passphrase
    },
  }
}

export class AdminService extends BaseCustomService<typeof ROUTES_DETAILS> {
  constructor(httpClient: ConstructorParameters<typeof BaseCustomService>[0]) {
    super(httpClient, ROUTES_DETAILS)
  }
  
  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const routeKey = 'REMOVE_ALL' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey, { evenMasterAdmin })
    
    return await this._fetch(routeKey, url, null, getXHeader(passphrase))
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const routeKey = 'POPULATE_ALL' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey)

    return await this._fetch(routeKey, url, null, getXHeader(passphrase))
  }
  
  async populateWithAppointments({ passphrase, ...rest }: AppointmentsAdminZod) {
    const routeKey = 'POPULATE_APPOINTMENTS' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey, rest)
    
    return await this._fetch(routeKey, url, null, getXHeader(passphrase))
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const routeKey = 'RESET_PASSWORD' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey)

    return await this._fetch(routeKey, url, { email }, getXHeader(passphrase))
  }
  
  async searchUserByName(q: string) {
    const routeKey = 'SEARCH_USERS' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey, { q })

    return await this._fetch<UserByName>(routeKey, url)
  }
  
  async getLastUsers(take?: number) {
    const routeKey = 'LAST_USERS' satisfies Parameters<typeof this._fetch>[0]
    const url = getUrl(routeKey, { take })

    return await this._fetch<UserByName>(routeKey, url)
  }
}
