import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { RecurringScheduleZod } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/utils/types/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleService {
  createRecurringSchedule(barberShpoId: number, data: RecurringScheduleZod): CreatedAxiosResult<RecurringSchedule>;
  getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<RecurringSchedule>;
  getAllRecurringSchedules(barberShpoId: number): PaginationAxiosResult<RecurringSchedule>;
  updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleZod): BaseAxiosResult<void>;
  deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): BaseAxiosResult<void>;
}
