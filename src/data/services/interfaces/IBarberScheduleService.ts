import { PaginationAxiosResult } from "@/data/result";
import { ServiceByName } from "@/types/custom-models/service-by-name";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): PaginationAxiosResult<DateOnly>;
  getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]): PaginationAxiosResult<TimeOnly>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): PaginationAxiosResult<TopBarberShop>;
  searchServicesByNameAsync(q: string): PaginationAxiosResult<ServiceByName>;
}
