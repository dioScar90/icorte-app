import { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { IAuthService } from "./interfaces/IAuthService"
import { AxiosInstance } from "axios"

enum UrlType {
  REGISTER = 'register',
  LOGIN = 'login',
  LOGOUT = 'logout',
}

function getUrl(final?: UrlType) {
  const baseEndpoint = `/auth`
  
  if (!final) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${final}`
}

export class AuthService implements IAuthService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async register(data: UserRegisterZod) {
    const url = getUrl(UrlType.REGISTER)
    return await this.httpClient.post(url, { ...data })
  }

  async login(data: UserLoginZod) {
    const url = getUrl(UrlType.LOGIN)
    return await this.httpClient.post(url, { ...data })
  }

  async logout() {
    const url = getUrl(UrlType.LOGOUT)
    return await this.httpClient.post(url)
  }
}
