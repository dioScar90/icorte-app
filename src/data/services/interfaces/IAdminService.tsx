import { BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";
import { BaseAxiosResult } from "@/data/result";

export interface IAdminService {
  removeAll(data: BaseAdminZod): BaseAxiosResult<void>;
  populateAll(data: BaseAdminZod): BaseAxiosResult<void>;
  populateWithAppointments(data: BaseAdminZod): BaseAxiosResult<void>;
  resetPasswordForSomeUser(data: ResetPasswordZod): BaseAxiosResult<void>;
}
