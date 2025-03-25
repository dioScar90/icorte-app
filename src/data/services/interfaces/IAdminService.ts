import type { BaseResult } from "@/data/result";
import type { UserByName } from "@/types/custom-models/user-by-name";
import type { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/routes/(authenticated-only)/admin/route";

export interface IAdminService {
  removeAll(data: BaseAdminZod): BaseResult<void>;
  populateAll(data: BaseAdminZod): BaseResult<void>;
  populateWithAppointments(data: AppointmentsAdminZod): BaseResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseResult<void>;
  searchUserByName(q: string): BaseResult<UserByName[]>;
  getLastUsers(take?: number): BaseResult<UserByName[]>;
}
