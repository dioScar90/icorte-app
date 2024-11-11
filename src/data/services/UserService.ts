import { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { IUserService } from "./interfaces/IUserService"
import { AxiosInstance } from "axios"

enum UrlType {
  GET_ME = 'me',
  CHANGE_EMAIL = 'changeEmail',
  CHANGE_PASSWORD = 'changePassword',
  CHANGE_PHONE_NUMBER = 'changePhoneNumber',
}

function getUrl(final?: UrlType) {
  const baseEndpoint = `/user`

  if (!final) {
    return `${baseEndpoint}`
  }

  return `${baseEndpoint}/${final}`
}

export class UserService implements IUserService {
  constructor(private readonly httpClient: AxiosInstance) { }

  async getMe() {
    const url = getUrl(UrlType.GET_ME)
    return await this.httpClient.get<UserMe>(url)
  }

  async changeEmail(data: UserEmailUpdateZod) {
    const url = getUrl(UrlType.CHANGE_EMAIL)
    return await this.httpClient.patch(url, { ...data })
  }

  async changePassword(data: UserPasswordUpdateZod) {
    const url = getUrl(UrlType.CHANGE_PASSWORD)
    return await this.httpClient.patch(url, { ...data })
  }

  async changePhoneNumber(data: UserPhoneNumberUpdateZod) {
    const url = getUrl(UrlType.CHANGE_PHONE_NUMBER)
    return await this.httpClient.patch(url, { ...data })
  }

  async delete() {
    const url = getUrl()
    return await this.httpClient.delete(url)
  }
}
