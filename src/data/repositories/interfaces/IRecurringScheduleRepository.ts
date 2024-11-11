import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { RecurringScheduleType } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleRepository {
  createRecurringSchedule(barberShpoId: number, data: RecurringScheduleType): CreatedResult<RecurringSchedule>;
  getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShpoId: number): PaginationResult<RecurringSchedule>;
  updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleType): BaseResult<boolean>;
  deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseResult<boolean>;
}
