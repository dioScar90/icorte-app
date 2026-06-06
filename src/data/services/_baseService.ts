import { HttpFetch } from "../http-fetch";

export abstract class BaseService<TEntity, TZod> {
  protected readonly _fetch: HttpFetch
  
  constructor(
    protected readonly getUrl: (...ids: any[]) => string,
  ) {
    this._fetch = HttpFetch.getInstance()
  }

  async create(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.post<TEntity>(url, data)
  }

  async get(...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._fetch.get<TEntity>(url)
  }

  async getAll(url: string) {
    return await this._fetch.getAll<TEntity>(url)
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
