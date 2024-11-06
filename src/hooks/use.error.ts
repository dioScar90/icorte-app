import { FieldValues, Path, UseFormSetError, UseFormReturn } from "react-hook-form"

type PropsToastMustHave<K> = [K, {
  variant: 'destructive',
  title?: string,
  description: string,
}]

type PropsErrorsToDispach<K> = [K, { message: string }]

function getToastOptions<K extends string = string>(errors: Record<K, string[]>, title?: string) {
  const vamos: PropsToastMustHave<K>[] = []

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

function getFormErrorOptions<K extends string = string>(errors: Record<K, string[]>) {
  const vamos: PropsErrorsToDispach<K>[] = []

  for (const key in errors) {
    vamos.push([key, { message: errors[key][0] }])
  }

  return vamos
}

// function displayToastAndFormErrors<T extends FieldValues, K extends "root" | `root.${string}` | Path<T>>
//   (setError: UseFormSetError<T>, errors: Record<K, string[]>, title?: string) {
//   const { toast } = useToast()
  
//   return getToastOptions(errors, title)
//     .map(([key, vamos]) => {
//       setError(key, { message: vamos.description })
//       toast(vamos)
//     })
// }

// interface IFieldError<K extends string = string> extends Error {
//   getToastOptions: () => PropsToastMustHave<K>[]
// }

class FieldError<K extends string = string> extends Error {
  private readonly title
  private readonly errors: Record<K, string[]>

  constructor(errors: Record<K, string[]>, title?: string, message?: string) {
    super(message)
    this.title = title
    this.errors = errors
  }

  getToastOptions() {
    return getToastOptions(this.errors, this.title)
  }

  getFormErrorOptions() {
    return getFormErrorOptions(this.errors)
  }
}

export class UnprocessableEntityError extends FieldError {
  constructor(errors: Record<string, string[]>, title: string) {
    const message = 'Erro no login'
    super(errors, title, message)
  }
  
  static throwNewPromiseReject(errors: Record<string, string[]>, title: string) {
    return Promise.reject(new UnprocessableEntityError(errors, title))
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
    return Promise.reject(new InvalidUsernameOrPasswordError())
  }
}

export class NetworkConnectionError extends Error {
  constructor() {
    super('Problemas de conexão. Tente novamente mais tarde.')
  }
}

function handleError<
    TForm extends FieldValues,
    K extends "root" | `root.${string}` | Path<TForm>,
  >(_: UseFormReturn<TForm>, error: FieldError<K> | Error): {
    toastItems: PropsToastMustHave<K>[]
    formItems: PropsErrorsToDispach<K>[]
  } {
  const emptyObjToReturn = { toastItems: [], formItems: [] }

  if (!error) {
    return emptyObjToReturn
  }
  
  if (error instanceof FieldError) {
    const toastItems = (error as FieldError<K>).getToastOptions()
    const formItems = (error as FieldError<K>).getFormErrorOptions()
    return { toastItems, formItems }
  }

  return emptyObjToReturn
}

export function useError() {
  return {
    handleError,
  }
}
