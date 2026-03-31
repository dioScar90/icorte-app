// import { createContext, PropsWithChildren, useContext } from "react"
import { BaseDataError, InvalidUsernameOrPasswordError, isDataResponseError, NetworkConnectionError, UnprocessableEntityError } from '@/providers/errors/error-handler-provider'

type Method = 'get' | 'post' | 'put' | 'delete'
type FetchOptions = Parameters<typeof fetch>[1]

function getFetchParams(url: string, options?: FetchOptions, method?: Method, data?: any) {
  const fullUrl = import.meta.env.VITE_BASE_URL + url
  
  const requestParams = {
    method: method ?? 'get',
    headers: {
      'Content-Type': 'application/json',
    },
    body: typeof data === 'undefined' ? undefined : JSON.stringify(data),
    credentials: 'include', // equivalent to withCredentials
    ...(options ?? {})
  } satisfies FetchOptions
  
  return [fullUrl, requestParams] as const
}

async function getDataOrError<T>(res: Awaited<ReturnType<typeof fetch>>): Promise<T | null | Error> {
  let data: T | null
  
  try {
    data = await res.json() as T
  } catch (_) {
    data = null
  }
  
  if (res.ok) {
    return data
  }
  
  if (res.statusText === 'ERR_NETWORK') {
    return new NetworkConnectionError()
  }
  
  if (res.url.endsWith('/auth/login') && res.status === 401) {
    return new InvalidUsernameOrPasswordError()
  }
  
  if (!isDataResponseError(data)) {
    return new Error(String(data))
  }
  
  if (res.status === 422 && data?.title === 'UnprocessableEntity') {
    return new UnprocessableEntityError(data?.errors, data?.detail)
  }
  
  if ('detail' in data || 'errors' in data) {
    return new BaseDataError(data)
  }
  
  return new Error('Erro desconhecido')
}

async function _get(url: string, options?: FetchOptions) {
  try {
    const res = await fetch(...getFetchParams(url, options))

    return {
      data: await getDataOrError(res)
    }
  } catch (err) {
    return err
  }
}

async function _post(url: string, data?: any, options?: FetchOptions) {
  try {
    const res = await fetch(...getFetchParams(url, options, 'post', data))

    return {
      data: await getDataOrError(res)
    }
  } catch (err) {
    return err
  }
}

async function _put(url: string, data?: any, options?: FetchOptions) {
  try {
    const res = await fetch(...getFetchParams(url, options, 'put', data))

    return {
      data: await getDataOrError(res)
    }
  } catch (err) {
    return err
  }
}

async function _delete(url: string, options?: FetchOptions) {
  try {
    const res = await fetch(...getFetchParams(url, options, 'delete'))

    return {
      data: await getDataOrError(res)
    }
  } catch (err) {
    return err
  }
}

const httpClient = {
  get: _get,
  post: _post,
  put: _put,
  delete: _delete,
} as const

/*
  There is no need to set 'config.headers.Authorization = `Bearer ${token}`' because
  once we're using cookies and 'withCredentials: true' the token will automatically
  be sent.

  The URL to be redirected is not coming in 201 Created Responses inside
  'response.headers.location' for some reason . Nothing I tried to do worked.
  I'm redirecting it by myself then.
*/

export const useProxy = () => httpClient

export type ProxyContext = ReturnType<typeof useProxy>
