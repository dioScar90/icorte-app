// import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import type { IAdminService as Interface } from "./interfaces/IAdminService";
import type { ProxyContext } from "@/hooks/use-proxy";
import { Result } from "@/data/result";

type UrlType = [
  'remove-all',
  'populate-all',
  'populate-appointments',
  'reset-password',
  'search-users',
  'last-users',
][number]

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

export class AdminService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }
  
  removeAll: Interface['removeAll'] = async ({ passphrase, evenMasterAdmin }) => {
    const url = getUrl('remove-all') + getQueryParams({ evenMasterAdmin })

    try {
      await this.httpClient.delete(url, getPassphraseAsCustomizedHeader(passphrase))
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  populateAll: Interface['populateAll'] = async ({ passphrase }) => {
    const url = getUrl('populate-all')
    
    try {
      await this.httpClient.post<void>(url, null, getPassphraseAsCustomizedHeader(passphrase))
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  populateWithAppointments: Interface['populateWithAppointments'] = async ({ passphrase, ...rest }) => {
    const url = getUrl('populate-appointments') + getQueryParams(rest)
    
    try {
      await this.httpClient.post(url, null, getPassphraseAsCustomizedHeader(passphrase))
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  resetPasswordForSomeUser: Interface['resetPasswordForSomeUser'] = async ({ passphrase, email }) => {
    const url = getUrl('reset-password')
    
    try {
      await this.httpClient.post(url, { email }, getPassphraseAsCustomizedHeader(passphrase))
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  searchUserByName: Interface['searchUserByName'] = async (q) => {
    const url = getUrl('search-users') + getQueryParams({ q })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getLastUsers: Interface['getLastUsers'] = async (take) => {
    const url = getUrl('last-users') + getQueryParams({ take })
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
