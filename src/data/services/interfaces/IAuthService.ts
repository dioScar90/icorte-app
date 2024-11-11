import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { UserLoginZod, UserRegisterZod } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IAuthService {
  register(data: UserRegisterZod): CreatedAxiosResult<UserMe>;
  login(data: UserLoginZod): BaseAxiosResult<void>;
  logout(): BaseAxiosResult<void>;
}
