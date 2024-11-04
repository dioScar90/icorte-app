import { BaseResult, CreatedResult } from "@/data/result";
import { UserLoginType, UserRegisterType } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IAuthRepository {
  register(data: UserRegisterType): CreatedResult<UserMe>;
  login(data: UserLoginType): BaseResult<boolean>;
  logout(): BaseResult<boolean>;
}
