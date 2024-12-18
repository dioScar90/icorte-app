import { IProfileService } from "./interfaces/IProfileService"
import { ProfileZod } from "@/schemas/profile"
import { AxiosInstance } from "axios"

enum UrlType {
  IMAGE = 'image',
}

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

export class ProfileService implements IProfileService {
  constructor(private readonly httpClient: AxiosInstance) {}

  async createProfile(data: ProfileZod) {
    const url = getUrl()
    return await this.httpClient.post(url, data)
  }

  async getProfileById(id: number) {
    const url = getUrl(id)
    return await this.httpClient.get(url)
  }

  async updateProfile(id: number, data: ProfileZod) {
    const url = getUrl(id)
    return await this.httpClient.put(url, data)
  }

  async updateProfileImage(id: number, file: File) {
    const formData = new FormData()
    formData.append('file', file)
    
    const url = getUrl(id, UrlType.IMAGE)
    return await this.httpClient.patch(url, formData)
  }
}
