import { BaseResult, CreatedResult } from "@/data/result";
import { BarberShopZod } from "@/schemas/barberShop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopRepository {
  createBarberShop(data: BarberShopZod): CreatedResult<BarberShop>;
  getBarberShop(id: number): BaseResult<BarberShop>;
  updateBarberShop(id: number, data: BarberShopZod): BaseResult<void>;
  deleteBarberShop(id: number): BaseResult<void>;
}
