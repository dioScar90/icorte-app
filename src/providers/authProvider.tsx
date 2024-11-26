import { AuthRepository } from "@/data/repositories/AuthRepository"
import { AuthService } from "@/data/services/AuthService"
import { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from "react"
import { useProxy } from "./proxyProvider"
import { IAuthRepository } from "@/data/repositories/interfaces/IAuthRepository"
import { useLoaderData } from "react-router-dom"
import { baseLoader } from "@/data/loaders/baseLoader"
import { GenderEnum } from "@/schemas/profile"

export type AuthUser = {
  id: UserMe['id']
  email: UserMe['email']
  phoneNumber: UserMe['phoneNumber']
  roles: UserMe['roles']
  profile?: UserMe['profile']
  barberShop?: UserMe['barberShop']
}

export type AuthContextType = {
  user: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isClient: boolean
  isBarberShop: boolean
  isAdmin: boolean
  register: (data: UserRegisterZod) => ReturnType<IAuthRepository['register']>
  login: (data: UserLoginZod) => ReturnType<IAuthRepository['login']>
  logout: () => ReturnType<IAuthRepository['logout']>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return authContext
}

function getRandomInt(seed?: number, isBarberShop?: boolean) {
  const MINIMUM = 1
  const LIMIT = !!isBarberShop ? 950 : 99
  seed = !!isBarberShop || !seed ? Math.round(Math.random() * 100) : seed
  return (Math.abs(Math.sin(seed)) * LIMIT + MINIMUM) | 2;
}

export function getBarberShopImageUrl(barberShop: AuthUser['barberShop']) {
  const PLACEHOLDER_BRABERSHOP_IMAGE_URL = 'https://thebarbersonline.com/wp-content/uploads/2019/03/IMG_0216-1.jpg'

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

function getUserWithCorrectImageUrl(payloadUser: AuthContextType["user"]) {
  const user = structuredClone(payloadUser)
  
  if (user?.profile) {
    user.profile.imageUrl = getProfileImageUrl(user.profile)
  }
  
  if (user?.barberShop) {
    user.barberShop.imageUrl = getBarberShopImageUrl(user.barberShop)
  }

  return user
}

export type AuthState = {
  isLoading: boolean
  isAuthenticated: boolean
  user: AuthUser | null
}

export type AuthAction =
  | { type: 'SET_USER'; payload: AuthUser }
  | { type: 'LOGIN_SUCCESS' }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'SET_USER':
      return {
        ...state,
        user: getUserWithCorrectImageUrl(action.payload),
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        user: null,
        isAuthenticated: false,
        isLoading: false,
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

export function AuthProvider({ children }: PropsWithChildren) {
  const userFromLoader = useLoaderData() as Exclude<Awaited<ReturnType<typeof baseLoader>>, Response>
  const { httpClient } = useProxy()
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
  
  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated,
        isClient: !!user?.roles?.includes('Client'),
        isBarberShop: !!user?.roles?.includes('BarberShop'),
        isAdmin: !!user?.roles?.includes('Admin'),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}