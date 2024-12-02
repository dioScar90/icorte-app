import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { BaseResult } from "@/data/result";
import { UserByName } from "@/types/custom-models/user-by-name";

export interface IAdminRepository {
  removeAll(data: BaseAdminZod): BaseResult<void>;
  populateAll(data: BaseAdminZod): BaseResult<void>;
  populateWithAppointments(data: AppointmentsAdminZod): BaseResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseResult<void>;
  searchUserByName(q: string): BaseResult<UserByName[]>;
  getLastUsers(take?: number):  BaseResult<UserByName[]>;
}
