import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleRepository {
  createRecurringSchedule(barberShpoId: number, data: RecurringScheduleZod): CreatedResult<RecurringSchedule>;
  getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShpoId: number): PaginationResult<RecurringSchedule>;
  updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseResult<void>;
  deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseResult<void>;
}
