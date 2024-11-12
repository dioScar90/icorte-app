import { PaginationResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { Service } from "@/types/models/service";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleRepository {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): PaginationResult<DateOnly>;
  getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]): PaginationResult<TimeOnly>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): PaginationResult<TopBarberShop>;
  searchServicesByNameAsync(q: string): PaginationResult<Service>;
}
