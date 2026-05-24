import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";
import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";
import type { UserByName } from "@/types/custom-models/user-by-name";

const URL_TYPE_METHODS = {
  'remove-all': 'delete',
  'populate-all': 'post',
  'populate-appointments': 'post',
  'reset-password': 'post',
  'search-users': 'get',
  'last-users': 'get',
} as const

function getUrl(urlType: keyof typeof URL_TYPE_METHODS) {
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

export class AdminService {
  constructor(private readonly httpClient: ProxyContext) { }
  
  private async _fetch<
    TReturn = void,
    TUrlType extends keyof typeof URL_TYPE_METHODS = keyof typeof URL_TYPE_METHODS,
    TMethod extends typeof URL_TYPE_METHODS[TUrlType] = typeof URL_TYPE_METHODS[TUrlType],
    TArgs extends Parameters<ProxyContext[TMethod]> = Parameters<ProxyContext[TMethod]>,
  >(urlType: TUrlType, ...[url, ...rest]: TArgs) {
    try {
      const method = URL_TYPE_METHODS[urlType]
      
      if (urlType === 'search-users' || urlType === 'last-users') {
        const res = await this.httpClient[method]<TReturn>(url, ...rest)
        return Result.Success({ item: res.data })
      }
      
      await this.httpClient[method]<TReturn>(url, ...rest)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const urlType = 'remove-all'
    const url = getUrl(urlType) + getQueryParams({ evenMasterAdmin })
    return await this._fetch(urlType, url, getCustomHeader(passphrase))
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const urlType = 'populate-all'
    const url = getUrl(urlType)
    return await this._fetch(urlType, url, null, getCustomHeader(passphrase))
  }
  
  async populateWithAppointments({ passphrase, ...rest }: AppointmentsAdminZod) {
    const urlType = 'populate-appointments'
    const url = getUrl(urlType) + getQueryParams(rest)
    return await this._fetch(urlType, url, null, getCustomHeader(passphrase))
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const urlType = 'reset-password'
    const url = getUrl(urlType)
    return await this._fetch(urlType, url, { email }, getCustomHeader(passphrase))
  }

  async searchUserByName(q: string) {
    const urlType = 'search-users'
    const url = getUrl(urlType) + getQueryParams({ q })
    return await this._fetch<UserByName[]>(urlType, url)
  }
  
  async getLastUsers(take?: number) {
    const urlType = 'last-users'
    const url = getUrl(urlType) + getQueryParams({ take })
    return await this._fetch<UserByName[]>(urlType, url)
  }
}
