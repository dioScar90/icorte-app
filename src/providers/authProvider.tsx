import { AuthRepository } from "@/data/repositories/AuthRepository"
import { UserRepository } from "@/data/repositories/UserRepository"
import { AuthService } from "@/data/services/AuthService"
import { UserService } from "@/data/services/UserService"
import { UserLoginType, UserRegisterType } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react"
import { useProxy } from "./proxyProvider"
import { Result } from "@/data/result"

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
  register: (data: UserRegisterType) => Promise<Result<any>>
  login: (data: UserLoginType) => Promise<Result<any>>
  getMe: () => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function useAuth() {
  const authContext = useContext(AuthContext)

  if (!authContext) {
    throw new Error('useAuth must be used within an AuthProvider')
  }

  return authContext
}

export type AuthState = {
  isLoading: boolean
  isAuthenticated: false
  user: null
} | {
  isLoading: boolean
  isAuthenticated: true
  user: AuthUser
}

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        user: action.payload,
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

const initialAuthState: AuthState = {
  user: null,
  isLoading: true,
  isAuthenticated: false,
}

export function AuthProvider({ children }: PropsWithChildren) {
  const { httpClient } = useProxy()
  const authRepository = useMemo(() => new AuthRepository(new AuthService(httpClient)), [])
  const userRepository = useMemo(() => new UserRepository(new UserService(httpClient)), [])
  const [state, dispatch] = useReducer(authReducer, initialAuthState)

  const register = async (data: UserRegisterType) => {
    dispatch({ type: 'SET_LOADING' })

    const authResult = await authRepository.register(data)

    console.error('authResult', authResult)

    if (!authResult.isSuccess) {
      console.error('Failed to fetch user data:', authResult.error)
      dispatch({ type: 'LOGIN_FAILURE' })
      return authResult
    }

    const userData: UserMe = authResult.value

    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      roles: userData.roles,
      profile: userData.profile,
      barberShop: userData.barberShop,
    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    return authResult
  }

  const login = async (data: UserLoginType) => {
    dispatch({ type: 'SET_LOADING' })

    const authResult = await authRepository.login(data)

    console.error('authResult', authResult)

    if (!authResult.isSuccess) {
      console.error('Failed to fetch user data:', authResult.error)
      dispatch({ type: 'LOGIN_FAILURE' })
      return authResult
    }
    
    const userData: UserMe = authResult.value

    const user: AuthUser = {
      id: userData.id,
      email: userData.email,
      phoneNumber: userData.phoneNumber,
      roles: userData.roles,
      profile: userData.profile,
      barberShop: userData.barberShop,
    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
    return authResult
  }

  const logout = async () => {
    await authRepository.logout()
    dispatch({ type: 'LOGOUT' })
  }

  const getMe = async () => {
    try {
      const res = await userRepository.getMe()

      if (!res.isSuccess) {
        dispatch({ type: 'LOGIN_FAILURE' })
      }

      dispatch({ type: 'LOGIN_SUCCESS', payload: res.value })
    } catch (err) {
      dispatch({ type: 'LOGIN_FAILURE' })
      console.error(err)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user: state.user,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        isClient: !!state.user?.roles?.includes('Client'),
        isBarberShop: !!state.user?.roles?.includes('BarberShop'),
        isAdmin: !!state.user?.roles?.includes('Admin'),
        register,
        login,
        getMe,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}