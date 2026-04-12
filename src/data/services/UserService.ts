import type { IUserService as Interface } from "./interfaces/IUserService"
import type { ProxyContext } from "@/hooks/use-proxy"
import { Result } from "@/data/result"

type UrlType =
  | 'me'
  | 'changeEmail'
  | 'changePassword'
  | 'changePhoneNumber'

function getUrl(final?: UrlType) {
  const baseEndpoint = `/user`
  return !final ? baseEndpoint : `${baseEndpoint}/${final}`
}

export class UserService implements Interface {
  constructor(private readonly httpClient: ProxyContext) { }

  getMe: Interface['getMe'] = async () => {
    const url = getUrl('me')
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  changeEmail: Interface['changeEmail'] = async (data) => {
    const url = getUrl('changeEmail')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  changePassword: Interface['changePassword'] = async (data) => {
    const url = getUrl('changePassword')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  changePhoneNumber: Interface['changePhoneNumber'] = async (data) => {
    const url = getUrl('changePhoneNumber')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  delete: Interface['delete'] = async () => {
    const url = getUrl()
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
