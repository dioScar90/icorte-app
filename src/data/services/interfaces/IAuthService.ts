import type { UserLoginZod, UserRegisterZod } from "@/schemas/user";
import type { UserMe } from "@/types/models/user";
import type { BaseResult, CreatedResult } from "@/data/result";

export interface IAuthService {
  register(data: UserRegisterZod): CreatedResult<UserMe>;
  login(data: UserLoginZod): BaseResult<void>;
  logout(): BaseResult<void>;
}
