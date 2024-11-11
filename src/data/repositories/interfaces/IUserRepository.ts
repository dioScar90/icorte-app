import { BaseResult } from "@/data/result";
import { UserEmailUpdateZod, UserPasswordUpdateZod, UserPhoneNumberUpdateZod } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IUserRepository {
  getMe(): BaseResult<UserMe>;
  changeEmail(data: UserEmailUpdateZod): BaseResult<void>;
  changePassword(data: UserPasswordUpdateZod): BaseResult<void>;
  changePhoneNumber(data: UserPhoneNumberUpdateZod): BaseResult<void>;
  delete(): BaseResult<void>;
}
