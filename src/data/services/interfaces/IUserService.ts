import type { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user"
import type { UserMe } from "@/types/models/user";
import type { BaseResult } from "@/data/result";

export interface IUserService {
  getMe(): BaseResult<UserMe>;
  changeEmail(data: UserEmailUpdateZod): BaseResult<void>;
  changePassword(data: UserPasswordUpdateZod): BaseResult<void>;
  changePhoneNumber(data: UserPhoneNumberUpdateZod): BaseResult<void>;
  delete(): BaseResult<void>;
}
