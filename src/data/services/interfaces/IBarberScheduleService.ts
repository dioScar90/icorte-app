import { BaseAxiosResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/types/models/date";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): BaseAxiosResult<DateOnly[]>;
  getAvailableSlots(barberShopId: number, date: DateOnly): BaseAxiosResult<TimeOnly[]>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): BaseAxiosResult<TopBarberShop[]>;
}
