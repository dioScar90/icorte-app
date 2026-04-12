// import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";
import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";
import type { UserByName } from "@/types/custom-models/user-by-name";

type UrlType =
  | 'remove-all'
  | 'populate-all'
  | 'populate-appointments'
  | 'reset-password'
  | 'search-users'
  | 'last-users'

function getUrl(type: UrlType) {
  const baseEndpoint = `/admin`
  return `${baseEndpoint}/${type}`
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

function getPassphraseAsCustomizedHeader(passphrase: string) {
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
    TMethod extends keyof ProxyContext = keyof ProxyContext,
    TArgs extends Parameters<ProxyContext[TMethod]> = Parameters<ProxyContext[TMethod]>,
  >(method: TMethod, ...[url, ...rest]: TArgs) {
    try {
      if (method === 'get') {
        return Result.Success(await this.httpClient[method]<TReturn>(url, ...rest))
      }
      
      await this.httpClient[method]<TReturn>(url, ...rest)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const url = getUrl('remove-all') + getQueryParams({ evenMasterAdmin })
    const options = getPassphraseAsCustomizedHeader(passphrase)
    return await this._fetch('delete', url, options)
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const url = getUrl('populate-all')
    const options = getPassphraseAsCustomizedHeader(passphrase)
    return await this._fetch('post', url, null, options)
  }
  
  async populateWithAppointments({ passphrase, ...rest }: AppointmentsAdminZod) {
    const url = getUrl('populate-appointments') + getQueryParams(rest)
    const options = getPassphraseAsCustomizedHeader(passphrase)
    return await this._fetch('post', url, null, options)
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const url = getUrl('reset-password')
    const options = getPassphraseAsCustomizedHeader(passphrase)
    return await this._fetch('post', url, { email }, options)
  }

  async searchUserByName(q: string) {
    const url = getUrl('search-users') + getQueryParams({ q })
    return await this._fetch<UserByName[]>('get', url)
  }
  
  async getLastUsers(take?: number) {
    const url = getUrl('last-users') + getQueryParams({ take })
    return await this._fetch<UserByName[]>('get', url)
  }
}
