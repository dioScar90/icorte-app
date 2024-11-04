import { BaseResult, CreatedResult } from "@/data/result";
import { ProfileType } from "@/schemas/profile";
import { Profile } from "@/types/models/profile";

export interface IProfileRepository {
  createProfile(data: ProfileType): CreatedResult<Profile>;
  getProfileById(id: number): BaseResult<Profile>;
  updateProfile(id: number, data: ProfileType): BaseResult<boolean>;
  updateProfileImage(id: number, file: File): BaseResult<boolean>;
}
