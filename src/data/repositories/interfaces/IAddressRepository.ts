import { BaseResult, CreatedResult } from "@/data/result";
import { AddressType } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressRepository {
  createAddress(barberShpoId: number, data: AddressType): CreatedResult<Address>;
  getAddress(barberShpoId: number, id: number): BaseResult<Address>;
  updateAddress(barberShpoId: number, id: number, data: AddressType): BaseResult<boolean>;
  deleteAddress(barberShpoId: number, id: number): BaseResult<boolean>;
}
