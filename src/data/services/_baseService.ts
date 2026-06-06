import { BaseFetch } from "./_baseFetch";

export abstract class BaseService<TEntity, TZod> extends BaseFetch {
  constructor(
    protected readonly httpClient: ConstructorParameters<typeof BaseFetch>[0],
    protected readonly getUrl: (...ids: any[]) => string,
  ) {
    super(httpClient)
  }
  
  async create(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._post<TEntity>(url, data)
  }
  
  async get(...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._get<TEntity>(url)
  }
  
  async getAll(url: string) {
    return await this._getAll<TEntity>(url)
  }
  
  async update(data: TZod, ...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._put(url, data)
  }
  
  async delete(...ids: any[]) {
    const url = this.getUrl(...ids)
    return await this._delete(url)
  }
}
