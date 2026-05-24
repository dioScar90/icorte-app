// import { type AxiosResponse } from "axios"
// import { z } from "zod"

// export const getPaginationObj = (page: number, pageSize?: number) => ({ page: Math.max(1, page), pageSize })

export type Pagination = {
  totalItems: number,
  totalPages: number,
  page: number,
  pageSize: number,
  next: number,
  prev: number,
}

export type ErrorResult = {
  error: Error,
  data: null,
}

export type BaseResult<TValue> = {
  error: null,
  data: {
    item: TValue,
    message?: string,
  },
}

export type PaginationResult<TValue> = {
  error: null,
  data: {
    items: TValue[],
    pagination: Pagination,
  },
}

// export type Result<TValue = null, TError = Error | null> = {
//   error: TError,
//   // data: TError extends Error ? null : (BaseResult<TValue> | PaginationResult<TValue>),
//   data: TError extends Error ? null : (BaseResult<TValue> | PaginationResult<TValue>),
// }

export type Result<TValue = null, TError = Error | null> =
  | ErrorResult
  | BaseResult<TValue>
  | PaginationResult<TValue>

export const Result = {
  Failure(_error: unknown) {
    const error = _error instanceof Error
      ? _error
      : new Error(String(_error ?? 'Não foi possível concluir a operação'))
    
    return {
      error: error,
      data: null,
    } satisfies ErrorResult
  },
  Success<TValue = null>({ item, message }: BaseResult<TValue>['data'] = {} as BaseResult<TValue>['data']) {
    return {
      error: null,
      data: {
        item,
        message,
      },
    } satisfies BaseResult<TValue>
  },
  Pagination<TValue>({ items, pagination: p }: PaginationResult<TValue>['data']) {
    if (!Array.isArray(items)) {
      items = []
    }
    
    const pagination = {
      totalPages: +p?.totalPages || 0,
      totalItems: +p?.totalItems || 0,
      pageSize: +p?.pageSize || 0,
      page: +p?.page || 1,
      next: 1,
      prev: 1,
    }
    
    pagination.page = Math.min(pagination.page, pagination.totalPages)
    pagination.next = Math.min(pagination.page + 1, pagination.totalPages)
    pagination.prev = Math.min(pagination.page - 1, 1)
    
    return {
      error: null,
      data: {
        items,
        pagination,
      },
    } satisfies PaginationResult<TValue>
  },
} as const

// export class Result<TValue, TError extends TValue extends null ? Error : null> {
//   #isSuccess: boolean
//   #error: TError
//   #value: TValue
  
//   private constructor(value: TValue, error: TError) {
//     this.#error = error
//     this.#isSuccess = !(this.#error instanceof Error)
//     this.#value = value
//     this.#value = value
//   }
  
//   get isSuccess() {
//     return this.#isSuccess
//   }
  
//   get value() {
//     if (!this.#isSuccess) {
//       throw this.#error!
//     }

//     return this.#value!
//   }
  
//   get error() {
//     return this.#error
//   }

//   static Success<TValue = void>(value?: TValue) {
//     return new Result(value, null)
//   }
  
//   static Failure(error: unknown) {
//     return new Result(null, error instanceof Error ? error : new Error(String(error)))
//   }
// }

// export type BaseResult<TValue> = Promise<Result<TValue | null>>
// export type CreatedResult<TValue> = Promise<Result<CreatedResponse<TValue> | null>>
// export type PaginationResult<TValue> = Promise<Result<PaginationResponse<TValue> | null>>

// // export type BaseAxiosResult<T> = Promise<AxiosResponse<T | null>>
// // export type CreatedAxiosResult<T> = Promise<AxiosResponse<CreatedResponse<T> | null>>
// // export type PaginationAxiosResult<T> = Promise<AxiosResponse<PaginationResponse<T> | null>>

// export const paginationSchemaValidation = z.object({
//   pagination: z.object({
//     totalPages: z.number().int().min(0).catch(0),
//     totalItems: z.number().int().min(0).catch(0),
//     pageSize: z.number().int().min(0).catch(0),
//     page: z.number().int().min(1).catch(1),
//     next: z.number().int().min(1).optional().catch(1),
//     prev: z.number().int().min(1).optional().catch(1),
//   }).transform(values => {
//     if (values.totalPages === 0) {
//       const { next, prev, ...rest } = values
      
//       return {
//         ...rest,
//         page: 1,
//       }
//     }
    
//     const page = Math.min(values.page, values.totalPages)
//     const next = Math.min(page + 1, values.totalPages)
//     const prev = Math.min(page - 1, 1)
    
//     return {
//       ...values,
//       page,
//       next,
//       prev,
//     }
//   }).optional(),
// }) /*satisfies z.ZodType<{
//   pagination?: Omit<PaginationResponse, 'items'> & {
//     next?: number
//     prev?: number
//   }
// }>*/
