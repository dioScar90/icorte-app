import type { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { BaseFetch } from "./_baseFetch"

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

export class AuthService extends BaseFetch {
  constructor(httpClient: ConstructorParameters<typeof BaseFetch>[0]) {
    super(httpClient)
  }

  async register(data: UserRegisterZod) {
    const url = getUrl('REGISTER')
    return await this._post(url, { ...data })
  }

  async login(data: UserLoginZod) {
    const url = getUrl('LOGIN')
    return await this._post(url, { ...data })
  }

  async logout() {
    const url = getUrl('LOGOUT')
    return await this._post(url)
  }
}
