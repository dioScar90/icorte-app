import { BaseAxiosResult } from "@/data/result";

export interface IAdminService {
  removeAllRows(data: { passphrase: string }): BaseAxiosResult<void>;
}
