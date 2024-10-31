import { createContext, PropsWithChildren, useContext } from "react"
import axios, { AxiosInstance } from 'axios'

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

type EssaBuceta = [string, {
  message: string | undefined;
  types: {
      [k: string]: string;
  } | undefined;
}][]

export class UnprocessableEntityError extends Error {
  constructor(
    readonly title: string,
    readonly errors: { string: string[] },
  ) {
    super('Problemas...')
    // this.title = title
    // this.errors = errors
  }

  get errorsEntries(): EssaBuceta {
    return Object.entries(this.errors)
      .map(([key, values]) => {
        const name = key
        const options = {
          message: values.length > 1 ? undefined : values[0],
          types: values.length === 1 ? undefined : Object.fromEntries(values.map((value, i) => [`item_${i}`, value])),
        }

        return [name, options]
      })
  }
}

httpClient.interceptors.response.use(
  response => {
    console.log('firstResponse', response)
    return response
  },
  (error) => {
    console.log('errorrrrrr', error)
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject('Problemas de conexão. Tente novamente mais tarde.')
    }

    if (error.config.url === '/auth/login' && error.response.status === 401) {
      return Promise.reject('Usuário ou senha inválidos')
    }

    if (error.response.status === 422 && error.response.status.title === 'UnprocessableEntity') {
      const title = error.response.data.detail
      const errors = error.response.data.errors
      return Promise.reject(new UnprocessableEntityError(title, errors))
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
