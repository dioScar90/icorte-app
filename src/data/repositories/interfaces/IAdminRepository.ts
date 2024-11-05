import { BaseResult } from "@/data/result";

export interface IAdminRepository {
  removeAllRows(data: { passphrase: string }): BaseResult<boolean>;
}
