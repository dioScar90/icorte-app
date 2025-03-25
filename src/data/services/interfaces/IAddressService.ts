import type { AddressZod } from "@/schemas/address";
import type { Address } from "@/types/models/address";
import type { BaseResult, CreatedResult } from "@/data/result";

export interface IAddressService {
  createAddress(barberShopId: number, data: AddressZod): CreatedResult<Address>;
  getAddress(barberShopId: number, id: number): BaseResult<Address>;
  updateAddress(barberShopId: number, id: number, data: AddressZod): BaseResult<void>;
  deleteAddress(barberShopId: number, id: number): BaseResult<void>;
}
