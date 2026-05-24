import type { ProxyContext } from "@/hooks/use-proxy";
import { type BaseResult, type PaginationResult, Result } from "@/data/result";

export abstract class BaseService<TEntity, TZod> {
  constructor(
    protected readonly httpClient: ProxyContext,
    protected readonly getUrl: (...ids: any[]) => string,
  ) {}
  
  async create(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    
    try {
      const res = await this.httpClient.post<BaseResult<TEntity>['data']>(url, data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async get(...ids: any[]) {
    const url = this.getUrl(...ids)
    
    try {
      const res = await this.httpClient.get<BaseResult<TEntity>['data']>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async getAll(url: string) {
    try {
      const res = await this.httpClient.get<PaginationResult<TEntity>['data']>(url)
      return Result.Pagination(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async update(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    
    try {
      await this.httpClient.put(url, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async delete(...ids: any[]) {
    const url = this.getUrl(...ids)
    
    try {
      await this.httpClient.delete(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
