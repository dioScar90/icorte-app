import { BaseResult, CreatedResult } from "@/data/result";
import { UserLoginZod, UserRegisterZod } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IAuthRepository {
  register(data: UserRegisterZod): CreatedResult<UserMe>;
  login(data: UserLoginZod): BaseResult<void>;
  logout(): BaseResult<void>;
}
