import { BaseResult } from "@/data/result";
import { UserEmailUpdateType, UserPasswordUpdateType, UserPhoneNumberUpdateType } from "@/schemas/user";
import { UserMe } from "@/types/models/user";

export interface IUserRepository {
  getMe(): BaseResult<UserMe>;
  changeEmail(data: UserEmailUpdateType): BaseResult<boolean>;
  changePassword(data: UserPasswordUpdateType): BaseResult<boolean>;
  changePhoneNumber(data: UserPhoneNumberUpdateType): BaseResult<boolean>;
  delete(): BaseResult<boolean>;
}
