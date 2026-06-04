import type { ProxyContext } from "@/hooks/use-proxy";
import { Result, type BaseResult, type PaginationResult } from "@/data/result";

type RouteDetails = {
  route: Lowercase<string>,
  method: keyof ProxyContext,
  mustReturn: boolean,
  isPagination: boolean,
}

export abstract class BaseCustomService<
    TRoutesDetails extends Record<string, RouteDetails>,
    TKey extends keyof TRoutesDetails = keyof TRoutesDetails,
> {
  constructor(
    protected readonly httpClient: ProxyContext,
    protected readonly ROUTES_DETAILS: TRoutesDetails,
  ) {}
  
  protected async _fetch<
    TReturn = void,
  >(routeKey: TKey, ...[url, ...rest]: Parameters<ProxyContext[TRoutesDetails[TKey]['method']]>) {
    const { method, mustReturn, isPagination } = this.ROUTES_DETAILS[routeKey]
    
    try {
      if (!mustReturn) {
        await this.httpClient[method]<TReturn>(url, ...rest)
        return Result.Success()
      }
      
      if (isPagination) {
        const res = await this.httpClient[method]<PaginationResult<TReturn>['data']>(url, ...rest)
        return Result.Pagination(res.data)
      }
      
      const res = await this.httpClient[method]<BaseResult<TReturn>['data']>(url, ...rest)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
