import { UserRegisterZod, UserLoginZod } from "@/schemas/user";
import { IAuthRepository } from "./interfaces/IAuthRepository";
import { IAuthService } from "../services/interfaces/IAuthService";
import { Result } from "@/data/result";

export class AuthRepository implements IAuthRepository {
  constructor(private readonly service: IAuthService) {}

  async register(data: UserRegisterZod) {
    try {
      const res = await this.service.register(data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async login(data: UserLoginZod) {
    try {
      await this.service.login(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
  
  async logout() {
    try {
      await this.service.logout();
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
