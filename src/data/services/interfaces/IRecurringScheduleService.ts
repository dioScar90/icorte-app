import type { DayOfWeek } from "@/utils/types/datetime/day-of-week";
import type { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import type { RecurringSchedule } from "@/types/models/recurringSchedule";
import type { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";

export interface IRecurringScheduleService {
  createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod): CreatedResult<RecurringSchedule>;
  getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShopId: number, pag?: Pagination): PaginationResult<RecurringSchedule>;
  updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseResult<void>;
  deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<void>;
}
