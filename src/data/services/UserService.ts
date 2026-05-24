import type { ProxyContext } from "@/hooks/use-proxy"
import { Result, type BaseResult } from "@/data/result"
import type { UserMe } from "@/types/models/user"
import type { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"

type UrlType =
  | 'me'
  | 'changeEmail'
  | 'changePassword'
  | 'changePhoneNumber'

function getUrl(final?: UrlType) {
  const baseEndpoint = `/user`
  return !final ? baseEndpoint : `${baseEndpoint}/${final}`
}

export class UserService {
  constructor(private readonly httpClient: ProxyContext) { }
  
  async getMe() {
    const url = getUrl('me')
    
    try {
      const res = await this.httpClient.get<BaseResult<UserMe>['data']>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async changeEmail(data: UserEmailUpdateZod) {
    const url = getUrl('changeEmail')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async changePassword(data: UserPasswordUpdateZod) {
    const url = getUrl('changePassword')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async changePhoneNumber(data: UserPhoneNumberUpdateZod) {
    const url = getUrl('changePhoneNumber')
    
    try {
      await this.httpClient.patch(url, { ...data })
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async delete() {
    const url = getUrl()
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
