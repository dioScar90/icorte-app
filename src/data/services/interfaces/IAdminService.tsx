import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { BaseAxiosResult } from "@/data/result";
import { UserByName } from "@/types/custom-models/user-by-name";

export interface IAdminService {
  removeAll(data: BaseAdminZod): BaseAxiosResult<void>;
  populateAll(data: BaseAdminZod): BaseAxiosResult<void>;
  populateWithAppointments(data: AppointmentsAdminZod): BaseAxiosResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseAxiosResult<void>;
  searchUserByName(q: string): BaseAxiosResult<UserByName[]>;
  getLastUsers(take?: number): BaseAxiosResult<UserByName[]>;
}
