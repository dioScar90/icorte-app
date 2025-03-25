import type { BarberShopZod } from "@/schemas/barberShop";
import type { AppointmentByBarberShop } from "@/types/custom-models/appointment-by-barber-shop";
import type { BarberShop } from "@/types/models/barberShop";
import type { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";

export interface IBarberShopService {
  createBarberShop(data: BarberShopZod): CreatedResult<BarberShop>;
  getBarberShop(id: number): BaseResult<BarberShop>;
  getAppointmentsByBarberShop(barberShopId: number, pag?: Pagination): PaginationResult<AppointmentByBarberShop>;
  updateBarberShop(id: number, data: BarberShopZod): BaseResult<void>;
  deleteBarberShop(id: number): BaseResult<void>;
}
