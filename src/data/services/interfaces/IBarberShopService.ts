import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { BarberShopZod } from "@/schemas/barberShop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopService {
  createBarberShop(data: BarberShopZod): CreatedAxiosResult<BarberShop>;
  getBarberShop(id: number): BaseAxiosResult<BarberShop>;
  updateBarberShop(id: number, data: BarberShopZod): BaseAxiosResult<void>;
  deleteBarberShop(id: number): BaseAxiosResult<void>;
}
