import type { ProxyContext } from "@/hooks/use-proxy";
import { Result, type BaseResult, type PaginationResult } from "@/data/result";

type RouteDetails = {
  readonly [K in Uppercase<string>]: {
    readonly key: K,
    readonly route: Lowercase<string>,
    readonly method: keyof ProxyContext,
    readonly mustReturn: boolean,
    readonly isPagination: boolean,
  }
}

export abstract class BaseCustomService {
  constructor(
    protected readonly httpClient: ProxyContext,
    protected readonly ROUTE_DETAILS: RouteDetails,
  ) {}
  
  protected async _fetch<
    TReturn = void,
    TRouteKey extends keyof RouteDetails = keyof RouteDetails,
  >(routeKey: TRouteKey, ...[url, ...rest]: Parameters<ProxyContext[RouteDetails[TRouteKey]['method']]>) {
    const { method, mustReturn, isPagination } = this.ROUTE_DETAILS[routeKey]
    
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
