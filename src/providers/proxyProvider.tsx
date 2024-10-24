import { createContext, PropsWithChildren, useContext } from "react"
import axios, { AxiosInstance } from 'axios'
import { ROUTE_ENUM } from "@/types/route"

console.log('import.meta.env.VITE_BASE_URL', import.meta.env.VITE_BASE_URL)

const httpClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
})

/*
There is no need to set 'config.headers.Authorization = `Bearer ${token}`' because
once we're using cookies and 'withCredentials: true' the token will automatically
be sent.
*/

httpClient.interceptors.response.use(
  response => response,
  (error) => {
    console.log('errorrrrrr', error)
    // if (error.code === 'ERR_NETWORK') {
    //   return Promise.reject('Problemas de conexão. Tente novamente mais tarde.')
    // }
    
    const isAuthError = error.config.url !== ROUTE_ENUM.LOGIN && error.response.status === 401

    if (!isAuthError) {
      return Promise.reject(error)
    }

    // const { state } = getStorage('auth-storage')
    // removeStorage('token', 'auth-storage')

    // const isAdmin = state?.user?.role?.name === 'ADMIN'
    // location.href = isAdmin ? '/dashboard/login' : '/login'
  }
)

export type ProxyContextType = {
  httpClient: AxiosInstance
}

const ProxyContext = createContext<ProxyContextType | undefined>(undefined)

export function useProxy() {
  const proxyContext = useContext(ProxyContext)

  if (!proxyContext) {
    throw new Error('useProxy must be used within an ProxyProvider')
  }

  return proxyContext
}

export function ProxyProvider({ children }: PropsWithChildren) {
  return (
    <ProxyContext.Provider value={{ httpClient }}>
      {children}
    </ProxyContext.Provider>
  )
}

httpClient.get('/')
  .then(res => console.log('root', res))
  .catch(err => console.log('root_err', err))