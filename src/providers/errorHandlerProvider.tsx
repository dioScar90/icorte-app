// ErrorContext.tsx
import { ToastProps } from '@/components/ui/toast';
import React, { createContext, PropsWithChildren, useContext } from 'react';
import { FieldValues, Path, UseFormReturn } from 'react-hook-form';
import Swal, { SweetAlertOptions } from 'sweetalert2';

type PropsToastMustHave<K> = [K, {
  variant: 'destructive',
  title?: string,
  description: string,
}]

type PropsErrorsToDispach<K> = [K, { message: string }]





// type HandleErrorFunccc<TForm extends FieldValues, K extends "root" | `root.${string}` | Path<TForm>> = {
//   (error: FieldError<K> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>): {
//     form: PropsErrorsToDispach<K>[];
//     toast: ToastProps[];
//     swal: SweetAlertOptions[];
//   };
// }

// type AgoraVaiSentar = HandleErrorFunccc<FieldValues, "root" | `root.${string}` | Path<FieldValues>>

type ReturnedErrorObj<TForm extends FieldValues, K extends "root" | `root.${string}` | Path<TForm>> = {
  form: PropsErrorsToDispach<K>[]
  toast: ToastProps[]
  swal: SweetAlertOptions[]
}

type HandleErrorFunc =
  <
    TForm extends FieldValues,
    KField extends "root" | `root.${string}` | Path<TForm>,
    R = ReturnedErrorObj<TForm, KField>
  >
  (error: FieldError<KField> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) => R

type HandleErrorGetInitialObjFunc =
  <
    TForm extends FieldValues,
    KField extends "root" | `root.${string}` | Path<TForm>,
  >
  (error: FieldError<KField> | Error | string | unknown) => ReturnedErrorObj<TForm, KField>



type IsFieldErrorFunc =
  <
    TForm extends FieldValues,
    KField extends "root" | `root.${string}` | Path<TForm>,
  >
  (error: FieldError<KField> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) =>
  error is FieldError<KField>
  // {
  //   form: PropsErrorsToDispach<K>[];
  //   toast: ToastProps[];
  //   swal: SweetAlertOptions[];
  // }

interface ErrorHandlerContextType {
  showToastError: (message: string) => void;
  showSwalError: (message: string) => void;
  showParagraphError: (message: string) => void;
}

const ErrorContext = createContext<ErrorHandlerContextType | undefined>(undefined);

export function ErrorHandlerProvider({ children }: PropsWithChildren) {
  const showToastError = (message: string) => {
    toast.error(message);
  };

  const showSwalError = (message: string) => {
    Swal.fire({ icon: 'error', title: 'Oops...', text: message });
  };

  const showParagraphError = (message: string) => {
    document.getElementById('error-container')!.innerText = message;
  };

  return (
    <ErrorContext.Provider value={{ showToastError, showSwalError, showParagraphError }}>
      {children}
    </ErrorContext.Provider>
  );
};

export function useError() {
  const context = useContext(ErrorContext);

  if (!context) {
    throw new Error('useError must be used within an ErrorHandlerProvider');
  }

  return context;
};



// type PropsToastMustHave<K> = [K, {
//   variant: 'destructive',
//   title?: string,
//   description: string,
// }]

// type PropsErrorsToDispach<K> = [K, { message: string }]

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

// const getInitialObj: HandleErrorGetInitialObjFunc = function(error) {
//   return {
//     form: [],
//     toast: [],
//     swal: [],
//   }
// }

// const IsFieldError: IsFieldErrorFunc = function(error, reactHookForm) {
//   return reactHookForm && error instanceof FieldError
// }

// function getInitialObj<TFunc extends HandleErrorFunc>() {
//   return {
//     form: [],
//     toast: [],
//     swal: [],
//   } as ReturnType<TFunc>
// }

function handleErrorrrr
  <
    TForm extends FieldValues,
    KField extends "root" | `root.${string}` | Path<TForm>,
    // R = ReturnedErrorObj<TForm, KField>
  >
  (error: FieldError<KField> | Error | string | unknown, reactHookForm?: UseFormReturn<TForm>) {
  const returnValues = {
    form: [],
    toast: [],
    swal: [],
  } as ReturnedErrorObj<TForm, KField>
  
  if (!error) {
    return returnValues
  }
  
  if (reactHookForm && error instanceof FieldError) {
    const fieldError: FieldError<KField> = error
    
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



