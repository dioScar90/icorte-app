import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";
import type { UserByName } from "@/types/custom-models/user-by-name";
import { BaseFetch } from "./_baseFetch";

const BASE_ENDPOINT = '/barber-schedule'

const ROUTE_PATHS = {
  REMOVE_ALL: 'remove-all',
  POPULATE_ALL: 'populate-all',
  POPULATE_APPOINTMENTS: 'populate-appointments',
  RESET_PASSWORD: 'reset-password',
  SEARCH_USERS: 'search-users',
  LAST_USERS: 'last-users',
} as const

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

  return `?${searchParams}`
}

function getUrl(routeKey: keyof typeof ROUTE_PATHS, params?: Parameters<typeof getQueryParams>[0]) {
  const routePath = ROUTE_PATHS[routeKey]
  return `${BASE_ENDPOINT}/${routePath}` + getQueryParams(params)
}

function getXHeader(passphrase: string) {
  const CUSTOMIZED_HEADER_PASSPHRASE_NAME = 'X-Admin-Passphrase'

  return {
    headers: {
      [CUSTOMIZED_HEADER_PASSPHRASE_NAME]: passphrase
    },
  }
}

export class AdminService extends BaseFetch {
  constructor(httpClient: ConstructorParameters<typeof BaseFetch>[0]) {
    super(httpClient)
  }

  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const url = getUrl('REMOVE_ALL', { evenMasterAdmin })
    return await this._delete(url, getXHeader(passphrase))
  }

  async populateAll({ passphrase }: BaseAdminZod) {
    const url = getUrl('POPULATE_ALL')
    return await this._post(url, null, getXHeader(passphrase))
  }

  async populateWithAppointments({ passphrase, ...rest }: AppointmentsAdminZod) {
    const url = getUrl('POPULATE_APPOINTMENTS', rest)
    return await this._post(url, null, getXHeader(passphrase))
  }

  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const url = getUrl('RESET_PASSWORD')
    return await this._put(url, { email }, getXHeader(passphrase))
  }

  async searchUserByName(q: string) {
    const url = getUrl('SEARCH_USERS', { q })
    return await this._getAll<UserByName>(url)
  }

  async getLastUsers(take?: number) {
    const url = getUrl('LAST_USERS', { take })
    return await this._getAll<UserByName>(url)
  }
}
