import { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user";
import { IUserRepository } from "./interfaces/IUserRepository";
import { Result } from "@/data/result";
import { IUserService } from "../services/interfaces/IUserService";

export class UserRepository implements IUserRepository {
  constructor(private readonly service: IUserService) { }

  async getMe() {
    try {
      const res = await this.service.getMe();
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async changeEmail(data: UserEmailUpdateZod) {
    try {
      await this.service.changeEmail(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async changePassword(data: UserPasswordUpdateZod) {
    try {
      await this.service.changePassword(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async changePhoneNumber(data: UserPhoneNumberUpdateZod) {
    try {
      await this.service.changePhoneNumber(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async delete() {
    try {
      await this.service.delete();
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
