import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { BarberShopZod } from "@/schemas/barberShop";
import { AppointmentByBarberShop } from "@/types/custom-models/appointment-by-barber-shop";
import { BarberShop } from "@/types/models/barberShop";

export interface IBarberShopService {
  createBarberShop(data: BarberShopZod): CreatedAxiosResult<BarberShop>;
  getBarberShop(id: number): BaseAxiosResult<BarberShop>;
  getAppointmentsByBarberShop(barberShopId: number): PaginationAxiosResult<AppointmentByBarberShop>;
  updateBarberShop(id: number, data: BarberShopZod): BaseAxiosResult<void>;
  deleteBarberShop(id: number): BaseAxiosResult<void>;
}
