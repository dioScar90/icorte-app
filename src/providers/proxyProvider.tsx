import { createContext, PropsWithChildren, useContext } from "react"
import axios, { AxiosInstance } from 'axios'
import { FieldValues, Path, UseFormSetError } from "react-hook-form"
import { useToast } from "@/hooks/use-toast"
import { Result } from "@/data/result"

console.log('import.meta.env.VITE_BASE_URL', import.meta.env.VITE_BASE_URL)

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

type UnprocessableEntityToastOptions = {
  variant: 'destructive',
  title?: string,
  description: string,
}

type UnprocessableEntityToastMatrix<K> = [K, UnprocessableEntityToastOptions][]

function getToastOptions<K extends string = string>(errors: Record<K, string[]>, title?: string) {
  const vamos: UnprocessableEntityToastMatrix<K> = []

  for (const key in errors) {
    vamos.push([
      key,
      {
        variant: 'destructive',
        title: title,
        description: errors[key][0],
        // types: values.length === 1 ? undefined : Object.fromEntries(values.map((value, i) => [`item_${i}`, value])),
      }
    ])
  }

  return vamos
}

function displayToastAndFormErrors<T extends FieldValues, K extends "root" | `root.${string}` | Path<T>>
  (setError: UseFormSetError<T>, errors: Record<K, string[]>, title?: string) {
  const { toast } = useToast()
  
  return getToastOptions(errors, title)
    .map(([key, vamos]) => {
      setError(key, { message: vamos.description })
      toast(vamos)
    })
}

export class UnprocessableEntityError extends Error {
  constructor(
    readonly title: string,
    readonly errors: Record<string, string[]>) {
    super('Problemas...')
  }
  
  get toastOptions() {
    return getToastOptions(this.errors)
  }

  displayToastAndFormErrors<T extends FieldValues>(setError: UseFormSetError<T>) {
    displayToastAndFormErrors(setError, this.errors, this.title)
  }
  
  static throwNewPromiseReject(title: string, errors: { string: string[] }) {
    return Promise.reject(new UnprocessableEntityError(title, errors))
  }
}

export class InvalidUsernameOrPasswordError extends Error {
  private readonly title
  private readonly errors: Record<'root', string[]>

  constructor() {
    super('Usuário ou senha inválidos')
    this.title = 'Erro no login'
    this.errors = { root: [this.message] }
  }
  
  get toastOptions() {
    return getToastOptions(this.errors, this.title)
  }

  displayToastAndFormErrors<T extends FieldValues>(setError: UseFormSetError<T>) {
    displayToastAndFormErrors(setError, this.errors, this.title)
  }
  
  static throwNewPromiseReject() {
    return Promise.reject(new InvalidUsernameOrPasswordError())
  }
}

export class NetworkConnectionError extends Error {
  constructor() {
    super('Problemas de conexão. Tente novamente mais tarde.')
  }
}

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
      const title = error.response.data.detail
      const errors = error.response.data.errors
      return UnprocessableEntityError.throwNewPromiseReject(title, errors)
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
