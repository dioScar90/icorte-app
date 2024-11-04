import { BaseAxiosResult } from "@/data/result";
import { UserEmailUpdateType, UserPasswordUpdateType, UserPhoneNumberUpdateType } from "@/schemas/user"
import { UserMe } from "@/types/models/user";

export interface IUserService {
  getMe(): BaseAxiosResult<UserMe>;
  changeEmail(data: UserEmailUpdateType): BaseAxiosResult<boolean>;
  changePassword(data: UserPasswordUpdateType): BaseAxiosResult<boolean>;
  changePhoneNumber(data: UserPhoneNumberUpdateType): BaseAxiosResult<boolean>;
  delete(): BaseAxiosResult<boolean>;
}
