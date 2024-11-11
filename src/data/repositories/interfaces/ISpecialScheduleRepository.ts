import { BaseResult, CreatedResult, PaginationResult } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateOnly } from "@/utils/types/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleRepository {
  createSpecialSchedule(barberShpoId: number, data: SpecialScheduleZod): CreatedResult<SpecialSchedule>;
  getSpecialSchedule(barberShpoId: number, date: DateOnly): BaseResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShpoId: number): PaginationResult<SpecialSchedule>;
  updateSpecialSchedule(barberShpoId: number, date: DateOnly, data: SpecialScheduleZod): BaseResult<void>;
  deleteSpecialSchedule(barberShpoId: number, date: DateOnly): BaseResult<void>;
}
