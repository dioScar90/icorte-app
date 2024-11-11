import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { ProfileZod } from "@/schemas/profile";
import { Profile } from "@/types/models/profile";

export interface IProfileService {
  createProfile(data: ProfileZod): CreatedAxiosResult<Profile>;
  getProfileById(id: number): BaseAxiosResult<Profile>;
  updateProfile(id: number, data: ProfileZod): BaseAxiosResult<void>;
  updateProfileImage(id: number, file: File): BaseAxiosResult<void>;
}
