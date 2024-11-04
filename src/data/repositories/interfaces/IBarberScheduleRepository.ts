import { BaseResult } from "@/data/result";
import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/types/models/date";

export interface IBarberScheduleRepository {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): BaseResult<DateOnly[]>;
  getAvailableSlots(barberShopId: number, date: DateOnly): BaseResult<TimeOnly[]>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): BaseResult<TopBarberShop[]>;
}
