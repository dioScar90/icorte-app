import { BaseAxiosResult } from "@/data/result";
import { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"
import { UserMe } from "@/types/models/user";

export interface IUserService {
  getMe(): BaseAxiosResult<UserMe>;
  changeEmail(data: UserEmailUpdateZod): BaseAxiosResult<void>;
  changePassword(data: UserPasswordUpdateZod): BaseAxiosResult<void>;
  changePhoneNumber(data: UserPhoneNumberUpdateZod): BaseAxiosResult<void>;
  delete(): BaseAxiosResult<void>;
}
