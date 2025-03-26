// ErrorContext.tsx
import type { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import { toast } from 'sonner';
import { type HistoryState } from '@tanstack/react-router'
import { useCallback } from 'react';
import { Route } from '@/routes';

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
  constructor(errors: Record<string, string[]>, title: string) {
    const message = 'Erro no login'
    super(errors, title, message)
  }

  static throwNewPromiseReject(errors: Record<string, string[]>, title: string) {
    return Promise.reject<UnprocessableEntityError>(new UnprocessableEntityError(errors, title))
  }
}

export class InvalidUsernameOrPasswordError extends FieldError {
  constructor() {
    const message = 'Usuário ou senha inválidos'
    const errors = { root: [message] }
    const title = 'Erro no login'
    super(errors, title, message)
  }

  static throwNewPromiseReject() {
    return Promise.reject<InvalidUsernameOrPasswordError>(new InvalidUsernameOrPasswordError())
  }
}

type DataResponseError = {
  title?: string
  status?: number
  detail?: string
  errors?: Record<string, string[]>
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

  // private getHtmlForSwalBody() {
  //   const div = document.createElement('div')

  //   div.innerHTML = `
  //     <p>${this.detail}</p>
  //     <ul>
  //       ${Object.entries(this.errors).map(([_, values]) => `
  //         <li>=> ${values[0]}</li>
  //       `)}
  //     </ul>
  //   `

  //   return div
  // }

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
    } satisfies HistoryState['alert']
  }

  static throwNewPromiseReject(data?: DataResponseError) {
    return Promise.reject<BaseDataError>(new BaseDataError(data ?? {}))
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
    } satisfies HistoryState['alert']
  }
  
  return {
    icon: 'error',
    message: error === 'string' ? error : 'Erro desconhecido, tente novamente',
  } satisfies HistoryState['alert']
}

export function useError() {
  const navigate = Route.useNavigate()


  const handleError = useCallback(
    <
      TForm extends FieldValues,
      KField extends "root" | `root.${string}` | Path<TForm>,
    >
    (error: Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) => {
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
    
    navigate({
      to: location.pathname,
      params: (prev) => ({ ...prev }),
      search: (prev) => ({ ...prev }),
      state: (prev) => ({
        ...prev,
        alert: getAlertDetails(error),
      }),
    })
  }, [])

  return {
    handleError
  }
}

// export function handleError
//   <
//     TForm extends FieldValues,
//     KField extends "root" | `root.${string}` | Path<TForm>,
//   >
//   (error: Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) {
//   const { pathname } = useLocation()
//   const navigate = useNavigate()

//   if (!error) {
//     return
//   }
  
//   const isReactHookForm = (form: any): form is UseFormReturn<TForm> => !!form
//   const isFieldError = (err: any): err is FieldError<KField> => err instanceof FieldError
//   const isKeyFromPath = (key: string): key is Path<TForm> => !key.startsWith('root')

//   console.log('error', error)
//   console.log('reactHookForm', reactHookForm)

//   if (isReactHookForm(reactHookForm) && isFieldError(error)) {
//     const toForm = error.getFormErrorOptions()
//     console.log('toForm', toForm)
//     toForm.forEach(item => reactHookForm.setError(...item))

//     let lastValidKey: Path<TForm> | undefined

//     for (const [key, { message, description }] of error.getToastOptions()) {
//       toast.error(message, { description })
      
//       lastValidKey = isKeyFromPath(key) ? key : lastValidKey
//     }

//     if (lastValidKey) {
//       reactHookForm.setFocus(lastValidKey)
//     }

//     return
//   }
  
//   navigate({
//     to: pathname,
//     state: {
//       alert: getAlertDetails(error),
//     },
//   })
// }

// export const useError = () => handleError

export type HandleError = ReturnType<typeof useError>['handleError']

