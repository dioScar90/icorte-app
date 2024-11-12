import { PaginationAxiosResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { Service } from "@/types/models/service";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): PaginationAxiosResult<DateOnly>;
  getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]): PaginationAxiosResult<TimeOnly>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): PaginationAxiosResult<TopBarberShop>;
  searchServicesByNameAsync(q: string): PaginationAxiosResult<Service>;
}
