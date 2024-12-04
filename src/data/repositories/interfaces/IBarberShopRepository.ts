import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { BarberShopZod } from "@/schemas/barberShop";
import { AppointmentByBarberShop } from "@/types/custom-models/appointment-by-barber-shop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopRepository {
  createBarberShop(data: BarberShopZod): CreatedResult<BarberShop>;
  getBarberShop(id: number): BaseResult<BarberShop>;
  getAppointmentsByBarberShop(barberShopId: number): PaginationResult<AppointmentByBarberShop>;
  updateBarberShop(id: number, data: BarberShopZod): BaseResult<void>;
  deleteBarberShop(id: number): BaseResult<void>;
}
