import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { DayOfWeek } from "@/utils/types/day-of-week";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleService {
  createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod): CreatedResult<RecurringSchedule>;
  getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShopId: number, pag?: Pagination): PaginationResult<RecurringSchedule>;
  updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseResult<void>;
  deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<void>;
}
