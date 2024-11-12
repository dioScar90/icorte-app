// ErrorContext.tsx
import { toast } from '@/hooks/use-toast';
import { createContext, PropsWithChildren, useCallback, useContext } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Swal, { SweetAlertOptions } from 'sweetalert2';

type PropsToastMustHave<K> = [K, {
  variant: 'destructive',
  title?: string,
  description: string,
}]

type PropsErrorsToDispach<K> = [K, { message: string }]

type ErrorHandlerContextType = {
  handleError:
  <TForm extends FieldValues, KField extends "root" | `root.${string}` | Path<TForm>>
    (error: FieldError<KField> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>)
    => void
}

const ErrorHandlerContext = createContext<ErrorHandlerContextType | undefined>(undefined);

export function useHandleErrors() {
  const context = useContext(ErrorHandlerContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorHandlerProvider');
  }

  return context;
};

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
          variant: 'destructive',
          title: this.title,
          description: this.errors[key][0],
          // types: values.length === 1 ? undefined : Object.fromEntries(values.map((value, i) => [`item_${i}`, value])),
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

  private getHtmlForSwalBody() {
    // return (
    //   <>
    //     <p>{this.detail}</p>
    //     <ul>
    //       {Object.entries(this.errors).map(([key, values]) => (
    //         <li key={key}>{'=>'} {values[0]}</li>
    //       ))}
    //     </ul>
    //   </>
    // )

    const div = document.createElement('div')

    div.innerHTML = `
      <p>${this.detail}</p>
      <ul>
        ${Object.entries(this.errors).map(([_, values]) => `
          <li>=> ${values[0]}</li>
        `)}
      </ul>
    `
    return div

  }

  getSwalOptions() {
    return {
      icon: 'error',
      title: this.title,
      html: this.getHtmlForSwalBody()
    } as SweetAlertOptions
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

export function HandleErrorProvider({ children }: PropsWithChildren) {
  const handleError = useCallback(function
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

      for (const [key, value] of error.getToastOptions()) {
        console.log('keys', [key, value])
        toast(value)
        lastValidKey = isKeyFromPath(key) ? key : lastValidKey
      }

      if (lastValidKey) {
        reactHookForm.setFocus(lastValidKey)
      }

      return
    }

    if (error instanceof BaseDataError) {
      Swal.fire(error.getSwalOptions())
      return
    }

    if (error instanceof Error) {
      Swal.fire({
        icon: 'error',
        title: 'title' in error ? (error.title ?? undefined) : undefined,
        text: error.message,
      })
      return
    }

    Swal.fire({
      icon: 'error',
      text: error === 'string' ? error : 'Erro desconhecido, tente novamente',
    })
  }, [])

  return (
    <ErrorHandlerContext.Provider value={{ handleError }}>
      {children}
    </ErrorHandlerContext.Provider>
  )
}



