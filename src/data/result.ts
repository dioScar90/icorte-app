import { z } from "zod"

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
    
    const pagination = paginationSchemaValidation.safeParse(p).data?.pagination ?? getSafePagination()
    
    return {
      error: null,
      data: {
        items,
        pagination,
      },
    } satisfies PaginationResult<TValue>
  },
} as const

function getSafePagination(values?: Partial<Pagination>) {
  const p = {
    totalItems: 0,
    totalPages: 0,
    page: 1,
    pageSize: 0,
    next: 0,
    prev: 0,
  } satisfies Pagination
  
  if (typeof values === 'undefined') {
    return p
  }
  
  for (const _key in p) {
    const key = _key as keyof Pagination
    p[key] = +values[key]! || p[key]
  }
  
  p.page = p.totalPages > 0 ? Math.min(p.page, p.totalPages) : 1
  p.next = p.totalPages > 0 ? Math.min(p.page + 1, p.totalPages) : 0
  p.prev = p.totalPages > 0 ? Math.min(p.page - 1, 1) : 0
  
  return p
}

export const paginationSchemaValidation = z.object({
  pagination: z.object({
    totalPages: z.number().int().min(0).catch(0),
    totalItems: z.number().int().min(0).catch(0),
    pageSize: z.number().int().min(0).catch(0),
    page: z.number().int().min(1).catch(1),
    next: z.number().int().min(1).optional().catch(1),
    prev: z.number().int().min(1).optional().catch(1),
  }).transform(getSafePagination).optional(),
}) satisfies z.ZodType<{
  pagination?: Pagination
}>
