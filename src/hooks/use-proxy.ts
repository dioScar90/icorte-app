import { BaseDataError, InvalidUsernameOrPasswordError, isDataResponseError, NetworkConnectionError, UnprocessableEntityError } from '@/providers/errors/error-handler-provider'

type Method = 'get' | 'post' | 'patch' | 'put' | 'delete'
type FetchOptions = Parameters<typeof fetch>[1]
type Headers = NonNullable<FetchOptions>['headers']

async function _fetch(url: string, options?: FetchOptions, method?: Method, data?: any, headers?: Headers) {
  const fullUrl = import.meta.env.VITE_BASE_URL + url

  method ??= 'get'
  
  return await fetch(fullUrl, {
    method,
    headers: {
      'Content-Type': 'application/json',
      /*
        There is no need to set 'Authorization: `Bearer ${token}`' because
        once we're using cookies and 'credentials: true' the token will automatically
        be sent.

        The URL to be redirected is not coming in 201 Created Responses inside
        'response.headers.location' for some reason . Nothing I tried to do worked.
        I'm redirecting it by myself then.
      */
      ...headers,
    },
    body: typeof data === 'undefined' ? undefined : JSON.stringify(data),
    credentials: 'include', // equivalent to withCredentials
    ...(options ?? {})
  })
}

async function getDataOrError<T>(res: Awaited<ReturnType<typeof fetch>>): Promise<T | Error> {
  let data: T
  
  try {
    data = await res.json() as T
  } catch (err) {
    if (err instanceof SyntaxError) {
      return err
    }

    return new Error('Erro desconhecido')
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

async function _get<T = void>(url: string, options?: FetchOptions) {
  const res = await _fetch(url, options)
  const value = await getDataOrError<T>(res)
  
  if (value instanceof Error) {
    throw value
  }
  
  return {
    data: value
  }
}

async function _post<T = void>(url: string, data?: any, options?: FetchOptions) {
  const res = await _fetch(url, options, 'post', data)
  const value = await getDataOrError<T>(res)
  
  if (value instanceof Error) {
    throw value
  }
  
  return {
    data: value
  }
}

async function _patch<T = void>(url: string, data?: any, options?: FetchOptions) {
  const res = await _fetch(url, options, 'patch', data)
  const value = await getDataOrError<T>(res)
  
  if (value instanceof Error) {
    throw value
  }
  
  return {
    data: value
  }
}

async function _put<T = void>(url: string, data?: any, options?: FetchOptions) {
  const res = await _fetch(url, options, 'put', data)
  const value = await getDataOrError<T>(res)
  
  if (value instanceof Error) {
    throw value
  }
  
  return {
    data: value
  }
}

async function _delete<T = void>(url: string, options?: FetchOptions) {
  const res = await _fetch(url, options, 'delete')
  const value = await getDataOrError<T>(res)
  
  if (value instanceof Error) {
    throw value
  }
  
  return {
    data: value
  }
}

const httpClient = {
  get: _get,
  post: _post,
  patch: _patch,
  put: _put,
  delete: _delete,
} as const

export const useProxy = () => httpClient

export type ProxyContext = ReturnType<typeof useProxy>
