import { PaginationResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleRepository {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): PaginationResult<DateOnly>;
  getAvailableSlots(barberShopId: number, date: DateOnly): PaginationResult<TimeOnly>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): PaginationResult<TopBarberShop>;
}
