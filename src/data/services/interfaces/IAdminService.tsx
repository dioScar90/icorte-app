import { RemoveAllZod } from "@/components/layouts/admin-layout";
import { BaseAxiosResult } from "@/data/result";

export interface IAdminService {
  removeAll(data: RemoveAllZod): BaseAxiosResult<void>;
}
