import { Result } from "@/data/result";
import { RecurringScheduleType } from "@/schemas/recurringSchedule";
import { DayOfWeek } from "@/types/models/date";
import { RecurringSchedule } from "@/types/models/recurringSchedule";

export interface IRecurringScheduleRepository {
  createRecurringSchedule(barberShpoId: number, data: RecurringScheduleType): Promise<Result<boolean>>;
  getRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): Promise<Result<RecurringSchedule>>;
  getAllRecurringSchedules(barberShpoId: number): Promise<Result<RecurringSchedule[]>>;
  updateRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek, data: RecurringScheduleType): Promise<Result<boolean>>;
  deleteRecurringSchedule(barberShpoId: number, dayOfWeek: DayOfWeek): Promise<Result<boolean>>;
}
