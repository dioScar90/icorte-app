import { TopBarberShop } from "@/types/models/barberShop";
import { DateOnly, TimeOnly } from "@/types/models/date";
import { AxiosResponse } from "axios";

export interface IBarberScheduleService {
  getAvailableDatesForBarber(barberShopId: number, dateOfWeek: DateOnly): Promise<AxiosResponse<DateOnly[]>>;
  getAvailableSlots(barberShopId: number, date: DateOnly): Promise<AxiosResponse<TimeOnly[]>>;
  getTopBarbersWithAvailability(dateOfWeek: DateOnly): Promise<AxiosResponse<TopBarberShop[]>>;
}
