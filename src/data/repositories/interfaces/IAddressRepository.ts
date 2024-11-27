import { BaseResult, CreatedResult } from "@/data/result";
import { AddressZod } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressRepository {
  createAddress(barberShopId: number, data: AddressZod): CreatedResult<Address>;
  getAddress(barberShopId: number, id: number): BaseResult<Address>;
  updateAddress(barberShopId: number, id: number, data: AddressZod): BaseResult<void>;
  deleteAddress(barberShopId: number, id: number): BaseResult<void>;
}
