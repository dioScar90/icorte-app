import type { UserMe } from "@/types/models/user"
import type { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"
import { HttpFetch } from "../http-fetch"

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

export class UserService {
  async getMe() {
    const url = getUrl('ME')
    return await HttpFetch.getInstance().get<UserMe>(url)
  }

  async changeEmail(data: UserEmailUpdateZod) {
    const url = getUrl('CHANGE_EMAIL')
    return await HttpFetch.getInstance().patch(url, { ...data })
  }

  async changePassword(data: UserPasswordUpdateZod) {
    const url = getUrl('CHANGE_PASSWORD')
    return await HttpFetch.getInstance().patch(url, { ...data })
  }

  async changePhoneNumber(data: UserPhoneNumberUpdateZod) {
    const url = getUrl('CHANGE_PHONE_NUMBER')
    return await HttpFetch.getInstance().patch(url, { ...data })
  }

  async delete() {
    const url = getUrl()
    return await HttpFetch.getInstance().delete(url)
  }
}
