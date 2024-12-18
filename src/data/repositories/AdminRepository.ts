import { Result } from "@/data/result";
import { IAdminRepository } from "./interfaces/IAdminRepository";
import { IAdminService } from "../services/interfaces/IAdminService";
import { AppointmentsAdminZod, BaseAdminZod, ResetPasswordZod } from "@/components/layouts/admin-layout";

export class AdminRepository implements IAdminRepository {
  constructor(private readonly service: IAdminService) { }

  async removeAll(data: BaseAdminZod) {
    try {
      await this.service.removeAll(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async populateAll(data: BaseAdminZod) {
    try {
      await this.service.populateAll(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async populateWithAppointments(data: AppointmentsAdminZod) {
    try {
      await this.service.populateWithAppointments(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async resetPasswordForSomeUser(data: ResetPasswordZod) {
    try {
      await this.service.resetPasswordForSomeUser(data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
  
  async searchUserByName(q: string) {
    try {
      const res = await this.service.searchUserByName(q);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
  
  async getLastUsers(take?: number) {
    try {
      const res = await this.service.getLastUsers(take);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
