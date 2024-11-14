import { BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { BaseResult } from "@/data/result";

export interface IAdminRepository {
  removeAll(data: BaseAdminZod): BaseResult<void>;
  populateAll(data: BaseAdminZod): BaseResult<void>;
  populateWithAppointments(data: BaseAdminZod): BaseResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseResult<void>;
}
