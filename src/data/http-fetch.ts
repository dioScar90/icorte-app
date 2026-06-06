import { httpClient } from "@/data/http-client";
import { Result, type BaseResult, type PaginationResult } from "@/data/result";

// singleton
export class HttpFetch {
  private static instance: HttpFetch
  
  private constructor() {}
  
  public static getInstance(): HttpFetch {
    if (!HttpFetch.instance) {
      HttpFetch.instance = new HttpFetch()
    }
    
    return HttpFetch.instance
  }

  async post<TEntity>(...args: Parameters<typeof httpClient.post>) {
    try {
      const res = await httpClient.post<BaseResult<TEntity>['data']>(...args)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async get<TEntity>(...args: Parameters<typeof httpClient.get>) {
    try {
      const res = await httpClient.get<BaseResult<TEntity>['data']>(...args)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async getAll<TEntity>(...args: Parameters<typeof httpClient.get>) {
    try {
      const res = await httpClient.get<PaginationResult<TEntity>['data']>(...args)
      return Result.Pagination(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async put(...args: Parameters<typeof httpClient.put>) {
    try {
      await httpClient.put(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async patch(...args: Parameters<typeof httpClient.patch>) {
    try {
      await httpClient.patch(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  async delete(...args: Parameters<typeof httpClient.delete>) {
    try {
      await httpClient.delete(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
