
// const BASE_ROUTE = '/icorte-app' as const
const BASE_ROUTE = '' as const

export const ROUTE_ENUM = {
  ROOT: `${BASE_ROUTE}/`,
  HOME: `${BASE_ROUTE}/home`,
  REGISTER: `${BASE_ROUTE}/register`,
  LOGIN: `${BASE_ROUTE}/login`,
  LOGOUT: `${BASE_ROUTE}/logout`,
  FORGOT_PASSWORD: `${BASE_ROUTE}/forgot-password`,
  CLIENT: `${BASE_ROUTE}/client`,
  PROFILE: `${BASE_ROUTE}/profile`,
  BARBER_SHOP: `${BASE_ROUTE}/barber-shop`,
  BARBER_SCHEDULE: `${BASE_ROUTE}/barber-schedule`,
  BE_PRO: `${BASE_ROUTE}/pro`,
  CHAT: `${BASE_ROUTE}/chat`,
  CONTACT_US: `${BASE_ROUTE}/contact`,
  WORK_WITH_US: `${BASE_ROUTE}/work-with-us`,
  ADMIN: `${BASE_ROUTE}/admin`,
} as const

type StringUnion<TEnum extends string> = TEnum | `${Exclude<TEnum, '/'>}/${string}`
export type RouteString = StringUnion<typeof ROUTE_ENUM[keyof typeof ROUTE_ENUM]>

export class RedirectorError extends Error {
  constructor(readonly url: RouteString) {
    super()
  }
}
