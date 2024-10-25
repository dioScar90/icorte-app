import { AuthRepository } from "@/data/repositories/AuthRepository"
import { UserRepository } from "@/data/repositories/UserRepository"
import { AuthService } from "@/data/services/AuthService"
import { UserService } from "@/data/services/UserService"
import { UserLoginType, UserRegisterType } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext, useEffect, useMemo, useReducer } from "react"
import { useProxy } from "./proxyProvider"

export type AuthUser = {
  user: Omit<UserMe, 'roles' | 'profile' | 'barberShop'>
  roles: UserMe['roles']
  profile?: UserMe['profile']
  barberShop?: UserMe['barberShop']
}

export type AuthContextType = {
  authUser: AuthUser | null
  isLoading: boolean
  isAuthenticated: boolean
  isClient: boolean
  isBarberShop: boolean
  isAdmin: boolean
  register: (data: UserRegisterType) => Promise<void>
  login: (data: UserLoginType) => Promise<void>
  logout: () => void
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
  authUser: null
} | {
  isLoading: boolean
  isAuthenticated: true
  authUser: AuthUser
}

export type AuthAction =
  | { type: 'LOGIN_SUCCESS'; payload: AuthUser }
  | { type: 'LOGIN_FAILURE' }
  | { type: 'LOGOUT' }
  | { type: 'SET_LOADING' }

function authReducer(state: AuthState, action: AuthAction): AuthState {
  console.log('type', action.type)
  switch (action.type) {
    case 'LOGIN_SUCCESS':
      return {
        ...state,
        authUser: action.payload,
        isAuthenticated: true,
        isLoading: false,
      }
    case 'LOGIN_FAILURE':
      return {
        ...state,
        authUser: null,
        isAuthenticated: false,
        isLoading: false,
      }
    case 'LOGOUT':
      return {
        ...state,
        authUser: null,
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
  authUser: null,
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
      return
    }

    const userData: UserMe = authResult.value

    const user: AuthUser = {
      user: {
        id: userData.id,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      },
      roles: userData.roles,
      profile: userData.profile,
      barberShop: userData.barberShop,
    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
  }

  const login = async (data: UserLoginType) => {
    dispatch({ type: 'SET_LOADING' })

    const authResult = await authRepository.login(data)

    console.error('authResult', authResult)

    if (!authResult.isSuccess) {
      console.error('Failed to fetch user data:', authResult.error)
      dispatch({ type: 'LOGIN_FAILURE' })
      return
    }

    // const getMeResult = await userRepository.getMe()

    // console.error('getMeResult', getMeResult)

    // if (!getMeResult.isSuccess) {
    //   console.error('Failed to fetch user data:', getMeResult.error)
    //   dispatch({ type: 'LOGIN_FAILURE' })
    //   return
    // }

    const userData: UserMe = authResult.value

    const user: AuthUser = {
      user: {
        id: userData.id,
        email: userData.email,
        phoneNumber: userData.phoneNumber,
      },
      roles: userData.roles,
      profile: userData.profile,
      barberShop: userData.barberShop,
    }

    dispatch({ type: 'LOGIN_SUCCESS', payload: user })
  }

  const logout = () => {
    authRepository.logout()
    dispatch({ type: 'LOGOUT' })
  }

  useEffect(() => {
    dispatch({ type: 'SET_LOADING' })

    userRepository.getMe()
      .then(res => {
        console.log('getMe', res)
        if (!res.isSuccess) {
          dispatch({ type: 'LOGIN_FAILURE' })
        }

        dispatch({ type: 'LOGIN_SUCCESS', payload: res.value })
      })
      .catch(err => {
        dispatch({ type: 'LOGIN_FAILURE' })
        console.error(err)
      })
  }, [])
  
  return (
    <AuthContext.Provider
      value={{
        authUser: state.authUser,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        isClient: !!state.authUser?.roles?.includes('Client'),
        isBarberShop: !!state.authUser?.roles?.includes('BarberShop'),
        isAdmin: !!state.authUser?.roles?.includes('Admin'),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}