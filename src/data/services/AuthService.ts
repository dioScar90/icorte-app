import { UserLoginType, UserRegisterType } from "@/schemas/user"
import { IAuthService } from "./interfaces/IAuthService"
import { AxiosInstance } from "axios"
import { Gender } from "@/schemas/profile"

function getUrl(final?: string) {
  const baseEndpoint = `/auth`
  
  if (!final) {
    return baseEndpoint
  }
  
  return `${baseEndpoint}/${final}`
}

export class AuthService implements IAuthService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async register(data: UserRegisterType) {
    const url = getUrl('register')

    console.log('url', url)
    console.log('data', data)

    data.password = ''
    
    // const gender = data.profile.gender === Gender.Male ? 'Male' : 'Female'
    // const suamae = { ...data, profile: { ...data.profile, gender } }
    // return await this.httpClient.post(url, { ...suamae })
    return await this.httpClient.post(url, { ...data })
  }

  async login(data: UserLoginType) {
    const url = getUrl('login')
    console.log('url', url)
    const res = await this.httpClient.post(url, { ...data })
    console.log('loginAuthService', res)
    return res
  }

  async logout() {
    const url = getUrl('logout')
    return await this.httpClient.post(url)
  }
}
