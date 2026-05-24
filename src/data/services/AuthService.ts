import type { ProxyContext } from "@/hooks/use-proxy"
import { Result, type BaseResult } from "@/data/result"
import type { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import type { UserMe } from "@/types/models/user"

type UrlType =
  | 'register'
  | 'login'
  | 'logout'

function getUrl(final?: UrlType) {
  const baseEndpoint = `/auth`
  return !final ? baseEndpoint : `${baseEndpoint}/${final}`
}

export class AuthService {
  constructor(private readonly httpClient: ProxyContext) {}
  
  async register(data: UserRegisterZod) {
    const url = getUrl('register')
    
    try {
      const res = await this.httpClient.post<BaseResult<UserMe>['data']>(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async login(data: UserLoginZod) {
    const url = getUrl('login')
    
    try {
      await this.httpClient.post(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async logout() {
    const url = getUrl('logout')
    
    try {
      await this.httpClient.post(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
