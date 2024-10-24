import { UserEmailUpdateType, UserPasswordUpdateType, UserPhoneNumberUpdateType } from "@/schemas/user";
import { IUserRepository } from "./interfaces/IUserRepository";
import { UserMe } from "@/types/models/user";
import { Result } from "@/data/result";
import { IUserService } from "../services/interfaces/IUserService";

export class UserRepository implements IUserRepository {
  constructor(private readonly service: IUserService) { }

  async getMe() {
    try {
      const res = await this.service.getMe();
      console.log('res', res)
      return Result.Success(res.data)
    } catch (err) {
      console.log('err', err)
      return Result.Failure<UserMe>(err as Error)
    }
  }

  changeEmail(data: UserEmailUpdateType): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
  changePassword(data: UserPasswordUpdateType): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
  changePhoneNumber(data: UserPhoneNumberUpdateType): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
  delete(): Promise<Result<boolean>> {
    throw new Error("Method not implemented.");
  }
}
