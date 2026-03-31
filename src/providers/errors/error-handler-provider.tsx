import { createContext, useCallback, useContext, useState, type PropsWithChildren } from "react";

import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { type HistoryState } from '@tanstack/react-router'

type PropsToastMustHave<K> = [K, {
  message: string,
  description?: string,
}]

type PropsErrorsToDispach<K> = [K, { message: string }]

class FieldError<K extends string = string> extends Error {
  private readonly title: string
  private readonly errors: Record<K, string[]>

  constructor(errors: Record<K, string[]>, title?: string, message?: string) {
    super(message)
    this.title = title ?? 'Campos inválidos'
    this.errors = errors
  }

  getToastOptions() {
    const propsArr: PropsToastMustHave<K>[] = []

    for (const key in this.errors) {
      propsArr.push([
        key,
        {
          message: this?.title ?? this.errors[key][0],
          description: this?.title ? this.errors[key][0] : undefined,
        }
      ])
    }

    return propsArr
  }

  getFormErrorOptions(): PropsErrorsToDispach<K>[] {
    const propsArr: PropsErrorsToDispach<K>[] = []

    for (const key in this.errors) {
      propsArr.push([key, { message: this.errors[key][0] }])
    }

    return propsArr
  }
}

export class UnprocessableEntityError extends FieldError {
  constructor(errors: DataResponseError['errors'], title: DataResponseError['title']) {
    const message = 'Erro no login'
    super(errors ?? {}, title, message)
  }
}

export class InvalidUsernameOrPasswordError extends FieldError {
  constructor() {
    const message = 'Usuário ou senha inválidos'
    const errors = { root: [message] }
    const title = 'Erro no login'
    super(errors, title, message)
  }
}

type DataResponseError = {
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
}

export function isDataResponseError(data: unknown): data is DataResponseError {
  if (!data) {
    return false
  }

  if (typeof data !== 'object') {
    return false
  }
  
  if (!('title' in data && 'status' in data && 'detail' in data && 'errors' in data)) {
    return false
  }
  
  return typeof data?.title === 'string'
    && typeof data?.status === 'number'
    && typeof data?.detail === 'string'
    && typeof data?.errors === 'object'
}

export class BaseDataError extends Error {
  private readonly title: string
  private readonly detail: string
  private readonly errors: Record<string, string[]>

  constructor({ title, status, detail, errors }: DataResponseError) {
    super('Erro avassalador')
    this.title = (status ?? 500) + ' - ' + (title ?? 'Erro')
    this.detail = detail ?? 'Erro desconhecido, tente novamente'
    this.errors = errors ?? {}
  }

  private getHtmlForSwalBody() {
    return `
      <p>${this.detail}</p>
      <ul>
        ${Object.entries(this.errors).map(([_, values]) => `
          <li>=> ${values[0]}</li>
        `)}
      </ul>
    `
  }

  getSwalOptions() {
    return {
      icon: 'error',
      title: this.title,
      message: this.getHtmlForSwalBody(),
      isHtml: true,
    } satisfies AlertWithMessage
  }
}

export class NetworkConnectionError extends Error {
  constructor() {
    super('Problemas de conexão. Tente novamente mais tarde.')
  }
}

function getAlertDetails(error: Error | string | unknown) {
  if (error instanceof BaseDataError) {
    return error.getSwalOptions()
  }

  if (error instanceof Error) {
    return {
      icon: 'error',
      title: 'title' in error && typeof error.title === 'string' ? error.title : undefined,
      message: error.message,
    } satisfies AlertWithMessage
  }

  return {
    icon: 'error',
    message: error === 'string' ? error : 'Erro desconhecido, tente novamente',
  } satisfies AlertWithMessage
}

function handler
  <
    TForm extends FieldValues,
    KField extends "root" | `root.${string}` | Path<TForm>,
  >
  (error: Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) {
  if (!error) {
    return
  }

  const isReactHookForm = (form: any): form is UseFormReturn<TForm> => !!form
  const isFieldError = (err: any): err is FieldError<KField> => err instanceof FieldError
  const isKeyFromPath = (key: string): key is Path<TForm> => !key.startsWith('root')

  console.log('error', error)
  console.log('reactHookForm', reactHookForm)

  if (isReactHookForm(reactHookForm) && isFieldError(error)) {
    const toForm = error.getFormErrorOptions()
    console.log('toForm', toForm)
    toForm.forEach(item => reactHookForm.setError(...item))

    let lastValidKey: Path<TForm> | undefined

    for (const [key, { message, description }] of error.getToastOptions()) {
      toast.error(message, { description })

      lastValidKey = isKeyFromPath(key) ? key : lastValidKey
    }

    if (lastValidKey) {
      reactHookForm.setFocus(lastValidKey)
    }

    return
  }

  return getAlertDetails(error)
}

type AlertWithMessage = NonNullable<HistoryState['alert']>

type ErrorsContextType = {
  handleError: (...args: Parameters<typeof handler>) => void
  clearErrors: () => void
  alert: ReturnType<typeof handler> | null
}

const ErrorHandler = createContext<ErrorsContextType | null>(null)

export function ErrorHandlerProvider({ children }: PropsWithChildren) {
  const [alert, _setAlert] = useState<ErrorsContextType['alert']>()

  const clearErrors: ErrorsContextType['clearErrors'] = useCallback(() => _setAlert(null), [])

  const handleError: ErrorsContextType['handleError'] = useCallback((...args) => {
    const newAlert = handler(...args)

    _setAlert(
      !!newAlert && typeof newAlert === 'object' && 'message' in newAlert
        ? { ...newAlert }
        : null
    )
  }, [])

  return (
    <ErrorHandler value={{ handleError, clearErrors, alert }}>
      {children}
    </ErrorHandler>
  )
}

export function useErrorHandler() {
  const context = useContext(ErrorHandler)

  if (!context) {
    throw new Error('useErrorHandler must be used within an ErrorHandlerProvider');
  }

  return context satisfies ErrorsContextType
}

export type HandleError = ReturnType<typeof useErrorHandler>['handleError']
