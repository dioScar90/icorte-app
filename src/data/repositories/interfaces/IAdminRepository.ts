import { BaseResult } from "@/data/result";

export interface IAdminRepository {
  removeAll(data: { passphrase: string }): BaseResult<void>;
}
