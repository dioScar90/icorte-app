import { BaseAxiosResult, CreatedAxiosResult } from "@/data/result";
import { BarberShopType } from "@/schemas/barberShop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopService {
  createBarberShop(data: BarberShopType): CreatedAxiosResult<BarberShop>;
  getBarberShop(id: number): BaseAxiosResult<BarberShop>;
  updateBarberShop(id: number, data: BarberShopType): BaseAxiosResult<boolean>;
  deleteBarberShop(id: number): BaseAxiosResult<boolean>;
}
