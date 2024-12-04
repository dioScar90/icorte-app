import { BaseResult, CreatedResult, Pagination, PaginationResult } from "@/data/result";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleRepository {
  createRecurringSchedule(barberShopId: number, data: RecurringScheduleZod): CreatedResult<RecurringSchedule>;
  getRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShopId: number, pag?: Pagination): PaginationResult<RecurringSchedule>;
  updateRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseResult<void>;
  deleteRecurringSchedule(barberShopId: number, dayOfWeek: DayOfWeek): BaseResult<void>;
}
