import { AxiosResponse } from "axios"

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

  static Success<T>(value: T) {
    return new Result(value)
  }

  static Failure(error: Error) {
    return new Result(null, error)
  }
}

type CreatedResponse<T> = {
  item: T
  message?: string
}

export type BaseResult<T> = Promise<Result<T | null>>
export type CreatedResult<T> = Promise<Result<CreatedResponse<T> | null>>

export type BaseAxiosResult<T> = Promise<AxiosResponse<T | null>>
export type CreatedAxiosResult<T> = Promise<AxiosResponse<CreatedResponse<T> | null>>

export type NullableResult<T> = Result<T | null>
