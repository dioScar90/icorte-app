import type { ServiceByName } from "@/types/custom-models/service-by-name";
import type { TopBarberShop } from "@/types/models/barberShop";
import type { DateString } from "@/utils/types/date-string";
import type { TimeString } from "@/utils/types/time-string";
import type { BaseResult, Pagination, PaginationResult } from "@/data/result";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateString): BaseResult<DateString[]>;
  getAvailableSlots(barberShopId: number, date: DateString, serviceIds: number[]): BaseResult<TimeString[]>;
  getTopBarbersWithAvailability(dateOfWeek: DateString, pag?: Pagination): PaginationResult<TopBarberShop>;
  searchServicesByNameAsync(q: string, pag?: Pagination): PaginationResult<ServiceByName>;
}
