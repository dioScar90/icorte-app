import { HttpFetch } from "../http-fetch";

export abstract class BaseService<TEntity, TZod> {
  protected readonly _fetch: HttpFetch
  
  constructor(
    protected readonly getUrl: (...ids: any[]) => string,
  ) {
    this._fetch = HttpFetch.getInstance()
  }

  async create<TReturn = TEntity>(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.post<TReturn>(url, data)
  }

  async get<TReturn = TEntity>(...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.get<TReturn>(url)
  }

  async getAll<TReturn = TEntity>(url: string) {
    return await this._fetch.getAll<TReturn>(url)
  }

  async update(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.put(url, data)
  }

  async delete(...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.delete(url)
  }
}
