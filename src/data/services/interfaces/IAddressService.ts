import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { AddressType } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressService {
  createAddress(barberShpoId: number, data: AddressType): CreatedAxiosResult<Address>;
  getAddress(barberShpoId: number, id: number): BaseAxiosResult<Address>;
  updateAddress(barberShpoId: number, id: number, data: AddressType): BaseAxiosResult<boolean>;
  deleteAddress(barberShpoId: number, id: number): BaseAxiosResult<boolean>;
}
