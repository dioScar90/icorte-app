import type { IAuthService as Interface } from "./interfaces/IAuthService"
import type { ProxyContext } from "@/hooks/use-proxy"
import { Result } from "@/data/result"

type UrlType = [
  'register',
  'login',
  'logout',
][number]

function getUrl(final?: UrlType) {
  const baseEndpoint = `/auth`
  return !final ? baseEndpoint : `${baseEndpoint}/${final}`
}

export class AuthService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}

  register: Interface['register'] = async (data) => {
    const url = getUrl('register')
    
    try {
      const res = await this.httpClient.post(url, { ...data })
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  login: Interface['login'] = async (data) => {
    const url = getUrl('login')
    
    try {
      await this.httpClient.post(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  logout: Interface['logout'] = async () => {
    const url = getUrl('logout')
    
    try {
      await this.httpClient.post(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
