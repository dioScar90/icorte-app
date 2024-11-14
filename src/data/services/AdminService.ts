import { BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { IAdminService } from "./interfaces/IAdminService";
import { AxiosInstance } from "axios";

enum UrlType {
  RemoveAll = 'remove-all',
  PopulateAll = 'populate-all',
  Appointments = 'populate-appointments',
  ResetPassword = 'reset-password',
}

function getUrl(type: UrlType) {
  const baseEndpoint = `/admin`
  return `${baseEndpoint}/${type}`
}

function getEvenMasterAdminQueryParams(evenMasterAdmin?: boolean) {
  if (evenMasterAdmin !== true) {
    return ''
  }
  
  return '?' + (new URLSearchParams({ evenMasterAdmin: 'true' }).toString())
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
    const url = getUrl(UrlType.RemoveAll) + getEvenMasterAdminQueryParams(evenMasterAdmin)
    return await this.httpClient.delete(url, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async populateAll({ passphrase }: BaseAdminZod) {
    const url = getUrl(UrlType.PopulateAll)
    return await this.httpClient.post(url, null, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async populateWithAppointments({ passphrase }: BaseAdminZod) {
    const url = getUrl(UrlType.Appointments)
    return await this.httpClient.post(url, null, getPassphraseAsCustomizedHeader(passphrase))
  }
  
  async resetPasswordForSomeUser({ passphrase, email }: ResetPasswordZod) {
    const url = getUrl(UrlType.ResetPassword)
    return await this.httpClient.post(url, { email }, getPassphraseAsCustomizedHeader(passphrase))
  }
}
