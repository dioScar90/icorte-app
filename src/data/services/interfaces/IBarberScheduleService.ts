import { BaseAxiosResult, Pagination, PaginationAxiosResult } from "@/data/result";
import { ServiceByName } from "@/types/custom-models/service-by-name";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/utils/types/date";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): BaseAxiosResult<DateOnly[]>;
  getAvailableSlots(barberShopId: number, date: DateOnly, serviceIds: number[]): BaseAxiosResult<TimeOnly[]>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly, pag?: Pagination): PaginationAxiosResult<TopBarberShop>;
  searchServicesByNameAsync(q: string, pag?: Pagination): PaginationAxiosResult<ServiceByName>;
}
