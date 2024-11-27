import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { AddressZod } from "@/schemas/address";
import { Address } from "@/types/models/address";

export interface IAddressService {
  createAddress(barberShopId: number, data: AddressZod): CreatedAxiosResult<Address>;
  getAddress(barberShopId: number, id: number): BaseAxiosResult<Address>;
  updateAddress(barberShopId: number, id: number, data: AddressZod): BaseAxiosResult<void>;
  deleteAddress(barberShopId: number, id: number): BaseAxiosResult<void>;
}
