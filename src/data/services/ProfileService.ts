import { ProxyContext } from "@/hooks/use-proxy"
import { IProfileService as Interface } from "./interfaces/IProfileService"
import { Result } from "../result"

type UrlType = [
  'image',
][number]

function getUrl(id?: number, final?: UrlType) {
  const baseEndpoint = `/profile`

  if (!id) {
    return baseEndpoint
  }

  if (!final) {
    return `${baseEndpoint}/${id}`
  }
  
  return `${baseEndpoint}/${id}/${final}`
}

export class ProfileService implements Interface {
  constructor(private readonly httpClient: ProxyContext) {}

  createProfile: Interface['createProfile'] = async (data) => {
    const url = getUrl()
    
    try {
      const res = await this.httpClient.post(url, data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  getProfileById: Interface['getProfileById'] = async (id) => {
    const url = getUrl(id)
    
    try {
      const res = await this.httpClient.get(url)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateProfile: Interface['updateProfile'] = async (id, data) => {
    const url = getUrl(id)
    
    try {
      await this.httpClient.put(url, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }

  updateProfileImage: Interface['updateProfileImage'] = async (id, file) => {
    const url = getUrl(id, 'image')
    
    try {
      const formData = new FormData()
      formData.append('file', file)

      await this.httpClient.patch(url, formData)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err)
    }
  }
}
