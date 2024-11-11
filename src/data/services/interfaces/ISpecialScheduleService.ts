import { BaseAxiosResult, CreatedAxiosResult, PaginationAxiosResult } from "@/data/result";
import { SpecialScheduleZod } from "@/schemas/specialSchedule";
import { DateOnly } from "@/utils/types/date";
import { SpecialSchedule } from "@/types/models/specialSchedule";

export interface ISpecialScheduleService {
  createSpecialSchedule(barberShpoId: number, data: SpecialScheduleZod): CreatedAxiosResult<SpecialSchedule>;
  getSpecialSchedule(barberShpoId: number, date: DateOnly): BaseAxiosResult<SpecialSchedule>;
  getAllSpecialSchedules(barberShpoId: number): PaginationAxiosResult<SpecialSchedule>;
  updateSpecialSchedule(barberShpoId: number, date: DateOnly, data: SpecialScheduleZod): BaseAxiosResult<void>;
  deleteSpecialSchedule(barberShpoId: number, date: DateOnly): BaseAxiosResult<void>;
}
