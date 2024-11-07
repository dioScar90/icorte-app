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
*/

httpClient.interceptors.response.use(
  response => {
    // Acessando a mensagem e a URI criada
    // const message = response.data?.message;
    // const locationUri = response.headers['location']; // A URI que você procura

    // console.log('data:', response.data);
    // console.log('Created URI:', locationUri);

    console.log('firstResponse', response)
    return response
  },
  (error) => {
    console.log('errorrrrrr', error)
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
