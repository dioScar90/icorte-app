import { BaseService } from "./_baseService"
import type { Profile } from "@/types/models/profile"
import type { ProfileZod } from "@/schemas/profile"

type UrlType =
  | 'image'

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

export class ProfileService extends BaseService<Profile, ProfileZod> {
  constructor(httpClient: ConstructorParameters<typeof BaseService>[0]) {
    super(httpClient, getUrl)
  }
  
  async createProfile(data: ProfileZod) {
    return await this.create(data)
  }

  async getProfileById(id: number) {
    return await this.get(id)
  }

  async updateProfile(id: number, data: ProfileZod) {
    return await this.update(data, id)
  }
  
  async updateProfileImage(id: number, file: File) {
    const url = getUrl(id, 'image')
    
    const formData = new FormData()
    formData.append('file', file)

    return await this._patch(url, formData)
  }
}
