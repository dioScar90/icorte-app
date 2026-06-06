import type { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { HttpFetch } from "../http-fetch"
import type { UserMe } from "@/types/models/user"

const BASE_ENDPOINT = '/auth'

const ROUTE_PATHS = {
  REGISTER: 'register',
  LOGIN: 'login',
  LOGOUT: 'logout',
} as const

function getUrl(routeKey: keyof typeof ROUTE_PATHS) {
  const routePath = ROUTE_PATHS[routeKey]
  return `${BASE_ENDPOINT}/${routePath}`
}

export class AuthService {
  async register(data: UserRegisterZod) {
    const url = getUrl('REGISTER')
    return await HttpFetch.getInstance().post<UserMe>(url, { ...data })
  }

  async login(data: UserLoginZod) {
    const url = getUrl('LOGIN')
    return await HttpFetch.getInstance().post(url, { ...data })
  }

  async logout() {
    const url = getUrl('LOGOUT')
    return await HttpFetch.getInstance().post(url)
  }
}
