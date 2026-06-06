import type { UserMe } from "@/types/models/user"
import type { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"
import { BaseFetch } from "./_baseFetch"

const BASE_ENDPOINT = '/user'

const ROUTE_PATHS = {
  ME: 'me',
  CHANGE_EMAIL: 'changeEmail',
  CHANGE_PASSWORD: 'changePassword',
  CHANGE_PHONE_NUMBER: 'changePhoneNumber',
} as const

function getUrl(routeKey?: keyof typeof ROUTE_PATHS) {
  if (!routeKey) {
    return BASE_ENDPOINT
  }
  
  const routePath = ROUTE_PATHS[routeKey]
  return `${BASE_ENDPOINT}/${routePath}`
}

export class UserService extends BaseFetch {
  constructor(httpClient: ConstructorParameters<typeof BaseFetch>[0]) {
    super(httpClient)
  }
  
  async getMe() {
    const url = getUrl('ME')
    return await this._get<UserMe>(url)
  }
  
  async changeEmail(data: UserEmailUpdateZod) {
    const url = getUrl('CHANGE_EMAIL')
    return await this._patch(url, { ...data })
  }
  
  async changePassword(data: UserPasswordUpdateZod) {
    const url = getUrl('CHANGE_PASSWORD')
    return await this._patch(url, { ...data })
  }
  
  async changePhoneNumber(data: UserPhoneNumberUpdateZod) {
    const url = getUrl('CHANGE_PHONE_NUMBER')
    return await this._patch(url, { ...data })
  }

  async delete() {
    const url = getUrl()
    return await this._delete(url)
  }
}
