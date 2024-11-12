import { Result } from "@/data/result";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { IAdminService } from "../services/interfaces/IAdminService";
import { RemoveAllZod } from "@/components/layouts/admin-layout";

export class AdminRepository implements IAdminRepository {
  constructor(private readonly service: IAdminService) { }

  async removeAll(data: RemoveAllZod) {
    try {
      await this.service.removeAll(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
