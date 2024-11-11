import { BaseResult, CreatedResult } from "@/data/result";
import { ProfileZod } from "@/schemas/profile";
import { Profile } from "@/types/models/profile";

export interface IProfileRepository {
  createProfile(data: ProfileZod): CreatedResult<Profile>;
  getProfileById(id: number): BaseResult<Profile>;
  updateProfile(id: number, data: ProfileZod): BaseResult<void>;
  updateProfileImage(id: number, file: File): BaseResult<void>;
}
