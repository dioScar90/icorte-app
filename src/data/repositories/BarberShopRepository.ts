import { Result } from "@/data/result";
import { IBarberShopRepository } from "./interfaces/IBarberShopRepository";
import { BarberShopZod } from "@/schemas/barberShop";
import { IBarberShopService } from "../services/interfaces/IBarberShopService";

export class BarberShopRepository implements IBarberShopRepository {
  constructor(private readonly service: IBarberShopService) { }

  async createBarberShop(data: BarberShopZod) {
    try {
      const res = await this.service.createBarberShop(data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getBarberShop(id: number) {
    try {
      const res = await this.service.getBarberShop(id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
  
  async getAppointmentsByBarberShop(barberShopId: number) {
    try {
      const res = await this.service.getAppointmentsByBarberShop(barberShopId);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateBarberShop(id: number, data: BarberShopZod) {
    try {
      await this.service.updateBarberShop(id, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteBarberShop(id: number) {
    try {
      await this.service.deleteBarberShop(id);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
