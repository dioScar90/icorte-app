import type { ProxyContext } from "@/hooks/use-proxy";
import { Result, type BaseResult, type PaginationResult } from "@/data/result";

export abstract class BaseFetch {
  constructor(
    protected readonly httpClient: ProxyContext,
  ) {}
  
  async _post<TEntity>(...args: Parameters<typeof this.httpClient.post>) {
    try {
      const res = await this.httpClient.post<BaseResult<TEntity>['data']>(...args)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async _get<TEntity>(...args: Parameters<typeof this.httpClient.get>) {
    try {
      const res = await this.httpClient.get<BaseResult<TEntity>['data']>(...args)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async _getAll<TEntity>(...args: Parameters<typeof this.httpClient.get>) {
    try {
      const res = await this.httpClient.get<PaginationResult<TEntity>['data']>(...args)
      return Result.Pagination(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async _put(...args: Parameters<typeof this.httpClient.put>) {
    try {
      await this.httpClient.put(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async _patch(...args: Parameters<typeof this.httpClient.patch>) {
    try {
      await this.httpClient.patch(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async _delete(...args: Parameters<typeof this.httpClient.delete>) {
    try {
      await this.httpClient.delete(...args)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
