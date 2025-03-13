import { AuthRepository } from "@/data/repositories/AuthRepository"
import { AuthService } from "@/data/services/AuthService"
import { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { useEffect, useMemo, useReducer, use } from "react"
import { IAuthRepository } from "@/data/repositories/interfaces/IAuthRepository"
import { useLoaderData } from "react-router-dom"
import { baseLoader } from "@/data/loaders/baseLoader"
import { GenderEnum } from "@/schemas/profile"
import { ProxyContext, useProxy } from "./use-proxy"
import { UserRepository } from "@/data/repositories/UserRepository"
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
  register: (data: UserRegisterZod) => ReturnType<IAuthRepository['register']>
  login: (data: UserLoginZod) => ReturnType<IAuthRepository['login']>
  logout: () => ReturnType<IAuthRepository['logout']>
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
  
  const gender = profile.gender === GenderEnum.Masculino ? 'men' : 'women'
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

async function getMe(httpClient: ProxyContext) {
  const userRepository = new UserRepository(new UserService(httpClient))
  const resp = await userRepository.getMe()

  if (!resp.isSuccess) {
    return null
  }

  return resp.value
}

export function useAuth(httpClient: ProxyContext): AuthContext {
    const userRepository = new UserRepository(new UserService(httpClient))
    const resp = await userRepository.getMe()
  // const repository = new UserRepository(new UserService(httpClient))
  // const userFromLoader = useLoaderData() as Exclude<Awaited<ReturnType<typeof baseLoader>>, Response>
  const authRepository = useMemo(() => new AuthRepository(new AuthService(httpClient)), [])

  const [{ user, isLoading, isAuthenticated }, dispatch] = useReducer(authReducer, {
    user: userFromLoader,
    isLoading: false,
    isAuthenticated: !!userFromLoader,
  })
  
  const register = async (data: UserRegisterZod) => {
    dispatch({ type: 'SET_LOADING' })

    const result = await authRepository.register(data)

    if (result.isSuccess) {
      dispatch({ type: 'SET_USER', payload: result.value.item })
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
    }
    
    return result
  }

  const login = async (data: UserLoginZod) => {
    dispatch({ type: 'SET_LOADING' })

    const result = await authRepository.login(data)

    if (result.isSuccess) {
      dispatch({ type: 'LOGIN_SUCCESS' })
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
    }

    return result
  }

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    return await authRepository.logout()
  }

  useEffect(() => {
    if (userFromLoader) {
      dispatch({ type: 'SET_USER', payload: userFromLoader })
    } else {
      dispatch({ type: 'LOGOUT' })
    }
  }, [userFromLoader])
  
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
