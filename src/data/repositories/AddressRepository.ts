import { IAddressRepository } from "./interfaces/IAddressRepository";
import { IAddressService } from "../services/interfaces/IAddressService";
import { Result } from "@/data/result";
import { AddressZod } from "@/schemas/address";

export class AddressRepository implements IAddressRepository {
  constructor(private readonly service: IAddressService) { }

  async createAddress(barberShopId: number, data: AddressZod) {
    try {
      const res = await this.service.createAddress(barberShopId, data);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async getAddress(barberShopId: number, id: number) {
    try {
      const res = await this.service.getAddress(barberShopId, id);
      return Result.Success(res.data)
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async updateAddress(barberShopId: number, id: number, data: AddressZod) {
    try {
      await this.service.updateAddress(barberShopId, id, data);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }

  async deleteAddress(barberShopId: number, id: number) {
    try {
      await this.service.deleteAddress(barberShopId, id);
      return Result.Success()
    } catch (err) {
      return Result.Failure(err as Error)
    }
  }
}
