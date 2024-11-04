import { BaseResult, CreatedResult } from "@/data/result";
import { BarberShopType } from "@/schemas/barberShop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopRepository {
  createBarberShop(data: BarberShopType): CreatedResult<BarberShop>;
  getBarberShop(id: number): BaseResult<BarberShop>;
  updateBarberShop(id: number, data: BarberShopType): BaseResult<boolean>;
  deleteBarberShop(id: number): BaseResult<boolean>;
}
