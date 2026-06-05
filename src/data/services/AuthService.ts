import type { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { BaseCustomService } from "./_baseCustomService"

const ROUTES_DETAILS = {
  REGISTER: {
    route: 'register',
    method: 'post',
  },
  LOGIN: {
    route: 'login',
    method: 'post',
  },
  LOGOUT: {
    route: 'logout',
    method: 'post',
  },
} as const satisfies ConstructorParameters<typeof BaseCustomService>[1]

function getUrl(final?: keyof typeof ROUTES_DETAILS) {
  const baseEndpoint = `/auth`
  return !final ? baseEndpoint : `${baseEndpoint}/${final}`
}

export class AuthService extends BaseCustomService<typeof ROUTES_DETAILS> {
  constructor(httpClient: ConstructorParameters<typeof BaseCustomService>[0]) {
    super(httpClient, ROUTES_DETAILS)
  }
  
  async register(data: UserRegisterZod) {
    const routeKey = 'REGISTER'
    const url = getUrl(routeKey)
    
    return await this._fetch(routeKey, url, { ...data })
  }

  async login(data: UserLoginZod) {
    const routeKey = 'LOGIN'
    const url = getUrl(routeKey)
    
    return await this._fetch(routeKey, url, { ...data })
  }

  async logout() {
    const routeKey = 'LOGOUT'
    const url = getUrl(routeKey)
    
    return await this._fetch(routeKey, url)
  }
}
