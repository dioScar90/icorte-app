import { AuthService } from "@/data/services/AuthService"
import type { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import type { UserMe } from "@/types/models/user"
import { useEffect, useReducer, useLayoutEffect } from "react"
import { genders } from "@/schemas/profile"
import { UserService } from "@/data/services/UserService"

export type AuthUser = {
  id: UserMe['id']
  email: UserMe['email']
  phoneNumber: UserMe['phoneNumber']
  roles: UserMe['roles']
  profile?: UserMe['profile']
  barberShop?: UserMe['barberShop']
}

export type AuthContext<TUser extends AuthUser | null = AuthUser | null> = {
  user: TUser
  isLoading: boolean
  isAuthenticated: TUser extends AuthUser ? true : false
  isClient: TUser extends AuthUser ? boolean : false
  isBarberShop: TUser extends AuthUser ? boolean : false
  isAdmin: TUser extends AuthUser ? boolean : false
  register: (data: UserRegisterZod) => ReturnType<AuthService['register']>
  login: (data: UserLoginZod) => ReturnType<AuthService['login']>
  logout: () => ReturnType<AuthService['logout']>
}

function isTypeUser(value: unknown): value is AuthUser {
  return typeof value === 'object'
    && value !== null
    && 'id' in value
    && typeof value.id === 'number'
}

function getRandomInt(seed?: number, isBarberShop?: boolean) {
  const MINIMUM = 1
  const LIMIT = !!isBarberShop ? 950 : 99
  seed = !!isBarberShop || !seed ? Math.round(Math.random() * 100) : seed
  return (Math.abs(Math.sin(seed)) * LIMIT + MINIMUM) | 2;
}

export function getBarberShopImageUrl(barberShop: AuthUser['barberShop']) {
  const PLACEHOLDER_BRABERSHOP_IMAGE_URL = '/placeholder-barbershop.jpg'

  if (barberShop?.imageUrl) {
    // return barberShop.imageUrl
    return PLACEHOLDER_BRABERSHOP_IMAGE_URL
  }

  // const imageId = getRandomInt(barberShop?.id!, true)
  // return `https://placebear.com/${imageId}/300.jpg`
  return PLACEHOLDER_BRABERSHOP_IMAGE_URL
}

export function getProfileImageUrl(profile: AuthUser['profile']) {
  if (profile?.imageUrl) {
    return profile.imageUrl
  }

  if (profile?.gender === undefined || profile?.gender === null) {
    return undefined
  }

  const maleIndex = genders.indexOf('Masculino')

  const gender = profile.gender === maleIndex ? 'men' : 'women'
  const imageId = profile.fullName === 'Diogo Scarmagnani' ? 1 : getRandomInt(profile.id)
  return `https://randomuser.me/api/portraits/${gender}/${imageId}.jpg`
}

function getUserWithCorrectImageUrl(payloadUser: NonNullable<AuthContext["user"]>) {
  const user = structuredClone(payloadUser)

  if (user?.profile) {
    user.profile.imageUrl = getProfileImageUrl(user.profile)
  }

  if (user?.barberShop) {
    user.barberShop.imageUrl = getBarberShopImageUrl(user.barberShop)
  }

  return user
}

export type AuthState<TUser extends AuthUser | null = AuthUser | null> = {
  isLoading: boolean
  user: TUser extends AuthUser ? TUser : null
  isAuthenticated: TUser extends AuthUser ? true : false
}

type ActionType = [
  'SET_USER',
  'LOGIN_SUCCESS',
  'LOGIN_FAILURE',
  'LOGOUT',
  'SET_LOADING',
][number]

export type AuthAction<TType = ActionType> =
  TType extends 'SET_USER'
  ? {
    type: TType,
    payload: AuthUser
  } : {
    type: TType,
  }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        // ...state,
        isLoading: false,
        user: getUserWithCorrectImageUrl(action.payload),
        isAuthenticated: true,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isLoading: false,
        isAuthenticated: true,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        isLoading: false,
        user: null,
        isAuthenticated: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
      }
    case 'SET_LOADING':
      return {
        ...state,
        isLoading: true,
      }
    default:
      return state
  }
}

async function getMe() {
  const service = new UserService()
  const resp = await service.getMe()

  return resp.error ? null : resp.data.item
}

export function useAuth(): AuthContext {
  const [{ user, isLoading, isAuthenticated }, dispatch] = useReducer(authReducer, {
    user: null,
    isLoading: false,
    isAuthenticated: false,
  })

  const service = new AuthService()

  async function register(...args: Parameters<typeof service.register>) {
    dispatch({ type: 'SET_LOADING' })

    const result = await service.register(...args)

    if (result.error) {
      dispatch({ type: 'LOGIN_FAILURE' })
    } else {
      dispatch({ type: 'SET_USER', payload: result.data.item })
    }

    return result
  }

  async function login(...args: Parameters<typeof service.login>) {
    dispatch({ type: 'SET_LOADING' })

    const result = await service.login(...args)

    if (result.error) {
      dispatch({ type: 'LOGIN_FAILURE' })
    } else {
      dispatch({ type: 'LOGIN_SUCCESS' })
    }

    return result
  }

  async function logout() {
    dispatch({ type: 'LOGOUT' })
    return await service.logout()
  }

  useLayoutEffect(() => {
    getMe()
      .then(user => {
        if (isTypeUser(user)) {
          dispatch({ type: 'SET_USER', payload: user })
        } else {
          dispatch({ type: 'LOGOUT' })
        }
      })
      .catch(() => dispatch({ type: 'LOGIN_FAILURE' }))
  }, [])

  useEffect(() => {
    if (isTypeUser(user)) {
      dispatch({ type: 'SET_USER', payload: user })
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [user])

  return {
    user,
    isLoading,
    isAuthenticated,
    isClient: !!user?.roles?.includes('Client'),
    isBarberShop: !!user?.roles?.includes('BarberShop'),
    isAdmin: !!user?.roles?.includes('Admin'),
    register,
    login,
    logout,
  }
}
