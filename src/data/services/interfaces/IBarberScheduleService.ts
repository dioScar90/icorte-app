import { BaseResult, Pagination, PaginationResult } from "@/data/result";
import { ServiceByName } from "@/types/custom-models/service-by-name";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateString } from "@/utils/types/date-string";
import { TimeString } from "@/utils/types/time-string";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateString): BaseResult<DateString[]>;
  getAvailableSlots(barberShopId: number, date: DateString, serviceIds: number[]): BaseResult<TimeString[]>;
  getTopBarbersWithAvailability(dateOfWeek: DateString, pag?: Pagination): PaginationResult<TopBarberShop>;
  searchServicesByNameAsync(q: string, pag?: Pagination): PaginationResult<ServiceByName>;
}
