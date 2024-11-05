import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { RecurringScheduleType } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/types/models/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleService {
  createRecurringSchedule(barberShpoId: number, data: RecurringScheduleType): CreatedAxiosResult<RecurringSchedule>;
  getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShpoId: number): PaginationAxiosResult<RecurringSchedule>;
  updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleType): BaseAxiosResult<boolean>;
  deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<boolean>;
}
