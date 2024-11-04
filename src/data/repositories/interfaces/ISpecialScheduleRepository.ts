import { BaseResult, CreatedResult } from "@/data/result";
import { SpecialScheduleType } from "@/schemas/specialSchedule";
import { DateOnly } from "@/types/models/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleRepository {
  createSpecialSchedule(barberShpoId: number, data: SpecialScheduleType): CreatedResult<SpecialSchedule>;
  getSpecialSchedule(barberShpoId: number, date: DateOnly): BaseResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShpoId: number): BaseResult<SpecialSchedule[]>;
  updateSpecialSchedule(barberShpoId: number, date: DateOnly, data: SpecialScheduleType): BaseResult<boolean>;
  deleteSpecialSchedule(barberShpoId: number, date: DateOnly): BaseResult<boolean>;
}
