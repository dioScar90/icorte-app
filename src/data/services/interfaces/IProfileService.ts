import type { ProfileZod } from "@/schemas/profile";
import type { Profile } from "@/types/models/profile";
import type { BaseResult, CreatedResult } from "@/data/result";

export interface IProfileService {
  createProfile(data: ProfileZod): CreatedResult<Profile>;
  getProfileById(id: number): BaseResult<Profile>;
  updateProfile(id: number, data: ProfileZod): BaseResult<void>;
  updateProfileImage(id: number, file: File): BaseResult<void>;
}
