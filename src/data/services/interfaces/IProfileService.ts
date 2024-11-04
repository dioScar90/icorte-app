import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { ProfileType } from "@/schemas/profile";
import { Profile } from "@/types/models/profile";

export interface IProfileService {
  createProfile(data: ProfileType): CreatedAxiosResult<Profile>;
  getProfileById(id: number): BaseAxiosResult<Profile>;
  updateProfile(id: number, data: ProfileType): BaseAxiosResult<boolean>;
  updateProfileImage(id: number, file: File): BaseAxiosResult<boolean>;
}
