// import { createContext, PropsWithChildren, useContext } from "react"
import axios, { AxiosError } from 'axios'
// import { BaseDataError, InvalidUsernameOrPasswordError, NetworkConnectionError, UnprocessableEntityError } from "@/hooks/use-error"
import { BaseDataError, InvalidUsernameOrPasswordError, NetworkConnectionError, UnprocessableEntityError } from '@/providers/errors/error-handler-provider'

console.log('baseurl', import.meta.env.VITE_BASE_URL)

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
    const suamae = error as AxiosError

    suamae.response?.data
    if (error.code === 'ERR_NETWORK') {
      return Promise.reject(new NetworkConnectionError())
    }

    if (error.config.url === '/auth/login' && error.response.status === 401) {
      return InvalidUsernameOrPasswordError.rejectedPromise()
    }

    if (error.response.status === 422 && error.response.data.title === 'UnprocessableEntity') {
      const title: string = error.response.data.detail
      const errors: Record<string, string[]> = error.response.data.errors
      return UnprocessableEntityError.rejectedPromise(errors, title)
    }

    if ('detail' in error.response.data || 'errors' in error.response.data) {
      return BaseDataError.rejectedPromise(error.response.data)
    }

    return Promise.reject(error)
  }
)

export const useProxy = () => httpClient

export type ProxyContext = ReturnType<typeof useProxy>
