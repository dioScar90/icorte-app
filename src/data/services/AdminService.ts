import { RemoveAllZod } from "@/components/layouts/admin-layout";
import { IAdminService } from "./interfaces/IAdminService";
import { AxiosInstance } from "axios";

enum UrlType {
  RemoveAll = 'remove-all'
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

export class AdminService implements IAdminService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async removeAll({ passphrase, evenMasterAdmin }: RemoveAllZod) {
    const url = getUrl(UrlType.RemoveAll) + getEvenMasterAdminQueryParams(evenMasterAdmin)
    return await this.httpClient.post(url, { passphrase })
  }
}
