import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { BaseResult } from "@/data/result";

export interface IAdminRepository {
  removeAll(data: BaseAdminZod): BaseResult<void>;
  populateAll(data: BaseAdminZod): BaseResult<void>;
  populateWithAppointments(data: AppointmentsAdminZod): BaseResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseResult<void>;
}
