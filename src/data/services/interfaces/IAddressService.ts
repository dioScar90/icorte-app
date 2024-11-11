import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { AddressZod } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressService {
  createAddress(barberShpoId: number, data: AddressZod): CreatedAxiosResult<Address>;
  getAddress(barberShpoId: number, id: number): BaseAxiosResult<Address>;
  updateAddress(barberShpoId: number, id: number, data: AddressZod): BaseAxiosResult<void>;
  deleteAddress(barberShpoId: number, id: number): BaseAxiosResult<void>;
}
