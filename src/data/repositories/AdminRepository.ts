import { Result } from "@/data/result";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { IAdminService } from "../services/interfaces/IAdminService";

export class AdminRepository implements IAdminRepository {
  constructor(private readonly service: IAdminService) { }

  async removeAllRows(data: { passphrase: string }) {
    try {
      await this.service.removeAllRows(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
