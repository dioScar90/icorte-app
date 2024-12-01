import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { IAdminService } from "./interfaces/IAdminService";
import { AxiosInstance } from "axios";

enum UrlType {
  RemoveAll = 'remove-all',
  PopulateAll = 'populate-all',
  Appointments = 'populate-appointments',
  ResetPassword = 'reset-password',
  SearchByName = 'search-users'
}

function getUrl(type: UrlType) {
  const baseEndpoint = `/admin`
  return `${baseEndpoint}/${type}`
}

type QueryParamsType = Partial<{
  evenMasterAdmin: boolean
  firstDate: string
  limitDate: string
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

function getPassphraseAsCustomizedHeader(passphrase: string) {
  const CUSTOMIZED_HEADER_PASSPHRASE_NAME = 'X-Admin-Passphrase'

  return {
    headers: {
      [CUSTOMIZED_HEADER_PASSPHRASE_NAME]: passphrase
    },
  }
}

export class AdminService implements IAdminService {
  constructor(private readonly httpClient: AxiosInstance) { }
  
  async removeAll({ passphrase, evenMasterAdmin }: BaseAdminZod) {
    const url = getUrl(UrlType.RemoveAll) + getQueryParams({ evenMasterAdmin })
    return await this.httpClient.delete(url, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const url = getUrl(UrlType.PopulateAll)
    return await this.httpClient.post(url, null, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async populateWithAppointments({ passphrase, firstDate, limitDate }: AppointmentsAdminZod) {
    const url = getUrl(UrlType.Appointments) + getQueryParams({ firstDate, limitDate })
    return await this.httpClient.post(url, null, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const url = getUrl(UrlType.ResetPassword)
    return await this.httpClient.post(url, { email }, getPassphraseAsCustomizedHeader(passphrase))
  }

  async searchUserByName(q: string) {
    const url = getUrl(UrlType.SearchByName) + getQueryParams({ q })
    return await this.httpClient.get(url)
  }
}
