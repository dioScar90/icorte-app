import { IAdminService } from "./interfaces/IAdminService";
import { AxiosInstance } from "axios";

enum UrlType {
  RemoveAll = 'remove-all'
}

function getUrl(type: UrlType) {
  const baseEndpoint = `/admin`
  return `${baseEndpoint}/${type}`
}

export class AdminService implements IAdminService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async removeAllRows(data: { passphrase: string }) {
    const url = getUrl(UrlType.RemoveAll)
    return await this.httpClient.post(url, data)
  }
}
