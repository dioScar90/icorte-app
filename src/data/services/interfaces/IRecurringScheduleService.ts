import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleService {
  createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod): CreatedAxiosResult<RecurringSchedule>;
  getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShopId: number): PaginationAxiosResult<RecurringSchedule>;
  updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseAxiosResult<void>;
  deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<void>;
}
