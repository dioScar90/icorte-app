import { FieldValues, Path, UseFormReturn } from "react-hook-form"
import { SweetAlertOptions } from "sweetalert2"
import { ToastProps } from "@/components/ui/toast"

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

function handleError<TForm extends FieldValues, K extends "root" | `root.${string}` | Path<TForm>>(
  error: FieldError<K> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>)
{
  const returnValues = {
    form: [] as PropsErrorsToDispach<K>[],
    toast: [] as ToastProps[],
    swal: [] as SweetAlertOptions[],
  }
  
  if (!error) {
    return returnValues
  }
  
  if (reactHookForm && error instanceof FieldError) {
    const fieldError: FieldError<K> = error
    
    fieldError.getFormErrorOptions()
      .forEach(item => returnValues.form.push(item))
      
    fieldError.getToastOptions()
      .forEach(([_, value]) => returnValues.toast.push(value))

    return returnValues
  }
  
  if (error instanceof Error) {
    returnValues.swal.push({
      icon: 'error',
      title: 'title' in error ? (error.title ?? undefined) : undefined,
      text: error.message,
    })

    return returnValues
  }
  
  returnValues.swal.push({
    icon: 'error',
    text: error === 'string' ? error : 'Erro desconhecido, tente novamente',
  })
  
  return returnValues
}

export function useError() {
  return {
    handleError,
  }
}
