import { AxiosResponse } from "axios"
import { z } from "zod"

export const getPaginationObj = (page: number, pageSize?: number) => ({ page: Math.max(1, page), pageSize })
export type Pagination = ReturnType<typeof getPaginationObj>

export class Result<T = null> {
  #isSuccess: boolean
  #value?: T
  #error?: Error

  private constructor(value?: T, error?: Error) {
    this.#error = error
    this.#isSuccess = !this.#error
    this.#value = value
    this.#value = value
  }
  
  get isSuccess() {
    return this.#isSuccess
  }
  
  get value() {
    if (!this.#isSuccess) {
      throw this.#error!
    }

    return this.#value!
  }
  
  get error() {
    return this.#error
  }

  static Success<T = void>(value?: T) {
    return new Result(value)
  }

  static Failure(error: unknown) {
    return new Result(null, error instanceof Error ? error : new Error(String(error)))
  }
}

type CreatedResponse<T> = {
  item: T
  message?: string
}

export type PaginationResponse<T = null> = {
  items: T[]
  totalItems: number
  totalPages: number
  page: number
  pageSize: number
}

export type BaseResult<T> = Promise<Result<T | null>>
export type CreatedResult<T> = Promise<Result<CreatedResponse<T> | null>>
export type PaginationResult<T> = Promise<Result<PaginationResponse<T> | null>>

export type BaseAxiosResult<T> = Promise<AxiosResponse<T | null>>
export type CreatedAxiosResult<T> = Promise<AxiosResponse<CreatedResponse<T> | null>>
export type PaginationAxiosResult<T> = Promise<AxiosResponse<PaginationResponse<T> | null>>

export const paginationSchemaValidation = z.object({
  pagination: z.object({
    totalPages: z.number().int().min(0),
    totalItems: z.number().int().min(0),
    pageSize: z.number().int().min(0),
    page: z.number().int().min(1),
    next: z.number().int().min(1).optional(),
    prev: z.number().int().min(1).optional(),
  }).transform(values => {
    if (values.totalPages === 0) {
      const { next, prev, ...rest } = values
      
      return {
        ...rest,
        page: 1,
      }
    }
    
    const page = Math.min(values.page, values.totalPages)
    const next = Math.min(page + 1, values.totalPages)
    const prev = Math.min(page - 1, 1)
    
    return {
      ...values,
      page,
      next,
      prev,
    }
  }).optional(),
}) satisfies z.ZodType<{
  pagination?: Omit<PaginationResponse, 'items'> & {
    next?: number
    prev?: number
  }
}>
