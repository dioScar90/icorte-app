import { createContext, PropsWithChildren, useContext } from "react"
import axios, { AxiosInstance } from 'axios'
import { InvalidUsernameOrPasswordError, NetworkConnectionError, UnprocessableEntityError } from "@/hooks/use-error"

export const httpClient = axios.create({
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

The URL to be redirected is not coming in 201 Created Responses inside
'response.headers.location' for some reason . Nothing I tried to do worked.
I'm redirecting it by myself then.
*/

httpClient.interceptors.response.use(
  response => {
    console.log('firstResponse', response)
    return response
  },
  (error) => {
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new NetworkConnectionError())
    }

    if (error.config.url === '/auth/login' && error.response.status === 401) {
      return InvalidUsernameOrPasswordError.throwNewPromiseReject()
    }

    if (error.response.status === 422 && error.response.data.title === 'UnprocessableEntity') {
      const title: string = error.response.data.detail
      const errors: Record<string, string[]> = error.response.data.errors
      return UnprocessableEntityError.throwNewPromiseReject(errors, title)
    }

    return Promise.reject(error)
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
