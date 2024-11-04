import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { UserLoginType, UserRegisterType } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IAuthService {
  register(data: UserRegisterType): CreatedAxiosResult<UserMe>;
  login(data: UserLoginType): BaseAxiosResult<boolean>;
  logout(): BaseAxiosResult<boolean>;
}
