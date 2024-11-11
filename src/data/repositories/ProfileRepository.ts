import { Result } from "@/data/result";
import { IProfileRepository } from "./interfaces/IProfileRepository";
import { ProfileZod } from "@/schemas/profile";
import { IProfileService } from "../services/interfaces/IProfileService";

export class ProfileRepository implements IProfileRepository {
  constructor(private readonly service: IProfileService) { }

  async createProfile(data: ProfileZod) {
    try {
      const res = await this.service.createProfile(data)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getProfileById(id: number) {
    try {
      const res = await this.service.getProfileById(id)
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateProfile(id: number, data: ProfileZod) {
    try {
      await this.service.updateProfile(id, data)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateProfileImage(id: number, file: File) {
    try {
      await this.service.updateProfileImage(id, file)
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
