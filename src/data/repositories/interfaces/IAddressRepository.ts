import { BaseResult, CreatedResult } from "@/data/result";
import { AddressZod } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressRepository {
  createAddress(barberShpoId: number, data: AddressZod): CreatedResult<Address>;
  getAddress(barberShpoId: number, id: number): BaseResult<Address>;
  updateAddress(barberShpoId: number, id: number, data: AddressZod): BaseResult<void>;
  deleteAddress(barberShpoId: number, id: number): BaseResult<void>;
}
