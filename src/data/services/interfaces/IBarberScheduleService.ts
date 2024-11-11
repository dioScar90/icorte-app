import { PaginationAxiosResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): PaginationAxiosResult<DateOnly>;
  getAvailableSlots(barberShopId: number, date: DateOnly): PaginationAxiosResult<TimeOnly>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): PaginationAxiosResult<TopBarberShop>;
}
