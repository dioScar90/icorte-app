import { IServiceRepository } from "./interfaces/IServiceRepository";
import { IServiceService } from "../services/interfaces/IServiceService";
import { Result } from "@/data/result";
import { ServiceZod } from "@/schemas/service";

export class ServiceRepository implements IServiceRepository {
  constructor(private readonly service: IServiceService) { }

  async createService(barberShopId: number, data: ServiceZod) {
    try {
      const res = await this.service.createService(barberShopId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
  
  async getService(barberShopId: number, serviceId: number) {
    try {
      const res = await this.service.getService(barberShopId, serviceId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAllServices(barberShopId: number) {
    try {
      const res = await this.service.getAllServices(barberShopId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateService(barberShopId: number, serviceId: number, data: ServiceZod) {
    try {
      await this.service.updateService(barberShopId, serviceId, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteService(barberShopId: number, serviceId: number) {
    try {
      await this.service.deleteService(barberShopId, serviceId);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
