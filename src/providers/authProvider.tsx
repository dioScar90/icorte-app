import { AuthService } from "@/data/services/AuthService"
import { UserLoginZod, UserRegisterZod } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from "react"
import { useProxy } from "./proxyProvider"
import { IAuthService } from "@/data/services/interfaces/IAuthService"
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

export type AuthContextType<TUser extends AuthUser | null = AuthUser | null> = {
  user: TUser
  isLoading: boolean
  isAuthenticated: TUser extends AuthUser ? true : false
  isClient: TUser extends AuthUser ? boolean : false
  isBarberShop: TUser extends AuthUser ? boolean : false
  isAdmin: TUser extends AuthUser ? boolean : false
  register: (data: UserRegisterZod) => ReturnType<IAuthService['register']>
  login: (data: UserLoginZod) => ReturnType<IAuthService['login']>
  logout: () => ReturnType<IAuthService['logout']>
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

export type AuthState<TUser = AuthUser | null> = {
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

type AuthProviderProps = PropsWithChildren<{
  httpClient: ReturnType<typeof useProxy>['httpClient'],
  user: AuthContextType['user']
}>

export function AuthProvider({ children, httpClient, user: userFromLoader }: AuthProviderProps) {
  const authService = useMemo(() => new AuthService(httpClient), [])

  const [{ user, isLoading, isAuthenticated }, dispatch] = useReducer(authReducer, {
    user: userFromLoader,
    isLoading: false,
    isAuthenticated: !!userFromLoader,
  })
  
  const register = async (data: UserRegisterZod) => {
    dispatch({ type: 'SET_LOADING' })

    const result = await authService.register(data)

    if (result.isSuccess) {
      dispatch({ type: 'SET_USER', payload: result.value.item })
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
    }
    
    return result
  }

  const login = async (data: UserLoginZod) => {
    dispatch({ type: 'SET_LOADING' })

    const result = await authService.login(data)

    if (result.isSuccess) {
      dispatch({ type: 'LOGIN_SUCCESS' })
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
    }

    return result
  }

  const logout = async () => {
    dispatch({ type: 'LOGOUT' })
    return await authService.logout()
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