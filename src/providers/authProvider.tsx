import { AuthRepository } from "@/data/repositories/AuthRepository"
// import { UserRepository } from "@/data/repositories/UserRepository"
import { AuthService } from "@/data/services/AuthService"
// import { UserService } from "@/data/services/UserService"
import { UserLoginType, UserRegisterType } from "@/schemas/user"
import { UserMe } from "@/types/models/user"
import { createContext, PropsWithChildren, useContext, useMemo, useReducer } from "react"
import { useProxy } from "./proxyProvider"
import { IAuthRepository } from "@/data/repositories/interfaces/IAuthRepository"
// import { IUserRepository } from "@/data/repositories/interfaces/IUserRepository"
import { useLoaderData } from "react-router-dom"
import { baseLoader } from "@/data/loaders/baseLoader"

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
  register: (data: UserRegisterType) => ReturnType<IAuthRepository['register']>
  login: (data: UserLoginType) => ReturnType<IAuthRepository['login']>
  logout: () => ReturnType<IAuthRepository['logout']>
  // getMe: () => ReturnType<IUserRepository['getMe']>
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
        user: action.payload,
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

// const initialAuthState: AuthState = {
//   user: null,
//   isLoading: true,
//   isAuthenticated: false,
// }

export function AuthProvider({ children }: PropsWithChildren) {
  const userrrr = useLoaderData() as Exclude<Awaited<ReturnType<typeof baseLoader>>, Response>
  const { httpClient } = useProxy()
  const authRepository = useMemo(() => new AuthRepository(new AuthService(httpClient)), [])
  // const userRepository = useMemo(() => new UserRepository(new UserService(httpClient)), [])
  const [state, dispatch] = useReducer(authReducer, {
    user: userrrr,
    isLoading: false,
    isAuthenticated: !!userrrr,
  })
  
  const register = async (data: UserRegisterType) => {
    dispatch({ type: 'SET_LOADING' })

    const result = await authRepository.register(data)

    if (result.isSuccess) {
      dispatch({ type: 'SET_USER', payload: result.value.item })
    } else {
      dispatch({ type: 'LOGIN_FAILURE' })
    }
    
    return result
  }

  const login = async (data: UserLoginType) => {
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
  
  return (
    <AuthContext.Provider
      // value={{
      //   user: state.user,
      //   isLoading: state.isLoading,
      //   isAuthenticated: state.isAuthenticated,
      //   isClient: !!state.user?.roles?.includes('Client'),
      //   isBarberShop: !!state.user?.roles?.includes('BarberShop'),
      //   isAdmin: !!state.user?.roles?.includes('Admin'),
      //   register,
      //   login,
      //   logout,
      // }}
      value={{
        user: userrrr,
        isLoading: state.isLoading,
        isAuthenticated: state.isAuthenticated,
        isClient: !!state.user?.roles?.includes('Client'),
        isBarberShop: !!state.user?.roles?.includes('BarberShop'),
        isAdmin: !!state.user?.roles?.includes('Admin'),
        register,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}