import type { ProxyContext } from "@/hooks/use-proxy";
import { type BaseResult, type CreatedResult, type Pagination, Result } from "@/data/result";

export class BaseService<TEntity, TZod> {
  constructor(
    protected readonly httpClient: ProxyContext,
    protected readonly getUrl: (...ids: any[]) => string,
    protected readonly getQueryParams: (pag?: Pagination) => string,
  ) {}
  
  async create(data: TZod) {
    const url = this.getUrl()
    
    try {
      const res = await this.httpClient.post<CreatedResult<TEntity>>(url, data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async get(...ids: number[]) {
    const url = this.getUrl(...ids)
    
    try {
      const res = await this.httpClient.get<BaseResult<TEntity>>(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async update(data: TZod, ...ids: number[]) {
    const url = this.getUrl(...ids)
    
    try {
      await this.httpClient.put<BaseResult<void>>(url, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
  
  async delete(...ids: number[]) {
    const url = this.getUrl(...ids)
    
    try {
      await this.httpClient.delete<BaseResult<void>>(url)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
